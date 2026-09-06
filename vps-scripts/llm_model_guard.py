#!/usr/bin/env python3
"""
LLM model guard — single source of truth for which model every cron should use.

Why this exists
---------------
Groq decommissioned llama-3.3-70b-versatile on 2026-08-16. Rank & Rent was fixed
the same day; nobody swept the rest of the fleet. MissLouLocal's weekly article
cron, VacaySmith's blog, b2l's blog and vacay_goldmine kept calling the dead model
and died silently every week for three weeks. Nobody noticed until George looked
at a website and saw stale content.

Hardcoded model ids are the bug. This script removes them:

  1. Resolves the best CURRENTLY-AVAILABLE model per role from the provider's live
     /models endpoint, using a ranked candidate list. Writes the answer to
     RESOLVED_PATH, which every cron reads instead of hardcoding a model id.
  2. Scans the fleet for scripts that STILL hardcode a model id and checks each
     one against the live list, so a pin we missed gets reported instead of
     failing silently on its next scheduled run.
  3. Emails on any problem, and on any resolution change.

Runs daily, so a decommission surfaces within 24h instead of on publish day.
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

CONFIG_PATH = "/etc/llm_models.json"
RESOLVED_PATH = "/etc/llm_models.resolved.json"
RESEND_KEY = "<REDACTED_RESEND_KEY>"
ALERT_TO = "support@klickifyagency.com"

# Files that are allowed to still contain a literal model id, and the roles they
# should be judged against. Anything else matching MODEL_PIN_RE in SCAN_DIRS is
# reported as an unmanaged pin.
SCAN_DIRS = ["/usr/local/bin", "/home/missloulocal-crons", "/opt/rkr/scripts", "/opt/rkr-nexus/nexus"]
MODEL_PIN_RE = re.compile(
    r"""["'](?P<model>(?:llama-[\d.]+[\w-]*|openai/gpt-oss-[\w-]+|meta-llama/[\w.-]+|"""
    r"""groq/[\w.-]+|qwen/[\w.-]+|gemini-[\w.-]+|claude-[\w.-]+))["']"""
)


def log(msg):
    print("[%s] %s" % (datetime.now(timezone.utc).isoformat(timespec="seconds"), msg), flush=True)


def read_json(path, default=None):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return default


def env_value(path, key):
    """Pull a key out of a shell-style env file without sourcing it."""
    try:
        with open(path) as f:
            for line in f:
                line = line.strip().lstrip("export ").strip()
                if line.startswith(key + "="):
                    return line.split("=", 1)[1].strip().strip("'\"")
    except Exception:
        pass
    return None


# Groq and Resend sit behind a WAF that 403s the default "Python-urllib/3.x"
# User-Agent. Every outbound request here must send a real one.
UA = "klickify-llm-guard/1.0"


def http_json(url, headers, timeout=30):
    headers = dict(headers, **{"User-Agent": UA})
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def live_groq_models(api_key):
    data = http_json("https://api.groq.com/openai/v1/models", {"Authorization": "Bearer " + api_key})
    return sorted(m["id"] for m in data.get("data", []))


def send_email(subject, body_html):
    # Testing this script must never reach George's inbox. Set GUARD_NO_EMAIL=1 for
    # any simulation or dry run -- on 2026-09-06 a self-check test fired a real
    # "SCANNER BROKEN" alert at him for a fault that did not exist.
    if os.environ.get("GUARD_NO_EMAIL"):
        log("EMAIL SUPPRESSED (GUARD_NO_EMAIL=1): %s" % subject)
        return "suppressed"
    payload = json.dumps({
        "from": "LLM Model Guard <noreply@klickifyagency.com>",
        "to": ALERT_TO,
        "subject": subject,
        "html": body_html,
    }).encode()
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={"Authorization": "Bearer " + RESEND_KEY, "Content-Type": "application/json",
                 "User-Agent": UA},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return "HTTP %s" % e.code
    except Exception as e:
        return "error: %s" % e


def provider_of(model):
    """Which provider a literal model id belongs to.

    Only Groq is verifiable on this box. Anthropic was dropped 2026-09-06 (we pay
    for Claude Pro, not API credit) and there is no Gemini key, so pins for those
    are reported as unverified rather than guessed at.
    """
    if model.startswith("claude-"):
        return "anthropic"
    if model.startswith("gemini-"):
        return "google"
    return "groq"


def scan_hardcoded_pins():
    """Find literal model ids still embedded in live (non-backup) scripts.

    Done in pure Python on purpose: an earlier version shelled out to `grep -E`,
    which cannot parse the "(?:" non-capturing group in MODEL_PIN_RE. grep errored,
    returned zero hits, and the guard cheerfully reported "no dead pins" while four
    crons were pinned to a decommissioned model. A guard that can fail silently is
    worse than no guard.
    """
    found = {}
    skip_ext = (".log", ".md", ".json", ".png", ".jpg", ".lock")
    for d in SCAN_DIRS:
        for root, dirs, files in os.walk(d):
            dirs[:] = [x for x in dirs if x not in ("node_modules", ".git", "__pycache__")]
            for name in files:
                if ".bak" in name or name.endswith(skip_ext):
                    continue
                path = os.path.join(root, name)
                try:
                    if os.path.getsize(path) > 2_000_000:
                        continue
                    with open(path, "r", errors="ignore") as f:
                        for i, line in enumerate(f, 1):
                            m = MODEL_PIN_RE.search(line)
                            if m:
                                found.setdefault(m.group("model"), []).append("%s:%d" % (path, i))
                except (OSError, UnicodeDecodeError):
                    continue
    return found


