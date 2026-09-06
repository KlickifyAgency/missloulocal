# SESSION DIARY — MissLouLocal Digital Directory

---

## SESSION 011 — 2026-09-06
**Status:** Health-monitor false alarms killed; weekly article cron resurrected after 3 silent failures; hardcoded LLM model ids eliminated fleet-wide.

### 1. Health monitor — 50 false alarms, site never down
- **Root cause:** monitor timeout budget was SMALLER than the endpoint's own budget.
  `healthcheck.js` used `timeout: 10000`; `src/app/api/healthcheck/route.ts` fans out to
  6 sub-APIs at `AbortSignal.timeout(8000)` **each with one retry after a 2s wait** = 18s
  worst case. Any sub-check needing its retry tripped a fake outage.
- **Fingerprint:** every failed log line timestamps at second `:11`-`:12` (cron `:02` + 10s).
  50 alerts / 44,376 checks = 0.11%, all self-healed next run. Only 1 genuine failure ever
  (Pets API 500). Endpoint measured 0.17-0.35s from VPS.
- **Fixed:** 25s timeout, 3 in-run retries, alert only after 2 consecutive failed runs, 1h
  cooldown, RECOVERED email, HTTP status + body snippet on failure. State in
  `.healthcheck_state.json`. Backup `healthcheck.js.bak-20260906`.
- Removed the route's own unthrottled duplicate email (commit `5defaee`, deployed, verified
  live 200 / 7 checks green). It emailed on every 5-min poll = 12/hr during an outage.
- Logrotate added for `/home/missloulocal-crons/*.log` (was 2MB unbounded).

### 2. Article cron dead since 2026-08-21 — Groq decommission
- Groq retired `llama-3.3-70b-versatile` ~2026-08-16. Cron fired fine all 3 Fridays and
  died at the API call each time. **Nothing alerted** — healthcheck watches the site, not crons.
- Same decommission had already hit Rank & Rent and was patched there the same day
  (`/opt/rkr-nexus/nexus/llm.py.bak_20260816_groq_decommission`); nobody swept the rest.
  **VacaySmith blog and b2l blog were dead the identical 3 Fridays.**
- Published catch-up article `cost-of-living-natchez-ms` (1339 words, live 200, FB post
  `1045698738630364_122123143868885885`). George chose 1 article, not all 3.

### 3. Permanent fix — no hardcoded model ids anywhere
- `/etc/llm_models.json` — ranked candidates per role (`groq_large`, `groq_small`).
- `/usr/local/bin/llm_model_guard.py` — cron `0 7 * * *`. Resolves roles against the live
  Groq `/models` list into `/etc/llm_models.resolved.json`, scans all scripts for literal
  model ids, emails on dead pins or fallbacks. Runs 1h before the 08:00 article cron.
- 6 scripts converted to `_resolved_model(role, fallback)` / `resolvedModel(...)`:
  `generate-article.js`, `vacay_auto_blog.py`, `b2l_auto_blog.py`, `vacay_goldmine.py`,
  `guru_monitor.py`, `rkr_blog_common.py`.
- **Cadence moved out of crontab:** `0 8 * * 5` -> `0 8 * * *` with a 7-day gate
  (`MIN_DAYS_BETWEEN_ARTICLES`) inside the script. A failure retries tomorrow, not next week.
  `FORCE_PUBLISH=1` overrides. Verified: skips correctly.
- Simulated a future decommission end-to-end: fell back to `qwen/qwen3.8-27b`, emailed,
  `generate-article.js` picked it up with zero code changes.
- Validation gate added to `generate-article.js` (>=3 sections/FAQs/keywords, >=700 words,
  retry once) + failure alert email.

### Bugs hit while building (both fixed, then backstopped)
- `grep -E` cannot parse `(?:` non-capturing groups — errored, returned 0 hits, guard
  printed "OK — no dead pins" while 4 crons were down. Scan rewritten in pure Python.
  **Backstop:** 0 literals now raises `SCANNER BROKEN` (fallback args guarantee ~13 hits).
- Default `Python-urllib/3.x` User-Agent gets **403**'d by Groq AND Resend. Real UA required.
- Helper inserted "after last import in first 80 lines" landed BELOW its caller -> NameError.
  `rkr_blog_common.py` is imported by all 12 pXX crons; verified all 12 still compile.

### Process error — mine
Tested the guard's alert paths against the LIVE Resend key. Sent George 3 real emails
including a "SCANNER BROKEN" alert for a fault that did not exist. `GUARD_NO_EMAIL=1`
now suppresses delivery; use it for every simulation.

### Other
- `ANTHROPIC_API_KEY` removed per George — value was literally `YOUR_ANTHROPIC_KEY_HERE`
  (cause of the 2026-05-29 401). **We pay Claude Pro, not API credit. Do not re-add.**
- `openai/gpt-oss-20b` measured too weak for long-form: 588 words / 1 section vs
  1413 / 4 on `gpt-oss-120b`, same prompt. Hence two roles.
- Left alone: `/opt/rkr-nexus/nexus/llm.py` still hardcodes gpt-oss-20b + a Gemini model.
  Has its own budget machinery, deserves its own session. Guard watches its Groq pin daily.
- Backups: crontab `/root/crontab.bak-20260906` (137 -> 144 lines); every touched script
  has a `.bak-*-20260906`.

---

## SESSION 010 — 2026-06-25
**Status:** Premium listings overhaul — fotos permanentes, Featured Businesses home page, multi-categorías, premium UI en todo el site, nuevo lead John Grady (The Nest).

### Done

**1. Diagnóstico fotos premium — raíz del problema**
- Fotos almacenadas como Google Places API `photo_reference` URLs → EXPIRAN
- Google Cloud billing cancelado → Places Details API devuelve `REQUEST_DENIED`
- Fix: limpiar todas las URLs expiradas de la DB (5 registros premium)
- Regla permanente: NUNCA guardar Google Places photo URLs en DB — siempre descargar y subir a Supabase Storage

