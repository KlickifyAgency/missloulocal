# GOLDEN RULES — MissLouLocal Digital Directory
> Non-negotiable. Every session. No exceptions.

---

## GIT
- **NEVER** `git push --force` — wipes remote history, local loses all files
- Always `git pull --rebase` before pushing if conflicts
- **NEVER** suggest drastic git ops (clone, reset --hard) without exhaustive step-by-step diagnosis first

## FILE WRITING (Mac zsh)
- **NEVER** `cat > file << 'EOF'` for TSX/JSX/JSON — corrupts JSX (especially `>` in tags), can rename files (e.g., `package.json` → `package`)
- Always `node -e` with `fs.writeFileSync()` for React/TSX files
- **Never** regex to modify metadata blocks in `layout.tsx` — always rewrite the full file
- **Paths with `[slug]`**: zsh interprets brackets as glob patterns. Assign to variable inside `node -e` string: `const filePath = 'src/app/category/[slug]/page.tsx'` — never pass bracket paths in shell command directly

## SUPABASE
- `ERROR: 42501` → missing INSERT policy
- `ERROR: 23502` on slug → no default/trigger. Use `SET ROLE anon` before test INSERTs
- `BEFORE INSERT OR UPDATE` trigger scoped with `WHEN (NEW.slug IS NULL OR NEW.slug = '')` avoids overwriting intentionally set slugs
- Vercel Next.js 14+ Server Components with Supabase need `cache: 'no-store'` and `auth.persistSession: false`; verify RLS with `SET ROLE anon; SELECT` test

## VPS
- VPS is for crons and scrapers ONLY — not image hosting
- `/opt/trulyfreeqr` — DO NOT TOUCH (unrelated project)
- Bradley binary: `/home/openclaw/.npm-global/bin/openclaw` — must launch with `gateway` command, not `start`
- Nightly sync: `source=littleeasytours` events must NOT be auto-inserted (causes duplicates)

## CONTENT / BUSINESS LOGIC
- "Getting listed is free, always" — never use "always free" language (future monetization planned)
- Never publish false statistics; real achievements framed positively but honestly
- George refuses exaggerated claims

## WORKFLOW
- Three-terminal workflow: V1 local Mac | V2 `npm run dev` (localhost:3000) | V3 SSH into VPS
- Always specify which terminal for each command
- CLI only — never ask George to edit files manually or use interactive editors
- React/modal pattern: `e.stopPropagation()` on inner div AND `type='button'` on all non-submit buttons inside modals

## ICONS
- Lucide React only — no emojis anywhere in the app; replace all with SVG/Lucide icons

## ATM PROTOCOL
- When George writes "ATM" → update memory with lessons learned from recent mistakes

## PHOTOS — SUPABASE STORAGE
- **NUNCA** guardar Google Places `photo_reference` URLs en DB — expiran en días/semanas
- Siempre descargar la imagen y subir a Supabase Storage bucket `business-photos` path `listings/`
- URL permanente: `https://dqdlmquperjqbrplkeco.supabase.co/storage/v1/object/public/business-photos/listings/...`
- Google Cloud billing cancelado → Places API completamente inaccesible

## ICLOUD DESKTOP (Mac)
- Desktop de Mac vive en iCloud: `/Users/mbp_alfa_01/Library/Mobile Documents/com~apple~CloudDocs/Desktop/`
- Bash tool NO puede leer `/Users/mbp_alfa_01/Desktop/` (sandbox) — copiar de iCloud path
- Filenames de screenshots tienen U+202F (Narrow No-Break Space) antes de AM/PM → usar glob: `Screenshot\ 2026-06-25\ at\ 9.32*AM.png`

## MULTI-CATEGORY (businesses)
- Column `secondary_category_ids uuid[]` en tabla businesses (agregado 2026-06-25)
- Query en category page: `.or('category_id.eq.X,secondary_category_ids.cs.{X}')`
- Para asignar categorías secundarias: PATCH `secondary_category_ids` array con IDs de `categories` table
- DDL changes → siempre pedir a George que corra SQL en Supabase dashboard SQL Editor

