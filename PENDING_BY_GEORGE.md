# PENDING BY GEORGE — MissLouLocal Digital Directory
> Acciones que requieren George manualmente. Claude no puede hacer estas.

---

## PRIORITY 2 — Infra (2026-09-06, SESSION 011)

### [ ] Revisar `/opt/rkr-nexus/nexus/llm.py` (Rank & Rent)
Sigue con model ids hardcodeados: `openai/gpt-oss-20b` (línea 41) y `gemini-3.5-flash-lite`
(línea 43). No lo convertí porque tiene su propia lógica de budget/fallback y maneja el
outreach de Rank & Rent — merece su propia sesión, no un edit de paso.
El guard vigila el pin de Groq a diario; el de Gemini no se puede verificar (no hay key).

### [ ] Decidir sobre `ANTHROPIC_API_KEY` en `~/.claude_env.sh` (local Mac)
Lo saqué del VPS (`/home/missloulocal-crons/.env`) como pediste. En el Mac quedan 2
referencias en `~/.claude_env.sh` — **no las borré** porque no sé si otra herramienta
local las usa. Decime y las saco.

### [ ] Confirmar que VacaySmith y b2l vuelven a publicar solos
Ambos estuvieron muertos los mismos 3 viernes por el modelo Groq retirado. Ya resuelven a
`openai/gpt-oss-120b`. **No los corrí manualmente** — publican en sitios de otros proyectos.
Verificar después de su próximo cron programado.

## PRIORITY 0 — Premium Listings Sales (Revenue activo)

### [ ] John Grady — The Nest (505 Franklin St, Natchez)
- Listing live en premium: missloulocal.com/business/nest
- Pitch link #1 (contraste visual): missloulocal.com/category/shopping-retail
- Pitch link #2 (su listing completo): missloulocal.com/business/nest
- Oferta: $67/mo → website + GBP optimizado + Premium Listing en MissLouLocal
- Contacto: John Grady (dueño)

### [ ] Cierre pendiente — premium listings existentes
- Little Easy Tours, Timothy Blalock, River City Diesel → confirmar si están pagando o son cortesía
- River City Diesel: no tiene website — candidato para $67/mo package

---

## PRIORITY 1 — Website Sales (Pipeline email)

### [ ] Esperar respuestas — 14 emails enviados
| Business | Email | Enviado | Estado |
|----------|-------|---------|--------|
| Southern Lawns LLC | misslousouthernlawns@gmail.com | ~2026-05 | Awaiting $67 |
| Bloomsbury Larder | lesliestamp@outlook.com | ~2026-05 | No response |
| TDF Tree Service | tdftreeservice@yahoo.com | ~2026-05 | No response |
| EmberShield Chimney | embershieldchimney@gmail.com | ~2026-05 | No response |
| Robert Hill Lawn Services | roberthill39120@gmail.com | 2026-06-03 | Awaiting |
| Casey's Cleaning Co. | caseylynn2003@icloud.com | 2026-06-03 | Awaiting |
| Miss-Lou Magnolia Maids | brittanymorace@gmail.com | 2026-06-04 | Awaiting |
| J.E. Remodeling | woodcutter365@gmail.com | 2026-06-04 | Awaiting |
| The Natchez Printing Co. | print@natchezprinting.com | 2026-06-04 | Awaiting |
| Sew Sew Great Alterations | gabi_gabs03@yahoo.com | 2026-06-06 | Awaiting |
| Jason's Body Shop | jasonsbodyshop@bellsouth.net | 2026-06-06 | Awaiting |
| Woods Security & Investigations | woodscsecurity@bellsouth.net | 2026-06-06 | Awaiting |
| S&T Discount Tire & Supply | sandttirenatchez@gmail.com | 2026-06-11 | Awaiting |
| Heard Appliance Repair | heardappliancerepair@gmail.com | 2026-06-11 | Awaiting |
- Cuando alguien pague $67 → avisar a Claude → comprar dominio + arrancar build

### [ ] Facebook DMs — 4 negocios sin email
- Soul & Stem Flowers: facebook.com/p/Soul-Stem-Flowers-Gifts-61576852622321
- Sherri's Floral Designs: facebook.com/p/Sherris-Floral-Designs-and-More-100057530135684
- Rebel Barber Shop: facebook.com/profile.php?id=146094518747707
- The Donut Shop: facebook.com/p/The-Donut-Shop-100063503743228
- Estrategia: enviar mockup como imágenes directo en Messenger (Claude construye mockup primero)

### [ ] KREA AI — recargar balance
- Ir a krea.ai → API balance → top-up
- Key ya guardada en ~/.claude_env.sh como KREA_API_KEY
- Cuando esté listo: Claude genera imágenes AI para los mockups

### [ ] GSC — próxima revisión: 2026-07-06
- Ver si guides/artículos subieron en rankings
- Reportar a Claude para ajustar estrategia

---

## PRIORITY 1 — Revenue / Critical

### [ ] Stripe keys en Vercel — HOLD (no necesario aún)
- Payment links funcionan standalone sin integración en app
- Activar cuando se construya checkout de premium listings

---

## PRIORITY 2 — Monitoring & Infra

### [x] UptimeRobot — YA CONFIGURADO
- www.missloulocal.com → UP
- www.missloulocal.com/api/healthcheck → UP

---

## PRIORITY 3 — SEO Content

### [ ] Artículos automáticos — pipeline activo
- Publicados: 5 (Natchez Trace, Antebellum, Ghost Tours, Moving to Natchez, Natchez Pilgrimage)
- Cron VPS: cada viernes 8am → Groq genera → GitHub → Vercel auto-deploy
- 47 artículos pendientes en queue

---

## COMPLETED (archive)
- [x] Admin panel security overhaul (2026-05-23)
- [x] Cloudflare TLS 1.2 + always_use_https — all 16 domains
- [x] RLS anon INSERT policy, slug trigger, claim modal, VAPID, healthcheck cron
- [x] Dynamic business counter, sitemap.xml, robots.txt, SSR fixes
- [x] 17 guide pages, BreadcrumbList 1,023+ páginas, Category→Guide linking
- [x] Article system infrastructure + 5 artículos publicados
- [x] UptimeRobot — missloulocal ya monitoreado (sesión 2026-06-06)
- [x] VERCEL_TOKEN, STRIPE_PUBLISHABLE_KEY, UPTIMEROBOT_API_KEY → ~/.claude_env.sh
- [x] KREA_API_KEY → ~/.claude_env.sh (2026-06-11)
- [x] S&T Discount Tire & Supply — agregado a Supabase + email enviado (2026-06-11)
- [x] Heard Appliance Repair — email + SMS enviados, mockup mobile construido (2026-06-11)
- [x] FB Autopost — resuelto y EN VIVO (2026-08-02): template fijo SVG aprobado (IA-photo rechazada 2x), cron viernes + backfill 4x/día corriendo, post de prueba borrado
