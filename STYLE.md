# Style Guide

## Coding Principles

**Don't future-proof.** Build only what's needed for near-term goals. "Build assuming your code will be deleted in six months." Still build for reliability and quality — just don't develop toward unscheduled future use cases.

**Reuse code.** When 2+ things use the same logic, create an abstraction.

**Avoid unnecessary abstractions.** Don't abstract until 2+ things reuse the code. When that point arrives, don't copy-paste — create an abstraction instead.

**Prefer built-ins, then libraries.** Reach for the platform first (`fetch`, `crypto.randomUUID`, `Intl`). For common infrastructural work with no built-in — retries with backoff, date math, collection manipulation — use a well-established library rather than hand-rolling. Only write it yourself when nothing suitable exists, and unit-test it when you do.

**Avoid mutable state.** Utility methods that change state should return a copy with modified properties. Prefer:

- `filter`/`map` over `for` loops with `push`
- Spread (`[...a, ...b]`, `{...a, ...b}`) over clone + mutate
- Early returns over `let data; try { data = ... }` patterns

**Functions, not classes.** React components are `function` declarations (`function Button(...)`, `export default function Home()`); everything else is a `const` arrow function. Classes come from SDKs only — construct them once as a module-level singleton in a `lib/` directory and export the configured instance rather than constructing at call sites.

| Use case          | Solution                           |
| ----------------- | ---------------------------------- |
| Data              | Plain objects / zod-inferred types |
| Configured client | Module-level singleton in `lib/`   |
| Behavior          | Arrow function                     |
| React component   | `function` declaration             |

**Use named arguments past 4 positional parameters, or for repeated types.** Once a function's argument list would run over 4 positional parameters, or whenever it takes multiple arguments of the same type (e.g. two `string` arguments), group the trailing arguments into a single destructured options object instead. This avoids call-site ambiguity between same-typed positional args and keeps call sites self-documenting.

```ts
// Avoid: which string is which at the call site?
const buildImageUrl = (key, width, format) => { ... };
buildImageUrl(key, 800, "webp");

// Prefer:
const buildImageUrl = ({ key, width, format }: { ... }) => { ... };
buildImageUrl({ key, width: 800, format: "webp" });
```

**Avoid type-narrowing casts.**
Use (in order of preference):

- Zod schema validation — the repo already depends on zod everywhere
- Type guards returning `v is T`
- Type inference with the `ts-expect-error` directive (e.g. `// @ts-expect-error <reason>`)

**Testing.** Happy path for deep functionality; complete unit tests for modular functionality. Pure, branchy logic is the target. Don't test thin wrappers over a client library, a Drizzle query, or a JSX tree with no logic in it. Tests use vitest and sit beside the file they test.

## Frontend UI components

**Use the local component library.** In app code, import UI components from `@/components/ui` — never `@base-ui/react` directly. The wrappers carry the shared `cva` variants and theme tokens and give us one place to change styling globally.

**Style with `className`, not `style`.** Reserve the `style` prop for the handful of things Tailwind can't express.

**Variants over one-off classes.** When a component needs a new visual treatment, add a `cva` variant to the component in `components/ui` rather than passing a pile of classes at the call site.

## Structure

Group by feature. `src/routes` holds routes only — a route file wires up the loader, `head` and guards, then renders a screen from `src/features/<feature>/screens`. Each feature keeps its `components/`, `hooks/`, `lib/` and `server/` beside its screens; nest a sub-feature under its parent (`features/admin/galleries`). A file moves to `src/components`, `src/hooks` or `src/lib` only when two or more features use it.

**Server code.** Server functions live in the feature's `server/` directory. Tables and relations live in `src/db`. Configured SDK clients are module-level singletons in a `lib/` directory — the feature's own when one feature uses the client, `src/lib` when several do.

**File names are kebab-case**, matching the exported symbol (`photo-grid.tsx` → `PhotoGrid`, `use-upload-photos.ts` → `useUploadPhotos`).

## Patterns

**Selectively mapping a collection.** Define a type-guard predicate, then chain `filter` + `map`.

```ts
const isPublished = (g: Gallery): g is PublishedGallery => g.publishedAt !== null;
galleries.filter(isPublished).map((gallery) => ...);
```