## DEPLOY FLOW (código)
- GitHub API PUT → rama main de KlickifyAgency/missloulocal
- Vercel deploy hook: `POST https://api.vercel.com/v1/integrations/deploy/prj_rK680Njb6tB4b8d2KMWRG8VOy2jM/NBpT7o7L2B`
- SIEMPRE triggear el hook después del push — Vercel no auto-detecta GitHub en este proyecto

## FEATURED BUSINESSES (home page)
- Deduplicar por NAME, no por slug (misma empresa puede tener slugs diferentes en distintas categorías)
- Solo renderiza si hay premium listings activos
- Badge "★ Premium" va en cada CARD (esquina sup. derecha), NO en el título de la sección

## FB AUTOPOST
- Imagen de post: template fijo SVG (gradiente + wave, sin foto AI) en `mll_fb_image.js` en VPS — George rechazó generación de foto por IA 2 veces (Pollinations blurry, CF Workers AI FLUX incoherente con el título). **No reintroducir foto-IA sin aprobación explícita.**
- Ver detalle completo: memory `project_fb_autopost.md`

## MOSTRAR IMÁGENES A GEORGE
- El visor de chat de George NO renderiza imágenes remotas de forma confiable (ni inline, ni Artifact gallery, ni link pegado en el chat) — terminó viéndolas recién al abrir la URL pública directo en Chrome
- Cuando haya que mostrar una imagen: dar la URL pública y decir explícitamente "abrí esto en Chrome", no asumir que se ve en el chat

---

## LLM MODELS (VPS) — NUNCA HARDCODEAR
- **NUNCA** escribir un model id literal en un script de VPS. Groq retiró
  `llama-3.3-70b-versatile` el 2026-08-16 y 5 crons murieron en silencio semanas
- Editar SOLO `/etc/llm_models.json` (candidatos rankeados por rol: `groq_large`, `groq_small`)
- Scripts leen `/etc/llm_models.resolved.json` vía `_resolved_model(role, fallback)` (Python)
  / `resolvedModel(role, fallback)` (Node). El fallback = comportamiento actual si falta el archivo
- `/usr/local/bin/llm_model_guard.py` corre `0 7 * * *` — resuelve roles contra la lista viva
  de Groq y avisa si un pin murió. Corre 1h antes del cron de artículos
- `openai/gpt-oss-20b` es MUY débil para long-form (588 palabras/1 sección vs 1413/4 en `120b`)
- **NUNCA** re-agregar `ANTHROPIC_API_KEY` ni llamadas a la API de Anthropic — pagamos Claude Pro

## MONITOREO / ALERTAS
- El timeout del cliente SIEMPRE debe superar el peor caso del endpoint. `healthcheck.js` usa
  25s porque `route.ts` puede tardar 18s (6 sub-checks × 8s + retry de 2s)
- Nunca alertar con 1 sola muestra fallida: retries + umbral de N corridas consecutivas + cooldown
- **NUNCA testear un path de alertas contra el inbox real.** Usar `GUARD_NO_EMAIL=1` en el guard,
  o una Resend key inválida a propósito en `healthcheck.js` / `generate-article.js`
- Un guard que puede fallar en silencio es peor que no tener guard. Si un scan devuelve 0
  resultados donde siempre hay varios, eso es SCANNER BROKEN, no "todo limpio"
- `grep -E` NO entiende `(?:` — errorea y devuelve 0 hits. Usar Python puro para scans

## CADENCIA DE CRONS
- La cadencia vive en el SCRIPT (gate de días desde `last_published`), no en el crontab.
  Cron diario + gate de 7 días > cron semanal: un fallo reintenta mañana, no la semana que viene
- Todo cron que publique/genere contenido debe mandar email en su path de FATAL