def main():
    cfg = read_json(CONFIG_PATH)
    if not cfg:
        log("FATAL: no config at %s" % CONFIG_PATH)
        return 1

    groq_key = os.environ.get("GROQ_API_KEY") or env_value("/home/missloulocal-crons/.env", "GROQ_API_KEY")

    available = {}
    problems = []

    if groq_key:
        try:
            available["groq"] = live_groq_models(groq_key)
            log("groq: %d models live" % len(available["groq"]))
        except Exception as e:
            problems.append("Could not list Groq models: %s" % e)
    else:
        problems.append("No GROQ_API_KEY found — cannot verify Groq models.")

    # ---- resolve each role to the best currently-available candidate ----
    previous = read_json(RESOLVED_PATH, {}) or {}
    resolved = {}
    changes = []

    for role, spec in cfg.get("roles", {}).items():
        provider = spec["provider"]
        candidates = spec["candidates"]
        pool = available.get(provider)
        if pool is None:
            # Provider unreachable — keep whatever we resolved last time rather
            # than downgrading a working cron on a transient network blip.
            if role in previous:
                resolved[role] = previous[role]
                log("%s: provider %s unreachable, keeping %s" % (role, provider, previous[role]))
            continue
        pick = next((c for c in candidates if c in pool), None)
        if pick is None:
            problems.append(
                "Role '%s': NONE of its candidates exist on %s any more (%s). Live list: %s"
                % (role, provider, ", ".join(candidates), ", ".join(pool))
            )
            if role in previous:
                resolved[role] = previous[role]
            continue
        resolved[role] = pick
        if previous.get(role) and previous[role] != pick:
            changes.append("%s: %s -> %s" % (role, previous[role], pick))
        elif not previous.get(role):
            changes.append("%s: (new) -> %s" % (role, pick))
        if pick != candidates[0]:
            problems.append(
                "Role '%s' fell back to '%s' — preferred '%s' is gone from %s."
                % (role, pick, candidates[0], provider)
            )

    resolved["_updated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    tmp = RESOLVED_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(resolved, f, indent=2, sort_keys=True)
    os.replace(tmp, RESOLVED_PATH)
    os.chmod(RESOLVED_PATH, 0o644)
    log("resolved: %s" % json.dumps({k: v for k, v in resolved.items() if not k.startswith("_")}))

    # ---- report any script still carrying a hardcoded pin that is now dead ----
    pins = scan_hardcoded_pins()

    # Self-check. Every managed script keeps its previous model id as the fallback
    # argument to _resolved_model(), so a healthy scan ALWAYS finds several literals.
    # Zero hits means the scanner broke, not that the fleet is clean -- which is
    # exactly how the grep -E version reported "OK - no dead pins" while four crons
    # were down. Refuse to report success we cannot back up.
    if not pins:
        problems.append(
            "SCANNER BROKEN: found 0 model literals across %s. A healthy scan always "
            "finds the fallback ids. Treat this as a failed check, not a clean bill "
            "of health." % ", ".join(SCAN_DIRS)
        )

    unverified = set()
    for model, locations in pins.items():
        provider = provider_of(model)
        pool = available.get(provider)
        if pool is None:
            # No usable key for that provider — say so once, do not cry wolf per pin.
            unverified.add(provider)
            continue
        if model not in pool:
            problems.append(
                "DEAD hardcoded model '%s' still referenced in: %s" % (model, ", ".join(locations))
            )
    for provider in sorted(unverified):
        log("note: pins for provider '%s' could not be verified (no working API key)" % provider)

    if problems:
        html = (
            "<h2>LLM model guard found %d problem(s)</h2><ul>" % len(problems)
            + "".join("<li>%s</li>" % p.replace("<", "&lt;") for p in problems)
            + "</ul><p>Resolved roles now in <code>%s</code>:</p><pre>%s</pre>"
            % (RESOLVED_PATH, json.dumps(resolved, indent=2))
        )
        code = send_email("LLM model guard: %d problem(s) detected" % len(problems), html)
        log("PROBLEMS (%d), alert email status %s" % (len(problems), code))
        for p in problems:
            log("  - %s" % p)
        return 1

    if changes:
        html = ("<h2>LLM model resolution changed</h2><ul>"
                + "".join("<li>%s</li>" % c for c in changes)
                + "</ul><p>No action needed — crons pick this up automatically.</p>")
        code = send_email("LLM model guard: resolution changed", html)
        log("changes: %s (email %s)" % ("; ".join(changes), code))

    log("OK — all roles resolve, no dead pins (%d literals scanned)" % sum(len(v) for v in pins.values()))
    return 0


if __name__ == "__main__":
    sys.exit(main())
