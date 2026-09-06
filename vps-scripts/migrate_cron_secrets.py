#!/usr/bin/env python3
"""
Move inline literal secrets out of root's crontab into 0600 env files.

Guarantees:
  * the program-invocation part of every cron line is left BYTE-IDENTICAL
  * only the env-setup prefix is rewritten
  * shell connectors (&&  vs  ;) are preserved so failure semantics don't change
  * override precedence is preserved (blog Groq key still wins over rkr-secrets.env)

Usage:  migrate_cron_secrets.py --dry-run | --apply
"""
import re, subprocess, sys, os, hashlib, datetime

RKR = "/etc/rkr-secrets.env"
BLOG_ENV = "/etc/blog-secrets.env"
NTFY_ENV = "/etc/ntfy-topics.env"

SECRETS = {"BREVO_API_KEY","CF_EMAIL","CF_GLOBAL_API_KEY","DATAFORSEO_API_LOGIN",
"DATAFORSEO_API_PASSWORD","GOOGLE_ADS_CLIENT_ID","GOOGLE_ADS_CLIENT_SECRET",
"GOOGLE_ADS_DEVELOPER_TOKEN","GOOGLE_ADS_REFRESH_TOKEN","GROQ_API_KEY",
"GSC_OAUTH_CLIENT_ID","GSC_OAUTH_CLIENT_SECRET","GSC_OAUTH_REFRESH_TOKEN","NTFY_TOPIC"}

# where the command (as opposed to env setup) begins
PROG = re.compile(r"(?:^|(?<=\s))(python3|/usr/bin/python3|node|cd\s|\./|/usr/local/bin/|/home/|/opt/)")
SCHED = re.compile(r"^(?:@\w+|(?:\S+\s+){5})")
ASSIGN = re.compile(r"""\b([A-Z][A-Z0-9_]{2,})=('[^']*'|"[^"]*"|[^\s;]+)""")
EXPORT_NTFY = re.compile(r"""export\s+NTFY_TOPIC=('[^']*'|"[^"]*"|[^\s;]+)""")

def sha(v): return hashlib.sha256(v.encode()).hexdigest()[:6]

def load(path):
    d = {}
    if not os.path.exists(path): return d
    for line in open(path):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line: continue
        k, _, v = line.partition("=")
        d[k.strip()] = v.strip().strip("'\"")
    return d

rkr = load(RKR)
cron = subprocess.run(["crontab","-l"],capture_output=True,text=True).stdout.splitlines()

# ---- pass 1: discover the distinct literal values we must relocate -------------
groq_blog = None
ntfy_vals = {}
for line in cron:
    s = line.strip()
    if not s or s.startswith("#"): continue
    m = SCHED.match(s)
    if not m: continue
    cmd = s[m.end():]
    for var, raw in ASSIGN.findall(cmd):
        val = raw.strip("'\"")
        if val.startswith("$") or var not in SECRETS: continue
        if var == "GROQ_API_KEY":
            if groq_blog and groq_blog != val: sys.exit("FATAL: >1 distinct inline GROQ_API_KEY")
            groq_blog = val
        elif var == "NTFY_TOPIC":
            ntfy_vals[val] = ntfy_vals.get(val, 0) + 1

# name the two ntfy topics: most-used = REPORTS, other = ALERTS
ordered = sorted(ntfy_vals.items(), key=lambda kv: -kv[1])
if len(ordered) > 2: sys.exit(f"FATAL: {len(ordered)} distinct NTFY topics, expected 2")
NTFY_NAME = {ordered[0][0]: "NTFY_TOPIC_REPORTS"}
if len(ordered) == 2: NTFY_NAME[ordered[1][0]] = "NTFY_TOPIC_ALERTS"

# ---- pass 2: rewrite ----------------------------------------------------------
changes = []   # (lineno, old, new, tail, vars_moved)
newcron = list(cron)

