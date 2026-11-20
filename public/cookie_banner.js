/* legal-kit cookie banner (rule #35). Drop-in, no deps:
 *   <script src="/cookie_banner.js" defer></script>  — place BEFORE the GA4/GTM snippet is NOT required:
 * it uses Google Consent Mode v2 updates, so analytics_storage follows the visitor's choice.
 * Honors Global Privacy Control (navigator.globalPrivacyControl) as a decline, per CCPA.
 * Choice saved in localStorage 'lk_consent' = 'granted' | 'denied'. Re-open: any element with [data-cookie-settings].
 */
(function () {
  var KEY = 'lk_consent';
  function gtagSafe() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }
  function apply(v) {
    gtagSafe('consent', 'update', { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v });
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} apply(v); }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  if (navigator.globalPrivacyControl) { save('denied'); return; }
  var saved = read();
  if (saved) { apply(saved); return; }

  function show() {
    if (document.getElementById('lk-cookie')) return;
    var b = document.createElement('div');
    b.id = 'lk-cookie';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie notice');
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + var(--lk-bottom, 0px));z-index:99999;max-width:640px;margin:0 auto;' +
      'background:#111;color:#f5f5f5;padding:14px 16px;border-radius:10px;font:14px/1.45 system-ui,sans-serif;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.35);display:flex;flex-wrap:wrap;gap:10px;align-items:center';
    b.innerHTML = '<span style="flex:1 1 260px">We use cookies for site analytics. See our ' +
      '<a href="/cookies/" style="color:#7dd3fc">Cookie Policy</a>.</span>' +
      '<button type="button" data-v="denied" style="padding:8px 14px;border-radius:8px;border:1px solid #666;background:transparent;color:#f5f5f5;cursor:pointer">Decline</button>' +
      '<button type="button" data-v="granted" style="padding:8px 14px;border-radius:8px;border:0;background:#0ea5e9;color:#fff;font-weight:700;cursor:pointer">Accept</button>';
    b.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute('data-v');
      if (v) { save(v); b.remove(); }
    });
    document.body.appendChild(b);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cookie-settings]')) { e.preventDefault(); show(); }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
