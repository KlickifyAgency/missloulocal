#!/usr/bin/env python3
"""World/group-readable files containing a HIGH-sensitivity secret (real access grants only)."""
import os

SRC = ["/etc/rkr-secrets.env","/etc/vs-secrets.env","/etc/blog-secrets.env",
       "/etc/ntfy-topics.env","/home/missloulocal-crons/.env"]
HIGH = ("SECRET","TOKEN","PASSWORD","_KEY","SERVICE_ROLE","NTFY_TOPIC")
LOW  = ("CLIENT_ID","ACCOUNT_SID","API_LOGIN","PAGE_ID","ACCOUNT_ID","QUOTA_PROJECT","URL","EMAIL","PUBLIC")

vals = {}
for p in SRC:
    if not os.path.exists(p): continue
    for line in open(p, errors="ignore"):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line: continue
        k, _, v = line.partition("=")
        k, v = k.strip(), v.strip().strip("'\"")
        if len(v) >= 16 and any(h in k for h in HIGH) and not any(l in k for l in LOW):
            vals[v] = k

print(f"tracking {len(vals)} high-sensitivity values: {sorted(set(vals.values()))}\n")
ROOTS = ["/etc","/home","/opt","/usr/local/bin","/var/www","/root"]
SKIP = ("/opt/trulyfreeqr",)
hits = []
for root in ROOTS:
    for dirpath, dirnames, filenames in os.walk(root, topdown=True):
        if dirpath.startswith(SKIP):
            dirnames[:] = []; continue
        dirnames[:] = [d for d in dirnames if d not in (".git","node_modules","__pycache__",".next","venv",".venv",".cache")]
        for fn in filenames:
            fp = os.path.join(dirpath, fn)
            try:
                st = os.lstat(fp)
                if os.path.islink(fp) or not os.path.isfile(fp) or st.st_size > 8_000_000: continue
                if not (st.st_mode & 0o044): continue
                data = open(fp,"rb").read().decode("utf-8","ignore")
            except Exception:
                continue
            found = {vals[v] for v in vals if v in data}
            if found: hits.append((fp, oct(st.st_mode)[-3:], st.st_uid, sorted(found)))

print(f"group/other-readable files exposing a high-sensitivity secret: {len(hits)}\n")
import pwd
for fp, mode, uid, found in sorted(hits):
    try: owner = pwd.getpwuid(uid).pw_name
    except KeyError: owner = str(uid)
    print(f"  {mode} {owner:<10} {fp}")
    print(f"       -> {', '.join(found)}")