for i, line in enumerate(cron):
    s = line.rstrip()
    st = s.strip()
    if not st or st.startswith("#"): continue
    m = SCHED.match(st)
    if not m: continue
    sched, cmd = st[:m.end()], st[m.end():]
    if not any(v in cmd for v in SECRETS): continue

    pm = PROG.search(cmd)
    if not pm:
        sys.exit(f"FATAL line {i+1}: cannot locate program start")
    prefix, tail = cmd[:pm.start()], cmd[pm.start():]

    # any secret literal must live in the prefix, never in the program part
    for var, raw in ASSIGN.findall(tail):
        if var in SECRETS and not raw.strip("'\"").startswith("$"):
            sys.exit(f"FATAL line {i+1}: secret {var} inside program args")

    moved, need_blog, need_rkr_export = [], False, []
    newpre = prefix

    # (a) export NTFY_TOPIC=<literal>  ->  source file + indirect
    def ntfy_sub(mo):
        val = mo.group(1).strip("'\"")
        if val.startswith("$"): return mo.group(0)
        moved.append("NTFY_TOPIC")
        return f'. {NTFY_ENV} && export NTFY_TOPIC="${NTFY_NAME[val]}"'
    newpre = EXPORT_NTFY.sub(ntfy_sub, newpre)

    # (b) strip remaining inline literal assignments
    def strip_assign(mo):
        var, raw = mo.group(1), mo.group(2)
        val = raw.strip("'\"")
        if var not in SECRETS or val.startswith("$"): return mo.group(0)
        moved.append(var)
        if var == "GROQ_API_KEY":
            nonlocal_flag[0] = True
        else:
            if rkr.get(var) != val:
                sys.exit(f"FATAL line {i+1}: {var} not in {RKR} with identical value")
            nonlocal_flag[1].append(var)
        return ""
    nonlocal_flag = [False, []]
    newpre = ASSIGN.sub(strip_assign, newpre)
    need_blog, need_rkr_export = nonlocal_flag[0], nonlocal_flag[1]

    if not moved: continue

    newpre = newpre.rstrip()
    # preserve the connector that joined prefix to program
    if newpre.endswith("&&"):   conn, newpre = "&&", newpre[:-2].rstrip()
    elif newpre.endswith(";"):  conn, newpre = ";",  newpre[:-1].rstrip()
    else:                        conn = None

    adds = []
    if need_rkr_export:
        adds.append(f". {RKR} 2>/dev/null && export " + " ".join(dict.fromkeys(need_rkr_export)))
    if need_blog:
        adds.append(f"set -a && . {BLOG_ENV} && set +a")

    if adds:
        joined = " && ".join(adds)
        newpre = f"{newpre} {conn} {joined} && " if newpre else f"{joined} && "
    else:
        newpre = f"{newpre} {conn} " if newpre and conn else (newpre + " " if newpre else "")

    newpre = re.sub(r"\s{2,}", " ", newpre).lstrip()
    newcmd = newpre + tail
    newline = sched + newcmd
    if newline != s:
        changes.append((i+1, s, newline, tail, sorted(set(moved))))
        newcron[i] = newline

# ---- report (masked) ----------------------------------------------------------
def mask(t):
    return ASSIGN.sub(lambda mo: f"{mo.group(1)}=«{sha(mo.group(2).strip(chr(39)+chr(34)))}»"
                      if mo.group(1) in SECRETS and not mo.group(2).startswith("$") else mo.group(0), t)

print(f"blog GROQ key: sha {sha(groq_blog)}  (rkr-secrets.env has sha {sha(rkr.get('GROQ_API_KEY',''))} — kept separate)")
for val, n in ordered:
    print(f"ntfy {NTFY_NAME[val]}: sha {sha(val)} ({n} lines)")
print(f"\nlines to change: {len(changes)}\n")
for ln, old, new, tail, moved in changes:
    print(f"--- line {ln}  [{', '.join(moved)}]")
    print(f"  OLD: {mask(old)}")
    print(f"  NEW: {mask(new)}")
    if not new.endswith(tail):
        sys.exit(f"FATAL line {ln}: program part not preserved")
print(f"\nprogram part byte-identical on all {len(changes)} lines: OK")

if "--apply" not in sys.argv:
    print("\nDRY RUN — nothing written. Re-run with --apply")
    sys.exit(0)

# ---- apply --------------------------------------------------------------------
ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
bak = f"/root/crontab.bak-secrets-{ts}"
open(bak,"w").write("\n".join(cron)+"\n")
os.chmod(bak, 0o600)

def write_env(path, kv):
    with open(path,"w") as f:
        f.write(f"# created {ts} by migrate_cron_secrets.py — moved out of root crontab\n")
        for k,v in kv.items(): f.write(f"{k}={v}\n")
    os.chmod(path, 0o600)

write_env(BLOG_ENV, {"GROQ_API_KEY": groq_blog})
write_env(NTFY_ENV, {NTFY_NAME[v]: v for v,_ in ordered})

open(f"/root/crontab.new-{ts}","w").write("\n".join(newcron)+"\n")
subprocess.run(["crontab", f"/root/crontab.new-{ts}"], check=True)
print(f"\nAPPLIED. backup {bak}")
print(f"created {BLOG_ENV} (0600), {NTFY_ENV} (0600)")
