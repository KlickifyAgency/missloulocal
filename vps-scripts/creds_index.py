#!/usr/bin/env python3
"""
SessionStart hook: print an INDEX of the credentials available in ~/.claude_env.sh.

Prints variable NAMES ONLY, grouped by service. Values are never read into the
transcript -- an index gives the agent everything it needs to know a credential
exists and what it is called, with none of the exposure of printing secrets into
every session of every project.

Exists because the agent repeatedly claimed it had no Cloudflare / GSC credentials
when they had been in ~/.claude_env.sh the whole time. The file was never the
problem; discovery was.
"""
import json
import os
import re
import sys

ENV_FILE = os.path.expanduser("~/.claude_env.sh")

# (label, prefixes) -- first match wins, so order matters
GROUPS = [
    ("Cloudflare",   ("CF_",)),
    ("Search Cons.", ("GSC_", "BING_WMT")),
    ("Google Ads",   ("GOOGLE_ADS_", "GADS_")),
    ("GA4/GTM",      ("GA4_",)),
    ("Google otros", ("GOOGLE_",)),
    ("LLM",          ("GROQ_", "GEMINI_", "CEREBRAS_", "ANTHROPIC_")),
    ("Email",        ("RESEND_", "BREVO_", "PROTON_")),
    ("Telefonia",    ("TELNYX_", "TEXML_")),
    ("SEO/datos",    ("DATAFORSEO_", "HUNTER_", "UPTIMEROBOT_", "POSTHOG_")),
    ("Dominios",     ("NAMECHEAP_", "GODADDY_")),
    ("Deploy",       ("VERCEL_", "GITHUB_")),
    ("VPS",          ("VPS_",)),
    ("Pagos",        ("STRIPE_",)),
    ("WordPress",    ("LET_WP_",)),
    ("Turnstile",    ("TURNSTILE_",)),
    ("Alertas",      ("NTFY_",)),
]

VAR = re.compile(r"^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)=")


SERIES = re.compile(r"^(?:P\d+|BATCH\d+|\d+)$")


def collapse(names):
    """Fold numbered series like CF_ZONE_P01..P10 into CF_ZONE_P*(10).

    Only collapses when every member ends in an enumerable suffix -- a name the
    agent can reconstruct. Anything else stays spelled out: an index that hides
    the exact variable name is worse than no index.
    """
    stems = {}
    for n in names:
        stem = n.rsplit("_", 1)[0] if "_" in n else n
        stems.setdefault(stem, []).append(n)
    out = []
    for stem, members in stems.items():
        suffixes = [m.rsplit("_", 1)[1] for m in members if "_" in m]
        if len(members) >= 4 and len(suffixes) == len(members) and all(SERIES.match(s) for s in suffixes):
            out.append(f"{stem}_*({len(members)})")
        else:
            out.extend(sorted(members))
    return sorted(out)


def main():
    if not os.path.exists(ENV_FILE):
        sys.exit(0)  # nothing to advertise; stay silent

    names = []
    with open(ENV_FILE, errors="ignore") as fh:
        for line in fh:
            m = VAR.match(line)
            if m:
                names.append(m.group(1))
    names = sorted(set(names))
    if not names:
        sys.exit(0)

    buckets, seen = {}, set()
    for label, prefixes in GROUPS:
        hit = [n for n in names if n.startswith(prefixes) and n not in seen]
        if hit:
            buckets[label] = hit
            seen.update(hit)
    rest = [n for n in names if n not in seen]
    if rest:
        buckets["Otros"] = rest

    lines = [
        f"CREDENCIALES DISPONIBLES — {len(names)} vars en ~/.claude_env.sh (0600). "
        "Nombres, NO valores.",
    ]
    width = max(len(k) for k in buckets)
    for label, members in buckets.items():
        lines.append(f"  {label.ljust(width)}  {' '.join(collapse(members))}")
    lines += [
        "",
        "Uso: `source ~/.claude_env.sh` y usar $VAR. Para ver que existe sin exponerlo:",
        "  grep -oE '^[A-Z_]+=' ~/.claude_env.sh | grep -i <servicio>",
        "REGLA: nunca decir 'no tengo credenciales para X' sin haber mirado este indice.",
        "NUNCA imprimir un valor de credencial en el chat, un log, un commit o un crontab.",
    ]

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": "\n".join(lines),
        }
    }))


if __name__ == "__main__":
    main()