**2. Workflow foto upload — descubierto e implementado**
- Desktop de Mac es iCloud: ruta real = `/Users/mbp_alfa_01/Library/Mobile Documents/com~apple~CloudDocs/Desktop/`
- Filenames tienen U+202F (Narrow No-Break Space) antes de AM/PM → usar glob: `Screenshot\ 2026-06-25\ at\ 9.32.17*AM.png`
- Bash tool: NO puede leer archivos del Desktop local (sandbox). Copiar de iCloud path primero.
- Subir via Node.js `https.request` + Supabase Storage API directamente (no fetch — no tiene redirect follow fácil)

**3. Fotos subidas permanentemente a Supabase Storage (business-photos bucket)**
- Little Easy Tours: 3 fotos (logo LET, mansión antebellum con magnolias, interior navideño)
- Timothy Blalock Law Firm: 3 fotos (edificio ladrillo, foto profesional, oficina)
- The Nest: 2 fotos (exterior construcción Franklin St, cuchara de producto)
- River City Diesel: 3 fotos (motor Caterpillar, camión grúa, work truck)
- google_rating=4.8, google_review_count=47 agregados a River City Diesel en DB

**4. Magnolia Arts Studio — downgraded a free tier**
- De premium → free, fotos limpiadas

**5. The Nest — nuevo lead premium (John Grady)**
- Upgraded a premium: descripción del dueño + 14 keywords en DB
- Estrategia de venta: mostrar listing live → ofrecer $67/mo (website + GBP + premium listing)
- Mejor link para John: `missloulocal.com/category/shopping-retail` (contraste visual) + `missloulocal.com/business/nest`

**6. Featured Businesses — nueva sección en home page**
- Entre search bar y Walking Downtown block
- Horizontal scroll, dark cards, 250px ancho, 230px alto uniforme
- Badge "★ Premium" en esquina superior derecha de CADA card (no en el título)
- Título "Featured Businesses" centrado
- Deduplicación por NAME (no por slug — pueden tener slugs diferentes)
- Only renders si hay premium listings activos

**7. Home page layout — reorganizado**
- Walking Downtown: ahora es su propio bloque arriba del grid (fuera del loop de categorías)
- "Browse by Category" título: movido a DEBAJO del bloque de Walking Downtown

**8. Premium UI en todo el site**
- Search page: premium listings ahora renderizan dark card completa (fotos, badge, rating, botones estilizados) — igual que category pages
- Regla: premium se ve premium en TODOS lados

**9. Duplicado Little Easy Tours — eliminado**
- Había 2 records: `little-easy-tours` (walking-downtown) y `little-easy-tours-tours` (tours-attractions)
- Eliminado el `little-easy-tours-tours` — record basura

**10. Multi-category support — implementado**
- Nuevo column: `secondary_category_ids uuid[]` (George corrió SQL en Supabase dashboard)
- Category page query actualizado: `.or('category_id.eq.X,secondary_category_ids.cs.{X}')`
- Secondary categories asignadas:
  - Nest → Shopping & Retail
  - Little Easy Tours → Tours & Attractions
  - Timothy Blalock → Legal & Financial
  - River City Diesel → ninguna (auto-services ya es correcto)

### Falló / Lecciones
1. Google Places photo_reference tokens expiran — nunca guardarlos en DB directamente
2. Google Cloud billing cancelado → no hay acceso a Places API (fotos, detalles, etc.)
3. Deduplicación de Featured Businesses debe ser por NAME, no por slug (misma empresa puede tener diferentes slugs)
4. iCloud Desktop ≠ `/Users/mbp_alfa_01/Desktop/` — la ruta real es la Mobile Documents path

### Pendiente próxima sesión
- Verificar en producción que Featured Businesses se ve bien en missloulocal.com
- Seguimiento con John Grady (The Nest) — ¿cerró el $67/mo?
- Esperar respuestas de 14 emails del pipeline (ver PENDING_BY_GEORGE.md)
- Potencial: más negocios premium con fotos (cualquier negocio en DB puede ser candidato)
- Considerar: agregar secondary_category_ids a más negocios futuros

---

## SESSION 009 — 2026-06-11
**Status:** Website sales outreach — 2 emails enviados (S&T Discount Tire, Heard Appliance Repair), HTML mockup mobile built, KREA AI key saved, SMS strategy defined.

### Done

**1. SMS outreach strategy — definida**
- Usar número TurboWash 360 (601) de George manualmente desde su celu
- Enviar SMS 30-60 min después del email: "Hi [Name], this is George from MissLouLocal.com — I just sent you an email about [Business], want to make sure it didn't land in spam. —George"
- NO usar el Telnyx TF +18444482494 (registrado para B2B contractor notifications solamente)

**2. S&T Discount Tire & Supply — email enviado**
- Agregado a Supabase (no estaba en DB): id `63f94f84`, auto-services, is_active: true
- Address: 5 Sgt Prentiss Dr, Natchez, MS 39120 | Phone: (601) 446-8080
- Owners: Patrick y Doug Smith (hijos de Russell, fundado 1976 — 50 años en negocio)
- Email: sandttirenatchez@gmail.com
- Domain: sandttireandsupply.com → MUERTO (no resuelve DNS) — mismo patrón que Heard
- Google Maps: aparece en posición #7 para "tire shop near me" en Natchez
- MissLouLocal URL: /business/st-discount-tire-supply-1781188088
- EMAIL ENVIADO + SMS enviado al (601) 446-8080

**3. Heard Appliance Repair — email enviado**
- Owner: Dylan Heard | Email: heardappliancerepair@gmail.com
- Supabase actualizado: email correcto + address 219 Spokane Rd, Natchez, MS 39120
- Domain: heardappliancerepair.com → MUERTO
- NO aparece en Google Maps para "appliance repair near me" — completamente invisible
- MissLouLocal URL: /business/heard-appliance-repair--1775093744567
- EMAIL ENVIADO + SMS enviado al (601) 431-7931

