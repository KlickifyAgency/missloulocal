#!/usr/bin/env python3
"""Audit inline env-var assignments in root's crontab. Prints REDACTED report only."""
import re, subprocess, os, hashlib

ENV_FILES = ["/etc/rkr-secrets.env", "/etc/vs-secrets.env", "/home/missloulocal-crons/.env"]

def load_env(path):
    out = {}
    if not os.path.exists(path):
        return out
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            if line.startswith("export "):
                line = line[7:]
            k, _, v = line.partition("=")
            out[k.strip()] = v.strip().strip("'\"")
    return out

envs = {p: load_env(p) for p in ENV_FILES}

def red(v):
    if len(v) <= 8:
        return f"<len{len(v)}>"
    return f"{v[:4]}…{v[-4:]} (len {len(v)}, sha {hashlib.sha256(v.encode()).hexdigest()[:8]})"

cron = subprocess.run(["crontab", "-l"], capture_output=True, text=True).stdout.splitlines()
# assignment appearing in the COMMAND part (after 5 schedule fields or @reboot)
ASSIGN = re.compile(r"""(?:^|\s)([A-Z][A-Z0-9_]{2,})=('[^']*'|"[^"]*"|[^\s]+)""")
SCHED = re.compile(r"^(?:@\w+|(?:\S+\s+){5})")

found = {}
for i, line in enumerate(cron, 1):
    s = line.strip()
    if not s or s.startswith("#"):
        continue
    m = SCHED.match(s)
    if not m:
        continue  # global env assignment at top of crontab, handled separately
    cmd = s[m.end():]
    for var, raw in ASSIGN.findall(cmd):
        val = raw.strip("'\"")
        if var in ("PATH", "SHELL", "MAILTO", "LANG", "LC_ALL", "HOME"):
            continue
        # skip $(...) / $VAR references — not literals
        if val.startswith("$"):
            continue
        found.setdefault(var, []).append((i, val))

print(f"crontab lines: {len(cron)}\n")
print("=== INLINE LITERAL ASSIGNMENTS IN CRON COMMANDS ===")
for var in sorted(found):
    occs = found[var]
    print(f"\n{var}  ({len(occs)} occurrence(s))")
    for ln, val in occs:
        print(f"   line {ln}: {red(val)}")
    for p, e in envs.items():
        if var in e:
            same = "SAME VALUE" if any(e[var] == v for _, v in occs) else "*** DIFFERENT VALUE ***"
            print(f"   already in {p}: {same}")

print("\n=== VARS DEFINED IN ENV FILES (names only) ===")
for p, e in envs.items():
    print(f"{p} ({oct(os.stat(p).st_mode)[-3:] if os.path.exists(p) else 'missing'}): {', '.join(sorted(e))}")
