# mom-photography

Photography portfolio. One TanStack Start app (deployed to Vercel) with a public gallery and an `/admin` area for one photographer to upload, arrange and publish photos. Postgres on Neon through Drizzle, images in Cloudflare R2, resized by Cloudflare Image Transformations.

## General

- Do not execute `cd` commands into your current working directory

## Writing code

- Read `STYLE.md` and follow the guidelines therein
- Follow DRY (Don't Repeat Yourself) principles: avoid duplicating logic, extract reusable abstractions, and prefer referencing existing code over copying it
- Prettier runs on commit via husky + lint-staged. To format sooner, run `pnpm format`
- Prefer node built-ins to 3rd-party libraries (e.g. `fetch` not `axios`, `crypto.randomUUID()` not `uuid`)
- Anything crossing the server↔client boundary — server function input, enums, response types — is a zod schema with its inferred type exported alongside it
- Import with the `@/*` alias. Never reach up more than one directory with a relative path
- Avoid flattened type unions discriminated at runtime vs algebraic type unions discriminated at type-check time; e.g.:
  DO:
  type Thing = { type: "left", x: number } | { type: "right", y: string }
  AVOID:
  type Thing = { x?: number, y?: string }

  On the wire this means `z.discriminatedUnion`.

## Frontend styling

Prefer `className` over the `style` prop for frontend styling whenever possible.

In app code, import UI components from `@/components/ui` — never `@base-ui/react` directly. Those belong inside `components/ui` wrappers, which carry the shared variants and theming. If a component isn't there yet, add it (`pnpm dlx shadcn@latest add <name>`) rather than styling a raw primitive at the call site.

## Verification

Never start a dev server (`pnpm dev`, `vite dev`/`preview`, `docker compose up`, etc.) or use the `run` skill — the user runs these manually. For verification, only use the scripts already defined in package.json (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check`).

## Tests

Add tests when it makes sense and they provide real value — not for the sake of coverage. Don't add tests for trivial code or scenarios that can't happen.

## Database migrations

Never run database migrations yourself. If a schema change requires a migration, generate it with `pnpm db:generate`, then tell the user and let them run `pnpm db:migrate` manually.
