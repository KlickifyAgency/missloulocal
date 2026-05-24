# PENDING BY GEORGE — MissLouLocal Digital Directory
> Acciones que requieren George manualmente. Claude no puede hacer estas.

---

## PRIORITY 1 — Revenue / Critical

### [ ] Configure Stripe keys en .env.local + Vercel
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → currently placeholder
- `STRIPE_SECRET_KEY` → currently placeholder
- `STRIPE_WEBHOOK_SECRET` → currently placeholder
- También setear en Vercel dashboard → Environment Variables

---

## PRIORITY 2 — Monitoring & Infra

### [ ] UptimeRobot setup para missloulocal.com
- Crear monitor en uptimerobot.com (gratis)
- URL: https://missloulocal.com
- Alert email: gsmith0572@gmail.com
- Check interval: 5 minutos

### [ ] Revisar GSC en 7-14 días (2026-05-29 a 2026-06-05)
- Ir a search.google.com/search-console → missloulocal.com → Performance
- Ver qué keywords tienen impressions
- Ver si guides aparecen indexados bajo Pages
- Reportar a Claude para ajustar estrategia SEO

---

## PRIORITY 3 — SEO Content (Claude builds next session)

### [ ] Escribir artículos #4 a #52 (49 pendientes)
- Lista completa de temas en `/home/missloulocal-crons/generate-article.js` (array TOPICS)
- Artículos publicados: #1 natchez-trace-parkway-visitor-guide, #2 antebellum-homes-natchez-ms, #3 ghost-tours-natchez-ms
- **Próximo a escribir:** `moving-to-natchez-mississippi` (topic #4, category: living)
- Luego: `natchez-pilgrimage-guide`, `under-the-hill-natchez-history`, `best-bbq-natchez-ms`
- Formato: JSON en `src/app/articles/data/[slug].json` + actualizar `index.json`
- Estándar: 1,200-1,600 palabras, tono humano, detalles locales específicos, sin fluff
- Claude escribe en grupos de 5-10 por sesión

---

## COMPLETED (archive)
- [x] Admin panel security overhaul (2026-05-23) — hardcoded password removed, server-side httpOnly cookie auth, APIs protected
- [x] Cloudflare TLS 1.2 + always_use_https — all 16 domains (2026-05-23)
- [x] RLS anon INSERT policy on businesses table
- [x] Slug auto-generation trigger
- [x] Claim modal functionality restored after git clone loss
- [x] VAPID push notification keys configured
- [x] Healthcheck cron (Vercel, daily 8am)
- [x] Dynamic business counter (live, muestra 1,135+)
- [x] sitemap.xml creado y subido a GSC (1,027 URLs, Success)
- [x] robots.txt creado
- [x] Category pages convertidas a Server Components (Google puede crawlear)
- [x] Homepage BAILOUT_TO_CLIENT_SIDE_RENDERING resuelto
- [x] About page con contenido real y JSON-LD
- [x] 17 guide pages (Phase 1 + Phase 2) — todas las categorías cubiertas
- [x] BreadcrumbList en 1,023+ páginas
- [x] Category → Guide internal linking en todas las categorías
- [x] Article system infrastructure (pages, sitemap, VPS cron con GitHub API)
- [x] Artículo #1 publicado: Natchez Trace Parkway (mayo 2026)

---
