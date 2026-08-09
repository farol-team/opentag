# OpenTag SaaS (`app/`) — control plane

The dashboard and the system of record: workspaces, members, runners, channels,
Slack installations (bot tokens), issued runner tokens, and the activity log of
every turn. The data plane in [`cloud/`](../cloud/README.md) keeps nothing
durable — it asks this service, over tRPC with an `x-internal-secret` header.

React 19 + Vite on the front, Hono + tRPC on the back, PostgreSQL via Drizzle,
sign-in through Slack (OIDC).

## Running it

```bash
cp .env.example .env      # DATABASE_URL, Slack app credentials, INTERNAL_API_SECRET
npm install
npm run dev               # Vite + Hono on :3000
```

| Command | What it does |
|---|---|
| `npm run check` | `tsc -b` — type check (this and `lint` are the pre-submit pair) |
| `npm run lint` | eslint |
| `npm run format` | prettier |
| `npm test` | vitest (`api/**/*.test.ts` / `*.spec.ts`) |
| `npm run build` | vite build + esbuild `api/boot.ts` → `dist/boot.js` |
| `npm start` | production server from `dist/` |
| `npm run db:generate` / `db:migrate` / `db:push` | drizzle-kit (needs `DATABASE_URL`) |

Deploying is [`docs/deploy.md`](../docs/deploy.md).

## Layout

```
api/                 server
├── boot.ts          Hono entry
├── router.ts        root tRPC router: auth, workspace, runner, memory, billing, slack
├── saas-router.ts   domain logic
├── middleware.ts    publicQuery / authedQuery
├── slack-oauth.ts   "Add to Slack" (OAuth v2) + the scopes the manifest must match
├── runner-connect.ts browser handoff: a runner asks, a human approves here
├── identity/        Slack OIDC sign-in, sessions
├── queries/         DB access
└── lib/             env, cookies, vite integration
contracts/           types shared with the frontend
db/                  schema.ts, relations.ts, migrations/
src/                 frontend: pages/, components/ui (shadcn), hooks/, providers/
```

Path aliases: `@/* → src/*`, `@contracts/* → contracts/*`, `@db/* → db/*`.

Conventions and the wider architecture live in [`AGENTS.md`](../AGENTS.md).
