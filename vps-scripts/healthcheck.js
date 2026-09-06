const https = require("https");
const fs = require("fs");

const URL = "https://www.missloulocal.com/api/healthcheck";
const STATE_FILE = "/home/missloulocal-crons/.healthcheck_state.json";
const RESEND_KEY = "<REDACTED_RESEND_KEY>";
const TO = "support@klickifyagency.com";

// Tuning — see SESSION_DIARY 2026-09-06. Every historical alert was a
// client-side 10s timeout that self-resolved on the next 5-min run, never a
// real outage. Endpoint answers in 0.4s when the VPS is not cron-saturated.
const REQ_TIMEOUT_MS = 25000;   // was 10000
const ATTEMPTS = 3;             // retries inside a single cron run
const RETRY_DELAY_MS = 5000;
const FAILS_BEFORE_ALERT = 2;   // 2 consecutive runs = ~10 min really down
const ALERT_COOLDOWN_MS = 60 * 60 * 1000;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function check() {
  return new Promise(resolve => {
    const req = https.get(URL, { timeout: REQ_TIMEOUT_MS }, res => {
      let d = "";
      res.on("data", c => (d += c));
      res.on("end", () => {
        let data;
        try { data = JSON.parse(d); } catch { data = null; }
        resolve({
          ok: res.statusCode === 200 && (!data || data.ok !== false),
          status: res.statusCode,
          data,
          body: d.slice(0, 500),
        });
      });
    });
    req.on("error", e => resolve({ ok: false, status: 0, error: "Connection failed: " + e.message }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 0, error: "Timeout after " + REQ_TIMEOUT_MS + "ms" }); });
  });
}

async function checkWithRetries() {
  let last;
  for (let i = 1; i <= ATTEMPTS; i++) {
    last = await check();
    last.attempt = i;
    if (last.ok) return last;
    if (i < ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }
  return last;
}

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); }
  catch { return { consecutiveFails: 0, lastAlertAt: 0, alerting: false }; }
}
function saveState(s) {
  try { fs.writeFileSync(STATE_FILE, JSON.stringify(s)); } catch (e) { console.log("state write failed:", e.message); }
}

function sendEmail(subject, html) {
  return new Promise(resolve => {
    const payload = JSON.stringify({
      from: "MissLouLocal VPS Monitor <noreply@klickifyagency.com>",
      to: TO, subject, html,
    });
    const req = https.request({
      hostname: "api.resend.com", path: "/emails", method: "POST",
      timeout: 15000,
      headers: { Authorization: "Bearer " + RESEND_KEY, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
    }, res => { res.on("data", () => {}); res.on("end", () => resolve(res.statusCode)); });
    req.on("error", e => resolve("error: " + e.message));
    req.on("timeout", () => { req.destroy(); resolve("timeout"); });
    req.write(payload); req.end();
  });
}

function describe(r) {
  if (r.data) {
    const failed = (r.data.checks || []).filter(c => !c.ok);
    if (failed.length) return "Failed checks: " + JSON.stringify(failed);
    return "HTTP " + r.status + " — body: " + r.body;
  }
  return (r.error || "HTTP " + r.status) + (r.body ? " — body: " + r.body : "");
}

async function main() {
  const now = new Date().toISOString();
  const state = loadState();
  const r = await checkWithRetries();

  if (r.ok) {
    if (state.alerting) {
      await sendEmail(
        "✅ VPS Monitor: MissLouLocal RECOVERED - " + now,
        "<h2>Recovered at " + now + "</h2><p>Healthcheck is green again after " + state.consecutiveFails + " consecutive failed run(s).</p>"
      );
      console.log("[" + now + "] ✅ RECOVERED (was alerting)");
    } else {
      console.log("[" + now + "] ✅ All systems OK" + (r.attempt > 1 ? " (recovered on attempt " + r.attempt + ")" : ""));
    }
    saveState({ consecutiveFails: 0, lastAlertAt: 0, alerting: false });
    return;
  }

  state.consecutiveFails = (state.consecutiveFails || 0) + 1;
  const details = describe(r);
  console.log("[" + now + "] ❌ FAIL " + state.consecutiveFails + "/" + FAILS_BEFORE_ALERT + " (" + ATTEMPTS + " attempts): " + details);

  const dueForAlert =
    state.consecutiveFails >= FAILS_BEFORE_ALERT &&
    Date.now() - (state.lastAlertAt || 0) >= ALERT_COOLDOWN_MS;

  if (dueForAlert) {
    const code = await sendEmail(
      "🚨 VPS Monitor: MissLouLocal issue detected - " + now,
      "<h2>Issue detected at " + now + "</h2>" +
        "<p><strong>" + state.consecutiveFails + "</strong> consecutive failed runs, " + ATTEMPTS + " attempts each, " + (REQ_TIMEOUT_MS / 1000) + "s timeout.</p>" +
        "<pre>" + details.replace(/</g, "&lt;") + "</pre>"
    );
    state.lastAlertAt = Date.now();
    state.alerting = true;
    console.log("[" + now + "] 📧 alert sent (resend status " + code + ")");
  }
  saveState(state);
}

main().catch(e => console.error("[" + new Date().toISOString() + "] monitor crashed:", e));
