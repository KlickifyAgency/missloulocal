#!/usr/bin/env python3
"""For every changed cron line: eval the OLD env prefix and the NEW env prefix in sh,
then assert the child process would receive byte-identical values."""
import re, subprocess, sys, hashlib, glob, os

SECRETS = {"BREVO_API_KEY","CF_EMAIL","CF_GLOBAL_API_KEY","DATAFORSEO_API_LOGIN",
"DATAFORSEO_API_PASSWORD","GOOGLE_ADS_CLIENT_ID","GOOGLE_ADS_CLIENT_SECRET",
"GOOGLE_ADS_DEVELOPER_TOKEN","GOOGLE_ADS_REFRESH_TOKEN","GROQ_API_KEY",
"GSC_OAUTH_CLIENT_ID","GSC_OAUTH_CLIENT_SECRET","GSC_OAUTH_REFRESH_TOKEN","NTFY_TOPIC"}
PROG = re.compile(r"(?:^|(?<=\s))(python3|/usr/bin/python3|node|cd\s|\./|/usr/local/bin/|/home/|/opt/)")
SCHED = re.compile(r"^(?:@\w+|(?:\S+\s+){5})")

bak = sorted(glob.glob("/root/crontab.bak-secrets-*"))[-1]
old = open(bak).read().splitlines()
new = subprocess.run(["crontab","-l"],capture_output=True,text=True).stdout.splitlines()
if len(old) != len(new): sys.exit(f"FATAL: line count {len(old)} -> {len(new)}")

def split(line):
    st = line.strip()
    m = SCHED.match(st)
    if not m: return None
    cmd = st[m.end():]
    pm = PROG.search(cmd)
    if not pm: return None
    return cmd[:pm.start()], cmd[pm.start():]

def env_of(prefix):
    r = subprocess.run(["sh","-c", prefix + " env"], capture_output=True, text=True)
    if r.returncode != 0:
        return None, r.stderr.strip()[:200]
    out = {}
    for l in r.stdout.splitlines():
        k,_,v = l.partition("=")
        if k in SECRETS: out[k] = v
    return out, None

def sha(v): return hashlib.sha256(v.encode()).hexdigest()[:8]

checked = ok = 0
problems = []
for i,(o,n) in enumerate(zip(old,new), 1):
    if o == n: continue
    checked += 1
    so, sn = split(o), split(n)
    if not so or not sn:
        problems.append(f"line {i}: cannot split"); continue
    if so[1] != sn[1]:
        problems.append(f"line {i}: PROGRAM CHANGED"); continue
    eo, erro = env_of(so[0])
    en, errn = env_of(sn[0])
    if eo is None: problems.append(f"line {i}: OLD prefix failed: {erro}"); continue
    if en is None: problems.append(f"line {i}: NEW prefix failed: {errn}"); continue
    missing = {k: sha(v) for k,v in eo.items() if en.get(k) != v}
    extra   = {k for k in en if k not in eo}
    if missing:
        problems.append(f"line {i}: MISMATCH {list(missing)}")
    elif extra:
        problems.append(f"line {i}: NEW exports extra secrets {sorted(extra)}")
    else:
        ok += 1
        print(f"line {i:>4}: OK  vars={sorted(eo)}  " + " ".join(f"{k}:{sha(v)}" for k,v in sorted(eo.items())))

print(f"\nchanged lines: {checked}   identical env delivered: {ok}   problems: {len(problems)}")
for p in problems: print("  !! " + p)
sys.exit(1 if problems else 0)