**Branching on a union.** Put the behaviour in a dispatch table keyed by the union value — one implementation per member, and a `Record<Union, Impl>` registry that the call sites index. The registry is total, so a new member fails at type-check time. Use a ternary or a switch only for one local two-way branch.

**Server functions.** Validate input with zod (`.inputValidator(schema)`). Admin server functions use the `adminMiddleware` so the session check runs on the RPC itself, not only on the route.

## Naming

**Prefixes:**

| Prefix   | Use                                                                            |
| -------- | ------------------------------------------------------------------------------ |
| `build`  | Assembles a value from parts; pure                                             |
| `create` | Creates a resource that didn't exist (DB row, presigned URL, client)           |
| `fetch`  | Retrieves from an external system (not caches/DBs); see `send`                 |
| `filter` | Returns all values in a collection fulfilling a predicate                      |
| `find`   | Returns first matching value or `undefined`                                    |
| `format` | Value → display string (see `render` for anything richer)                      |
| `from`   | Inverts a `to` function                                                        |
| `get`    | Reads a single value (`undefined` if missing); see `set`                       |
| `handle` | Event handler bound to a UI element (`handleSubmit`)                           |
| `has`    | Boolean ownership or collection membership                                     |
| `is`     | Boolean type check or type-guard function; return type should be `is T`        |
| `list`   | Reads a collection from a store; use `query` if selected by complex conditions |
| `parse`  | String/unknown → structured data, throwing on failure; see `render`            |
| `render` | Structured data → string/markup/email                                          |
| `send`   | Sends to an external system (not caches/DBs); see `fetch`                      |
| `set`    | Sets a value in a store; succeeds regardless of existing value                 |
| `to`     | Translates a value to another representation                                   |
| `update` | Updates an existing store value                                                |
| `use`    | React hook — required by the rules of hooks                                    |

**Suffixes:**

| Suffix     | Use                                                                         |
| ---------- | --------------------------------------------------------------------------- |
| `Client`   | Object whose properties are functions that call an API (`authClient`)       |
| `Context`  | Object whose properties are references to shared data used across functions |
| `Provider` | React context provider component                                            |
| `Schema`   | Zod schema; its inferred type is exported under the bare name               |

**Drizzle tables** are exported as PascalCase plurals (`Photos`, `Galleries`) with snake_case column names in the SQL; pg enums stay camelCase (`layoutEnum`).

**No Hungarian notation.** Don't suffix types with `Type` or values with their type name. VSCode already communicates symbol kinds. `Schema` above is a deliberate exception — it distinguishes the runtime validator from the type it infers. Other exceptions — use these specific shorthands only:

```ts
const listLength = list.length;    // interning array length
const objectSize = object.size;    // interning object size
for (let iArray = 0; ...) { ... }  // array index variable
```

## Comments

- Write no comment by default. Comment only what the code cannot show: a constraint, an upstream bug, a necessary order, a unit, or a deliberate deviation.
- Write comments in ASD-STE100 (Simplified Technical English). Prefer simple verbs: use, make, get, put, remove, start, stop, keep, find, send.
- A doc block (`/** ... */`) tells the caller how to use the symbol. Write none when the name and signature are clear.
- Do not add banners, dividers or changelogs, and do not describe your change — the diff shows it.

## Textual Style

Prettier owns formatting (defaults, no config) and runs on commit — don't hand-format around it. The rules below cover what Prettier leaves to you.

**Destructuring.** Destructure on a single line when extracting from objects/tuples. Use multiple destructuring statements when unnesting would create a multi-line statement. Always destructure tuples; inline field access is OK for objects accessed only a couple of times.

```ts
const [photo] = await db.insert(Photos).values({ ... }).returning();
const { width, height } = photo;
```

**Single-line when it fits.** Remove newlines after opening `{`/`[` so Prettier can collapse object/array literals onto one line. Omit braces on single-line `if`; use braces if the body doesn't fit on one line.

```ts
const obj = { x: 1, y: "a" };
if (!key) return;
```

**Newlines between functions.** Separate functions with a blank line. Exception: a closure variable may be grouped with its closure (no blank line between them).

**Sort object properties.** Sort properties in objects when doing so would not change the resulting value. Do not reorder across spread operations.
