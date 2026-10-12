# mom-photography

Photography portfolio with an admin area for uploading, arranging and publishing photos.

TanStack Start + shadcn/Tailwind v4, deployed to Vercel.

## Local setup

1. `pnpm install`
2. Copy the env examples and fill them in:
   - `cp docker/.env.example docker/.env`
   - `cp .env.example .env`
3. `pnpm db:up` — Postgres on 5432, Mailpit on 1025 (inbox at http://localhost:8025)
4. `pnpm db:migrate` — apply the migrations in `drizzle/`
5. `pnpm dev` — the app runs on http://localhost:3000

## Admin

`/admin` signs in with a 6-digit code sent by email. Only the addresses in `ADMIN_EMAILS` get a code; other addresses see the same screen but get no email. Locally, the codes land in Mailpit.

After a schema change in `src/db`, run `pnpm db:generate` to write a migration, then `pnpm db:migrate`. `pnpm db:studio` opens Drizzle Studio.

## Deploy

Vercel builds the app with Nitro, which picks the Vercel preset on its own. Import the GitHub repository in Vercel and set the variables from `.env.example` (for `DATABASE_URL`, use the Neon **pooled** connection string; for `SMTP_*`, use a real sender such as Resend or Postmark); every push to `main` deploys to production and every PR gets a preview.
