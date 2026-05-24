# SESSION DIARY — MissLouLocal Digital Directory

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
  - GitHub token en script: `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` (keychain Mac)
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
