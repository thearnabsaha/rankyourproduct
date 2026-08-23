# rankyourproduct.lol

Public product table. Drop in a URL, pay a whole-dollar amount from $1, and that number is your row.

## Local

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

`DODO_MOCK=1` (default) lets Pay write a listing without Dodo keys. For real checkout set `DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_WEBHOOK_KEY`, and `DODO_PAYMENTS_PRODUCT_ID` (a $1 USD product; quantity = bid dollars). Webhook URL: `/api/webhook`.

Footer and About use `NEXT_PUBLIC_X_HANDLE` (`thearnabsaha`) and `NEXT_PUBLIC_CONTACT_EMAIL` (`hparnab0@gmail.com`).

Hardcoded top listings live in `src/data/backdoor-listings.ts`. Edit that file to pin a URL at #1 (or #2, #3, …) without paying. Refresh the homepage, or hit `/api/admin/backdoor?secret=...`.

## PWA

Installable on phone and desktop (Chrome / Edge / Safari Add to Home Screen). Manifest is at `/manifest.webmanifest`; the service worker is `/sw.js`. Localhost and HTTPS both qualify.

## Stack

Next.js 16, Tailwind v4, Prisma, SQLite locally / Postgres on Vercel, official `dodopayments` SDK + `@dodopayments/nextjs` webhooks.
