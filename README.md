# mom-photography

Photography portfolio with an admin area for uploading, arranging and publishing photos.

TanStack Start + shadcn/Tailwind v4, deployed to Vercel.

## Local setup

Local services use the 4xxxx port range so they do not collide with other projects.

1. `pnpm install`
2. Copy the env examples and fill them in:
   - `cp docker/.env.example docker/.env`
   - `cp .env.example .env`
3. `pnpm db:up` — Postgres on 45432, Mailpit on 41025 (inbox at http://localhost:48025), and an S3 mock on 49090 that stands in for R2
4. `pnpm db:migrate` — apply the migrations in `drizzle/`
5. `pnpm dev` — starts the containers, then runs docker logs and the app (http://localhost:43000) side by side in a detached `mom-photography` tmux session. Attach with `tmux attach -t '=mom-photography:'`
6. `pnpm down` — stops the app, the containers and the session (`pnpm down -- --purge` also wipes the database)

`pnpm dev:web` runs only the app, without tmux.

## Admin

`/admin` signs in with a 6-digit code sent by email. Only the addresses in `ADMIN_EMAILS` get a code; other addresses see the same screen but get no email. Locally, the codes land in Mailpit.

After a schema change in `src/db`, run `pnpm db:generate` to write a migration, then `pnpm db:migrate`. `pnpm db:studio` opens Drizzle Studio.

## Deploy

Vercel builds the app with Nitro, which picks the Vercel preset on its own. Import the GitHub repository in Vercel and set the variables from `.env.example` (for `DATABASE_URL`, use the Neon **pooled** connection string; for `SMTP_*`, use a real sender such as Resend or Postmark); every push to `main` deploys to production and every PR gets a preview.

## Photo storage (Cloudflare R2)

Locally, photos go to the S3 mock ([adobe/s3mock](https://github.com/adobe/S3Mock)) and are kept in `docker/.local/s3-data`. The mock allows CORS from any origin and does no resizing, so `.env.example` turns transformations off with `VITE_IMAGE_TRANSFORMS=false`. Production needs the real R2 values and `VITE_IMAGE_TRANSFORMS=true`.

The browser uploads photos straight to R2 through a presigned URL, so the R2 bucket needs a CORS rule (R2 > bucket > Settings > CORS policy):

```json
[
  {
    "AllowedOrigins": ["http://localhost:43000", "https://<your-domain>"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

Photos are shown through [Cloudflare Image Transformations](https://developers.cloudflare.com/images/transform-images/), which make each size on demand from the one original:

1. Connect a custom domain to the bucket (bucket > Settings > Custom Domains), for example `images.<your-domain>`. The domain must be in a Cloudflare zone.
2. Turn on transformations for that zone (Images > Transformations).
3. Set `VITE_IMAGES_URL` to `https://images.<your-domain>` and `VITE_IMAGE_TRANSFORMS` to `true`.
