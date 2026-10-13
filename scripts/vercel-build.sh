#!/bin/sh
# Vercel runs this instead of `build`. Migrate first, so a deploy goes live only after its migrations.
set -e

if [ "$VERCEL_ENV" = "production" ]; then
  pnpm db:migrate
fi

pnpm build
