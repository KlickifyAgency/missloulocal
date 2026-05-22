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

---