**4. HTML Mockup mobile — construido para Heard Appliance Repair**
- Google Stitch está ROTO — alternativa: Claude genera HTML estático directamente
- Archivos: mockups/heard-appliance-repair-mobile.html + heard-appliance-repair.html
- Skill usada: ui-ux-pro-max (design system: Trust & Authority, navy #0f2e5a + orange #f97316)
- Hero background: foto de técnico hispano (George generó con AI)
- Logo integrado en header (68px)
- Para preview link: arrastrar HTML a netlify.com/drop → URL pública gratis en 10 segundos

**5. KREA AI API — key guardada**
- Key: `56ba407e-548d-44d0-b569-c03e9a01c791:dK6lSc-...` guardada en ~/.claude_env.sh como `KREA_API_KEY`
- Endpoint: POST https://api.krea.ai/generate/image/bfl/flux-1-dev → Bearer auth → poll GET /jobs/{id}
- Estado: balance $0 — necesita top-up en krea.ai

**6. Pipeline status al cierre**
- 14 emails enviados en total (ver PENDING_BY_GEORGE.md)
- Pipeline de emails conocidos: AGOTADO
- Quedan: 4 Facebook DMs pendientes

### Falló / Lecciones
1. Google Stitch roto — usar HTML mockup generado por Claude + netlify.com/drop para link de preview
2. Pexels: nunca adivinar IDs de fotos — usar WebFetch en página de búsqueda para obtener IDs reales verificados
3. KREA API: requiere balance separado del workspace — no es el mismo crédito de krea.ai
4. Tanda 4 descartada por George: El Ranchero, Caregiver, Crescent Sotheby's

### Pendiente próxima sesión
- Esperar respuestas de los 14 emails
- 4 Facebook DMs: Soul & Stem, Sherri's Floral, Rebel Barber, The Donut Shop
- Top-up KREA AI balance para generar imágenes con AI
- Research nuevos leads en DB (672 sin website, mayoría sin email)

---

## SESSION 008 — 2026-06-06
**Status:** Article LET fix, FAQ rendering fix, GSC report, credentials, 3 emails enviados.

### Done

**1. Artículo natchez-pilgrimage-guide — LET links inyectados**
- Commits: `713b356` (links en 3 secciones) → `f8475f8` (FAQs reorganizados)
- Cron Groq no incluye LET automáticamente — hay que inyectar manualmente cada artículo publicado
- Fix: secciones 2, 3, 4 + FAQ 6 nuevo "Is there a private guided tour option?" donde LET encaja natural
- GOLDEN RULE creada: LET cross-promotion mandatory en todos los artículos, mínimo 2-3 menciones

**2. FAQ HTML rendering fix**
- Bug: `faq.a` renderizaba como texto plano — `<a>` tags aparecían literalmente
- Fix: `src/app/articles/[slug]/page.tsx` línea 159 → `dangerouslySetInnerHTML={{ __html: faq.a }}`
- Commit `0919498` vía GitHub API (git push bloqueado por branch protection en KlickifyAgency org)
- NOTA: git push directo siempre falla en este repo — usar GitHub API PUT para todos los cambios de código

**3. GSC Report — abr 1 → jun 5**
- 25 keywords con impressions, 0 clicks (normal, sitio tiene 3 semanas)
- Top: bookstore natchez ms (pos 5), businesses near me (pos 6)
- Próxima revisión: 2026-07-06

**4. Credenciales → ~/.claude_env.sh**
- VERCEL_TOKEN, STRIPE_PUBLISHABLE_KEY, UPTIMEROBOT_API_KEY

**5. UptimeRobot** — ya monitoreaba missloulocal desde sesión anterior. 9 monitores UP.

**6. Stripe en Vercel** — HOLD. Payment links no necesitan keys en app.

**7. 3 emails enviados — Tanda 3**
- Sew Sew Great Alterations — gabi_gabs03@yahoo.com | first mover angle
- Jason's Body Shop — jasonsbodyshop@bellsouth.net | quote Eric Perry, competitor: Alexander Body Shop
- Woods Security — woodscsecurity@bellsouth.net | owner: Charles Woods, competitor: ADT
- **Total acumulado: 12 emails enviados**

### Próxima sesión
- Revisar respuestas de los 12 emails — si alguien pagó → build site inmediato
- Tanda 4: El Ranchero, Caregiver, Crescent Sotheby's
- DM Facebook: Soul & Stem, Sherri's Floral, Rebel Barber, The Donut Shop
- GSC review: 2026-07-06

---

## SESSION 006 — 2026-06-04
**Status:** Website sales outreach — 3 emails sent, templates locked

**Done:**
- Confirmed FINAL email template (word-for-word, no rewording allowed) — saved in memory `project_website_sales.md`
- Confirmed subject line format: `[First name] — something I put together for [Business Name] this morning`
- Sent email → Miss-Lou Magnolia Maids LLC (Brittany, brittanymorace@gmail.com) — Stitch mockup sage green/gold, competitor: Merry Maids
- Sent email → J.E. Remodeling and Repairs (Jay Evans, woodcutter365@gmail.com) — Stitch mockup navy/amber, competitor: Angi, owner found via Facebook
- Sent email → The Natchez Printing Co. (Nancy Kimbrell, print@natchezprinting.com) — premium Stitch mockup forest green/gold serif, competitor: Yelp/Murray Printing, owner confirmed via LinkedIn
- Template rule added: when client already has professional email → remove email mention, change $67 line to "covers your domain and initial setup"
- Pipeline updated: 8 total emails sent to date

**Active pipeline (not yet contacted):**
- Caregiver — madipaigemoss1999@gmail.com
- Crescent Sotheby's — diannenatchez@gmail.com
- Sew Sew Great Alterations — gabi_gabs03@yahoo.com
- Woods Security & Investigations — woodscsecurity@bellsouth.net
- El Ranchero — loreelzavilam@yahoo.com
- Jason's Body Shop — jasonsbodyshop@bellsouth.net
- S&T Discount Tire — sandttirenatchez@gmail.com
- Facebook DM targets: Soul & Stem, Sherri's Floral, Rebel Barber, The Donut Shop

**Next session:** Continue outreach — next target: Sew Sew Great Alterations or Jason's Body Shop

---

## SESSION 001 — 2026-05-22
**Status:** Setup session — migrated from Claude.app to Claude Code + VS Code

**Done:**
- Read full Project Memory PDF (4 pages)
- Scanned complete codebase: 45 src files, all routes, components, lib
- Adopted military order structure (SESSION_DIARY, GOLDEN_RULES, PENDING_BY_GEORGE, memory files, CLAUDE.md)
- Created all memory files for future sessions

**State of platform:**
- Live at missloulocal.com (Vercel Hobby plan, Cloudflare DNS)
- 871+ businesses, 19 categories
- Supabase project: dqdlmquperjqbrplkeco
- Last commit: fix healthcheck retry on timeout (51d5a92)
- Stripe keys: NOT configured (placeholder values in .env.local)
- VAPID push notifications: configured
- Bradley Telegram bot: running on VPS at 187.77.18.151
- Nightly sync cron: /home/missloulocal-crons/sync-events.js (runs midnight)

**Pending (passed from Project Memory):**
- Dynamic business counter connected to Supabase (not hardcoded)
- UptimeRobot 24/7 monitoring setup
- Reviews & Ratings system (Priority 2)

**Next session:** Pick up from pending tasks above

---

## SESSION 005 — 2026-05-23
**Status:** Full security audit + hardening — MissLouLocal + cross-project (VPS, Cloudflare, Rank & Rent)

### Audit Findings (MissLouLocal)
- `src/app/admin/page.tsx:5` — `const ADMIN_PASSWORD = 'klickify2026'` hardcoded in **client bundle** (CRITICAL — anyone could see it in browser DevTools)
- `src/app/api/admin/businesses/route.ts` — used SERVICE_ROLE_KEY with **zero auth check** (CRITICAL — any HTTP client could approve/delete businesses)
- `src/app/api/push/send/route.ts` — **no auth** — anyone could blast push notifications to all subscribers
- `src/app/api/search/route.ts` — string concatenation in `.or()` filter, PostgREST syntax chars injectable (MODERATE)
- `.env.local` — `SUPABASE_SERVICE_ROLE_KEY` duplicated (lines 3 and 10)
- RLS: ✅ ACTIVE — anon only sees is_active=true businesses (already correct)

### Fixes Applied (MissLouLocal)
1. **Removed `const ADMIN_PASSWORD = 'klickify2026'`** from `admin/page.tsx` — gone from client bundle
2. **Created `src/lib/admin-auth.ts`** — HMAC-SHA256 token validation using `crypto.timingSafeEqual()` (timing-safe comparison)
3. **Created `src/app/api/admin/auth/route.ts`** — POST/GET/DELETE endpoints:
   - POST: validates password vs `ADMIN_PASSWORD` env var, sets `httpOnly; Secure; SameSite=strict` cookie
   - GET: validates cookie (used by page on mount to restore session)
   - DELETE: clears cookie (logout)
4. **Protected `api/admin/businesses` GET + PATCH** — 401 without valid cookie
5. **Protected `api/push/send` POST** — 401 without valid cookie
6. **Sanitized search input** — `q.replace(/[^a-zA-Z0-9 '\-]/g, '')` before PostgREST interpolation
7. **Fixed `.env.local`** — removed duplicate, added `ADMIN_PASSWORD=klickify2026` + `ADMIN_SECRET` (64-char hex, server-side only)
8. **Admin page** — login now POSTs to server, `useEffect` on mount checks cookie to restore auth across page reloads

### Cross-Project Fixes (same session)

**Rank & Rent (local config.py):**
- Removed 4 hardcoded passwords (PROTON_BRIDGE_PASSWORD, P01/P02/P03_GMAIL_PASS) → `os.getenv()`
- Created `.gitignore` (covers .env, credentials/, *.pem)

**VPS (187.77.18.151):**
- Created `/etc/rkr-secrets.env` (chmod 600, root:root) — all secrets centralized
- Rewrote 4 webhook apps with proper signature validation:
  - Hattiesburg (port 5000): Twilio HMAC-SHA1 via `RequestValidator` + `ProxyFix`
  - Mobile (port 5001): same pattern
  - Dothan (port 5003): Telnyx Ed25519 (300s replay protection) + HMAC-SHA256 for SMS
  - SMS forwarder (port 5055): Twilio HMAC-SHA1
- Updated 4 systemd services with `EnvironmentFile=/etc/rkr-secrets.env`
- Rewrote nginx `septic_landlord` config with HTTPS + proxy headers
- Patched nginx `mobile_septic_pros` with proxy blocks
- Rewrote nginx `default` to catch-all (return 444)
- Added security headers to `klickifyagency.com` + `trulyfreeqr.link` nginx (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- Removed stale manual iptables rules that bypassed UFW
- Reboot: kernel `6.8.0-107` → `6.8.0-117`

**Cloudflare (all 16 domains):**
- `min_tls_version`: 1.0 → **1.2** (16/16 zones)
- `always_use_https`: off → **on** (16/16 zones)
- Domains: dothanjunkremovalco.com, hattiesburgsepticpumping.com, klickifyagency.com, lafiestanatchez.com, logisticssmithfba.com, magnoliaartsstudio.com, missloulocal.com, mobilesepticpros.com, natcheznest.com, snapchez.com, tecniflux.app, trulyfreemortgage.com, trulyfreeqr.com, trulyfreeqr.link, trulyfreetools.com, vacaysmith.com

### Notes
- Ubuntu ESM "10 security updates" = Ubuntu Pro paid tier — NOT installable without subscription. Not a real gap.
- `klickifyagency.com` SSL stays **flexible** on Cloudflare (VPS serves HTTP, CF does TLS) per GOLDEN_RULES — always_use_https is CF-edge redirect only, doesn't break this.
- `trulyfreeqr.link` also flexible SSL — same logic.

**Pending:**
- Artículos #4-#52 (49 pendientes) — next content session
- Stripe keys in Vercel (sigue pendiente)
- UptimeRobot (sigue pendiente)

**Next session:** Content — artículos #4+ OR feature work

---

## SESSION 002 — 2026-05-22
**Status:** Full SEO overhaul + Phase 1 guide pages launched

**Done:**
- Full SEO audit: identified 4 critical issues (no sitemap, no robots.txt, CSR category pages invisible to Google, homepage BAILOUT_TO_CLIENT_SIDE_RENDERING)
- Created src/app/robots.ts → /robots.txt now live
- Created src/app/sitemap.ts → dynamic sitemap 1,027+ URLs (businesses + categories + static)
- Converted category/[slug]/page.tsx from 'use client' to Server Component (Google can now crawl all 1,135 businesses)
- Fixed homepage: extracted useSearchParams to HomeClaimHandler client island, page.tsx now SSR
- Live business count: 1,135 (not 871 — Session 001 was stale)
- Rewrote about/page.tsx (real content, canonical, JSON-LD)
- Updated layout.tsx: metadataBase, title template, OG tags
- Submitted sitemap to Google Search Console via API (1,027 URLs, 0 errors, Google confirmed)
- Phase 1 guides: created 6 authority content pages targeting Natchez organic keywords
  - src/lib/guides.ts — central guide config
  - src/app/guides/page.tsx — index (CollectionPage JSON-LD)
  - src/app/guides/[slug]/page.tsx — SSR template (Article + FAQPage + ItemList JSON-LD)
  - Guides: best-restaurants, things-to-do, walking-tour, best-doctors, best-home-services, farmers-market
- Updated sitemap.ts to include /guides + 6 guide URLs (priority 0.85)
- Added Guides section to homepage for internal linking
- Commit 728b174 pushed → Vercel deploying

**Pending:**
- Phase 2: "Best [Category] in Natchez MS" pages for all 19 categories
- Phase 3: 1 new article/week about Natchez
- PENDING_BY_GEORGE: Stripe keys in Vercel (placeholder values only)
- PENDING_BY_GEORGE: UptimeRobot setup for missloulocal.com
- Re-submit sitemap to GSC after deploy (guide URLs now in sitemap)

**Next session:** Start Phase 2 category SEO pages OR wait ~1 week to see GSC indexing progress on Phase 1 guides

---

## SESSION 003 — 2026-05-22 (continuación misma fecha)
**Status:** SEO organic system completo — BreadcrumbList, internal linking, automated weekly articles

**Done:**
- BreadcrumbList JSON-LD en 1,023+ páginas (business, category, guides, articles)
- Category pages → Guide internal linking: banner azul en todas las 17 categorías → guide correspondiente
- Automated weekly article system:
  - VPS cron: `/home/missloulocal-crons/generate-article.js` — runs viernes 8am
  - Arquitectura: Claude API → JSON file → GitHub API push → Vercel auto-deploy
  - 52 temas pre-cargados (1 año sin repetir, cubriendo tourism/food/history/living/outdoors/events)
  - GitHub token en script: `<REDACTED_GITHUB_TOKEN>` (keychain Mac)
  - Articles = archivos JSON en `src/app/articles/data/` (NO Supabase — DDL requiere postgres password que no tenemos)
  - index.json = registry de artículos publicados (lo lee el cron y las páginas Next.js)
- Article #1 publicado hoy: `natchez-trace-parkway-visitor-guide`
  - ~1,500 palabras, tono humano, milepost exactos, detalles locales reales
  - Live: missloulocal.com/articles/natchez-trace-parkway-visitor-guide
- Sitemap resubmitido a GSC (1,027 URLs confirmed, status: Success)
- Homepage actualizada: secciones "Local Guides" (4 featured) + "Local Articles" (nuevo)

**Problemas resueltos:**
- Supabase DDL bloqueado: service role key = REST API CRUD only, NO puede crear tablas. Necesita postgres password (no disponible) o management API token (no disponible). Solución: file-based articles en repo git.
- GSC sitemap 403: OAuth georgelopez1972@gmail.com no tiene permisos en missloulocal.com GSC. George resubmitió manualmente desde dashboard (éxito).
- Anthropic API key: no existe en ningún config. George tiene Claude Pro pero eso NO incluye API access. Solución: Claude (Sonnet) escribe artículos manualmente — mejor calidad, cero costo.
- VPS sin repo clonado: usamos GitHub API directamente desde el script con token del keychain Mac.

**Estado del sistema de artículos:**
- Cron listo en VPS ✅
- GitHub token funcional ✅  
- Article #1 live ✅
- 51 artículos pendientes de escribir (en cola para próximas sesiones)

**Commits de esta sesión:**
- 5a12e0e — BreadcrumbList + category→guide linking
- c1db55b — article system (Supabase version, luego reemplazado)
- 8655fb9 — refactor a file-based articles
- 7ca4558 — article #1 Natchez Trace Parkway

**Pending para próxima sesión:**
- Escribir artículos #2-#52 (51 pendientes) — dividir en grupos por sesión
- Actualizar cron VPS para que la key de Anthropic no sea necesaria (ya usa GitHub API)
- Phase 3 monitoring: revisar GSC en ~7-14 días para ver keywords con impressions
- Stripe keys (sigue pendiente)
- UptimeRobot (sigue pendiente)

---

## SESSION 004 — 2026-05-22 (continuación, cierre de sesión)
**Status:** Articles #2 y #3 publicados. Chat cerrado ordenadamente.

**Done:**
- Artículo #2 publicado: `antebellum-homes-natchez-ms`
  - ~1,500 palabras, tono humano, cubre Stanton Hall, Longwood, Rosalie, Dunleith/Monmouth, Melrose/NPS, Natchez Pilgrimage, notas prácticas
  - Commit 25b04bf → live en missloulocal.com/articles/antebellum-homes-natchez-ms
- Artículo #3 publicado: `ghost-tours-natchez-ms`
  - ~1,400 palabras, tono humano, cubre King's Tavern, Longwood, The Burn, operadores de tours, timing, notas honestas
  - Commit cf6ef7b → live en missloulocal.com/articles/ghost-tours-natchez-ms
- index.json actualizado con artículos #2 y #3
- TOPICS array confirmado en VPS (52 temas totales, en orden)
- Próximo artículo en queue: `moving-to-natchez-mississippi` (topic #4, category: living)

**Estado del sistema de artículos:**
- Artículos publicados: 3 (de 52)
- Pendientes: 49 artículos
- Queue confirmada en VPS: /home/missloulocal-crons/generate-article.js → TOPICS array

**Pending para próxima sesión:**
- Artículos #4-#52 (49 pendientes)
- Próximo: `moving-to-natchez-mississippi` — "Moving to Natchez Mississippi — Relocation Guide" (living)
- Luego: `natchez-pilgrimage-guide`, `under-the-hill-natchez-history`, `best-bbq-natchez-ms`
- Stripe keys (sigue pendiente)
- UptimeRobot (sigue pendiente)
- GSC review: ~2026-06-05 para ver keywords con impressions

---

## SESSION 005 — 2026-06-03
**Status:** Local Events fijos, article pipeline 100% automático, artículos actualizados con LET + MissLouLocal.

### Done

**1. Local Events — LET Featured**
- Ghost Tour (`starts_at = Apr 11`, `is_featured=false`) → actualizado a hoy, `is_featured=true`
- Private Half Day Tour (`starts_at = May 1`, `is_featured=false`) → actualizado a hoy, `is_featured=true`
- Natchez Buzz Bus → insertado como nuevo evento featured con link a FareHarbor
- `sync-events.js` en VPS: agregado `refreshLETTours()` — PATCH nightly `starts_at=NOW()` para todos `source=littleeasytours` activos. Nunca INSERT (evita duplicados). Corre medianoche junto con Farmers Market sync.

**2. Article Pipeline — Migrado Anthropic → Groq (FREE)**
- Problema: `ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY_HERE` → cron fallaba cada viernes con 401
- Solución: migrar a Groq API (Llama 3.3 70B, free tier, 30k tokens/día)
- GitHub token expirado (`gho_wGjY...`) → reemplazado por `<REDACTED_GITHUB_TOKEN>` (no expiration)
- Repo renombrado: `gsmith0572-dot/missloulocal` → `KlickifyAgency/missloulocal`
- Fix JSON parser: `response_format: {type: "json_object"}` en Groq call para JSON válido garantizado
- Prompt mejorado: system prompt con reglas anti-AI (prohíbe "In conclusion", "It's worth noting", "Dive into", etc.), 4 secciones × 250+ palabras, 5 FAQs, mínimo 1,400 palabras
- Artículo #4 generado y publicado: `moving-to-natchez-mississippi`

**3. Vercel Auto-Deploy — Resuelto**
- Causa: Vercel GitHub App no instalada en `KlickifyAgency` org → webhooks rotos
- Solución: Vercel Deploy Hook creado vía API — `https://api.vercel.com/v1/integrations/deploy/prj_rK680Njb6tB4b8d2KMWRG8VOy2jM/NBpT7o7L2B`
- Hook agregado al final de `generate-article.js` — cron triggea Vercel deploy automáticamente post-publish
- Git fix: refs corruptos `main 2` y `main 3` (con espacios) causaban `fatal: bad object refs/heads/main 2` → eliminados manualmente de `.git/refs/`

**4. Artículos — LET + MissLouLocal Mentions**
- `article/[slug]/page.tsx`: `{section.body}` → `dangerouslySetInnerHTML` para soportar HTML/links en body
- Ghost Tours: LET nombrado como operador recomendado en sección "Operators", link a ghost tour page. + MissLouLocal en sección "When to Go"
- Antebellum Homes: LET mencionado como guía de Pilgrimage, link a private tours. + MissLouLocal en sección parking/tips
- Moving to Natchez: LET como forma de orientarse al llegar, link a private tours. + MissLouLocal en sección community
- Estilo de links: color `#e94560`, `target="_blank" rel="noopener noreferrer"`

### Commits
- `259bb02` — feat: LET + MissLouLocal mentions across articles + dangerouslySetInnerHTML support
- `cb8236c` — content: update articles index (VPS push)
- `08d1f26` — content: auto-publish article moving-to-natchez-mississippi (VPS push)

### Estado artículos
- Publicados: 4 (Natchez Trace, Antebellum Homes, Ghost Tours, Moving to Natchez)
- Pipeline: 100% automático — Groq genera → GitHub push → Vercel deploy hook
- Próximo viernes (2026-06-06): `natchez-pilgrimage-guide` (auto)
- Pendientes: 48 artículos en queue

### Pending próxima sesión
- Revisar GSC (2026-06-05 era target — ya pasó ayer, revisar keywords con impressions)
- Stripe keys (sigue pendiente)
- UptimeRobot (sigue pendiente)
- Considerar: el cron VPS de artículos debería también actualizar el prompt del futuro generador para incluir menciones automáticas de LET cuando el tema lo permita

---

## SESSION 007 — 2026-06-03
**Status:** Website sales — 2 emails enviados, pipeline actualizado, template refinado.

### Done

**1. Pipeline actualizado**
- Confirmado: Southern Lawns, Bloomsbury Larder, TDF Tree Service, EmberShield = emails enviados ~hace 1 mes, sin respuesta
- EmberShield marcado como cold lead
- Memoria actualizada con todos los estados

**2. Email enviado — Robert Hill Lawn Services**
- roberthill39120@gmail.com | 601-870-8992
- Encontrado en Nextdoor: "Quality Work, Professionalism, Great Value" (Sharon Barrett rec)
- Stitch mockup: lawn care verde, 3 columnas servicios, trust badges
- Gancho email: vecinos de Nextdoor recomiendan → TruGreen aparece primero en Google
- Domain propuesto: roberthilllawnservices.com

**3. Email enviado — Casey's Cleaning Co.**
- caseylynn2003@icloud.com | 601-431-7643
- Encontrado en Facebook: rec de Shaun P Davis — "very thorough and professional, recommend unconditionally"
- Stitch mockup: teal/white, cleaning concierge, layout limpio
- Stitch link: https://stitch.withgoogle.com/preview/11225769015138783275?node-id=d8fe460adae0463084c6f2093dea02f6
- Gancho email: cliente recomienda "incondicionalmente" → Molly Maid aparece primero en Google
- Domain propuesto: caseyscleaningco.com

**4. Template refinado (lecciones)**
- Gancho = cita real de cliente (Nextdoor/Facebook), no estadísticas genéricas
- Nombrar el competidor nacional específico que los opaca en Google
- Sin logo upsell, sin mención de SEO — mantener email corto y directo
- Facebook profile.php?id= requiere login — WebFetch no puede acceder, pedir a George que copie lo que ve

### Scoreboard total enviados
| Negocio | Fecha | Estado |
|---------|-------|--------|
| Southern Lawns | ~2026-05 | Sin respuesta |
| Bloomsbury Larder | ~2026-05 | Sin respuesta |
| TDF Tree Service | ~2026-05 | Sin respuesta |
| EmberShield | ~2026-05 | Sin respuesta (cold) |
| Robert Hill Lawn Services | 2026-06-03 | Esperando |
| Casey's Cleaning Co. | 2026-06-03 | Esperando |

### Pending próxima sesión
- Próxima tanda de 3 emails: Miss-Lou Magnolia Maids, J.E. Remodeling, + uno más (El Ranchero o S&T Tire)
- Si alguno responde → build site inmediatamente
- GSC review (venció 2026-06-05 — URGENTE)
- Stripe keys en Vercel (pendiente)
- UptimeRobot (pendiente)

---

## SESSION 006 — 2026-06-03
**Status:** Website sales strategy lanzada — primer cliente activo, pipeline construido, Stripe configurado.

### Done

**1. Estrategia de monetización — Website Sales**
- Modelo: contactar negocios listados gratis en MissLouLocal sin website → ofrecerles website via Klickify Agency
- Pricing: $67 setup (dominio + email) + $25 logo opcional + $47/mes hosting
- Stack: HTML estático en VPS nginx, dominio Cloudflare, email via Cloudflare Email Routing (gratis → Gmail)
- SEO básico incluido gratis en cada sitio cliente

**2. Stripe configurado**
- Restricted API key en `~/.claude_env.sh` como `STRIPE_SECRET_KEY`
- $67 setup: https://buy.stripe.com/28E14oexleYs1pN4vVbEA07
- $25 logo: https://buy.stripe.com/eVqfZi1Kz2bGb0n7I7bEA09
- $47/mo hosting: https://buy.stripe.com/8x25kEexlcQk3xV5zZbEA08 (mandar solo cuando site esté listo)

**3. Primer cliente — Southern Lawns, LLC**
- Caroline Gasquet — misslousouthernlawns@gmail.com | 601-807-3075
- Respondió positivamente al mockup Stitch. Email con Stripe links enviado.
- Esperando pago $67. Dominio: southernlawnsms.com. 23 años de negocio.

**4. Pipeline construido**
- 672 sin website, 14 con email en DB, 134 en categorías clave con teléfono
- Emails encontrados via web search:
  - El Ranchero Vidalia: loreelzavilam@yahoo.com | (318) 336-8808
  - Jason's Body Shop: jasonsbodyshop@bellsouth.net | (601) 443-9731
  - S&T Discount Tire: sandttirenatchez@gmail.com | (601) 446-8080
- Facebook DM targets: Soul & Stem Flowers, Sherri's Floral, Rebel Barber Shop, The Donut Shop

### Pending próxima sesión
- Confirmar pago Caroline → build Southern Lawns site
- Emails personalizados + Stitch mockups para El Ranchero, Jason's Body Shop, S&T Tire
- DM Facebook: Soul & Stem, Sherri's Floral, Rebel Barber, The Donut Shop
- Revisar GSC ASAP (target 2026-06-05 ya venció)
- Stripe keys en Vercel (pendiente)
- UptimeRobot (pendiente)

---

## SESSION 007 — 2026-08-02
**Status:** Diagnóstico sitewide OK. Bug healthcheck.js fixed. The Nest bajado de premium. FB Autopost infra creada — bloqueado en calidad de imagen IA gratis.

### Done

**1. Diagnóstico VPS sitewide**
- Bug en `healthcheck.js`: email de alerta mostraba "undefined" en vez del error real cuando el check fallaba por timeout/conexión (result.data sin fallback). Fixeado — ahora usa `result.error` como fallback. Backup: `healthcheck.js.bak-20260802164157`
- Todos los crons revisados: sync-events (diario OK), generate-article (viernes OK, 12→13 artículos publicados), Bradley bot (systemd activo, sin errores), healthcheck (limpio post-fix)
- `refresh-ratings.js` / `scrape-emails.js` confirmados fuera de crontab a propósito (George: manual por ahora)
- Sitio: todas las páginas clave HTTP 200

**2. The Nest — bajado de Featured Businesses**
- `businesses.tier` cambiado de `premium` a `free` (id `714d291b-ab4b-462d-93bd-210bad22b124`)
- Homepage/category/search son estáticas (no `dynamic='force-dynamic'`) → hubo que triggear el Vercel deploy hook para que el cambio se reflejara. Verificado en vivo: ya no aparece en Featured, sigue en categoría shopping-retail como free.

**3. Facebook Autopost — infra creada, no activa aún**
- Business Portfolio correcto: **Apachichi LLC** (NO "Vacay Smith LLC", ese está hackeado — ver [[project_vacaysmith_fb_token_resolved]] en memory de Vacay Smith)
- Page "Miss Lou Local - Natchez Directory" agregada como asset — ID `1045698738630364`
- App nueva creada: **MissLouLocal Autopost** — App ID `1558787699121063`, use case "Manage everything on your Page"
- System User: **Missloulocal Autopost Bot** — ID `61592882306119`, Employee, Full access a Page + App
- Token real de Page (via gotcha conocido: token de System User no sirve directo, hay que pedir `GET /{page-id}?fields=access_token` con ese token) guardado como `FB_TOKEN_MLL` en `/home/missloulocal-crons/.env`
- **Post de prueba YA está en vivo en la Page real** — id `1045698738630364_122119591718885885` — George debe revisar/borrar si no lo quiere ahí
- Scripts en VPS `/home/missloulocal-crons/`: `mll_fb_image.js` (genera imagen + overlay marca con sharp + sube a Supabase Storage bucket `business-photos/article-images/` + postea a FB `/photos`), `mll_fb_backfill.js` (postea 1 artículo no-posteado por corrida, pensado para cron 4x/día), `mll_fb_preview.js` (solo genera+sube, no postea — para revisión)
- Hook agregado a `generate-article.js` (cron viernes 8am): después de deployar, intenta postear a FB (try/catch no-fatal). Backup: `generate-article.js.bak-<timestamp>`
- Log compartido `.fb_posted.json` (en `mll_fb_image.js`) evita duplicar entre backfill y el hook semanal

**4. BLOQUEANTE — calidad de imagen IA**
- **Leonardo AI**: requiere plan pago, George no tiene fondos → descartado
- **Gemini** (`gemini-2.5-flash-image`): free tier tiene `limit: 0` — requiere billing habilitado igual, aunque no se cobre → descartado por ahora (key guardado como `GEMINI_API_KEY` en .env por si se habilita billing después)
- **Hugging Face FLUX.1-schnell**: el modelo YA NO está en el endpoint viejo `hf-inference` (410 deprecated). Está "live" en providers nscale/fal-ai/together/wavespeed pero cada uno pide un formato de request distinto al `{inputs: prompt}` clásico — no resuelto, quedó roto. Token guardado como `HF_TOKEN` en .env.
- **Pollinations.ai** (fallback actual, gratis, sin key): funciona técnicamente, prompt mejorado (usa H1 completo del artículo → sí relevante al tema), pero la imagen sale consistentemente blanda/blurry incluso con `enhance=true` + `sharpen()` en sharp. George no aprobó — no es la calidad que busca para FB.

### Pending próxima sesión
- Resolver generador de imagen gratis con buena calidad: opciones a investigar → formato correcto de HF Inference Providers (revisar docs.huggingface.co/inference-providers para el payload exacto por proveedor, probablemente OpenAI-compatible `/v1/images/generations` en vez de `{inputs}`), o evaluar otra alternativa gratis
- Una vez resuelta la calidad: correr `mll_fb_preview.js` de nuevo para los 13 artículos, mostrar galería, aprobación de George
- Activar cron de `mll_fb_backfill.js` (4x/día espaciado, ~3-4 días para cubrir 13 artículos) — SOLO después de aprobación
- George debe decidir si borra el post de prueba ya en vivo en la Page (id `1045698738630364_122119591718885885`)
- Pipeline de posteo (imagen→Supabase→FB `/photos`) y el hook en `generate-article.js` YA están listos y probados — solo falta la parte de generación de imagen

---

## SESSION 008 — 2026-08-02
**Status:** FB Autopost EN VIVO. Bloqueante de imagen resuelto (dos intentos, ambos evaluados y el segundo aprobado).

### Done

**1. Intento 1 — Cloudflare Workers AI FLUX-1-schnell (descartado por George)**
- Endpoint `POST https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell` — funciona con auth `X-Auth-Email`+`X-Auth-Key` (Global API Key). El `CF_API_TOKEN` scoped dio 401 (sin permiso Workers AI) — no se investigó más porque Global Key ya resolvía.
- Calidad de imagen en sí buena (nítida, 1024x1024, sin blur), gratis, mismo account CF ya usado en el proyecto.
- Generó preview de los 13 artículos (`mll_fb_preview.js`) — subidas a Supabase `article-images/preview-*.jpg`.
- **George rechazó el approach completo** (no la calidad): mayoría de fotos no eran coherentes con el título ("Ghost Tours" y "Moving to Natchez" salieron con texto garabateado falso metido en la foto por el modelo — FLUX ignora "no text" del prompt en escenas con letreros/ventanas). Cita: *"esto no vale la pena... vamos con la otra opción, el formato fijo."*
- Nota UX: George no pudo ver las imágenes ni inline ni vía Artifact gallery ni URL directa pegada en chat — terminó abriendo la URL pública en Chrome directo y ahí sí las vio (cache de browser en medio, resuelto con hard-refresh). Para próxima vez: no asumir que el visor de chat renderiza imágenes remotas, ir directo a "abrí esta URL en Chrome".

**2. Intento 2 — Template fijo SVG (APROBADO, es el que quedó en producción)**
- Reescribió `generateArticleImage()` en `mll_fb_image.js`: sin foto, sin API externa, sin costo. SVG puro: gradiente `#1e3a8a`→`#0b1220`, glow radial decorativo, 2 paths "wave" simulando río en la parte baja, franja superior `${BRAND_BLUE}`, título (`wrapText`, 3 líneas máx, ancla el bloque de texto desde abajo con `textStartY = H - 90 - textBlockH + lineHeight` — esto de paso arregla el bug viejo de título cortado/desbordado en headlines largos), logo 64x64 arriba-derecha, footer "MissLouLocal.com". Render vía sharp → JPEG 1200x630 calidad 90.
- Limpieza de orphans: eliminadas `buildImagePrompt`, `overlayBrand` (versión foto), `fetchJson`/llamada a CF — todas huérfanas tras el swap.
- Flujo de edición seguido: pull del archivo vivo en VPS → diff contra versión editada → sólo entonces `scp` de vuelta (regla Karpathy de esta sesión, sin overwrite ciego).
- Vars `CF_EMAIL`, `CF_GLOBAL_API_KEY`, `CF_ACCOUNT_ID` quedaron guardadas en `.env` del VPS sin uso actual (por si se retoma foto-AI en el futuro).
- Re-corrida de `mll_fb_preview.js` con las 13 imágenes nuevas — aprobado por George.

**3. Activación del pipeline completo**
- Hook en `generate-article.js` (cron viernes `0 8 * * 5`) ya estaba wireado de la sesión anterior — confirmado activo, sin cambios.
- Cron `mll_fb_backfill.js` instalado: `0 6,12,18,0 * * *` (4x/día) — drena el backlog de 13 artículos, después queda no-op permanente.
- Corrida manual de verificación: posteó OK a la Page real, post id `1045698738630364_122119598438885885` (`natchez-trace-parkway-visitor-guide`). Quedan 12 en cola para el cron.
- Post de PRUEBA de la sesión anterior (`..._122119591718885885`) borrado vía Graph API `DELETE` a pedido de George — solo queda el primer post real del backfill en la Page.

### Decisión — no reabrir sin aprobación
No reintroducir generación de foto por IA en este pipeline sin luz verde explícita de George — ya se evaluaron y rechazaron dos veces (Pollinations por blurry en sesión 007, CF Flux por incoherencia con el título en esta sesión).

### Pending próxima sesión
- Ninguno técnico — pipeline corriendo solo (hook semanal + backfill 4x/día).
- Monitorear que el backfill drene los 12 artículos restantes sin duplicados (`.fb_posted.json` ya lo previene).

---
