# PENDING BY GEORGE — MissLouLocal Digital Directory
> Actions that require George manually. Claude cannot do these.

---

## PRIORITY 1 — Revenue / Critical

### [ ] Configure Stripe keys in .env.local + Vercel
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → currently placeholder
- `STRIPE_SECRET_KEY` → currently placeholder
- `STRIPE_WEBHOOK_SECRET` → currently placeholder
- Also set in Vercel dashboard environment variables

---

## PRIORITY 2 — Monitoring & Infra

### [ ] UptimeRobot setup for missloulocal.com
- Create free monitor at uptimerobot.com
- Monitor URL: https://missloulocal.com
- Alert email: gsmith0572@gmail.com
- Check interval: 5 minutes

---

## PRIORITY 3 — Features (Claude builds, George approves)

### [ ] Dynamic business counter
- Connect hero counter to Supabase `/api/businesses/count` (route exists)
- Replace hardcoded "871+" with live DB count

### [ ] Reviews & Ratings system
- Priority 2 on roadmap
- Schema consideration: `reviews` table already in types.ts

---

## COMPLETED (archive)
- [x] RLS anon INSERT policy on businesses table
- [x] Slug auto-generation trigger
- [x] Claim modal functionality restored after git clone loss
- [x] VAPID push notification keys configured
- [x] Healthcheck cron (Vercel, daily 8am)

---
