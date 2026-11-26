# MY GARB frontend

Phase 2 authentication and workspace shells for the migration from the supplied design-component export to React, TypeScript and Bootstrap 5. The root page is an explicitly labeled development preview. Supported authentication uses the real 0.7.0 backend. Marketplace workflows remain for later phases.

## Run locally

Use Node.js 22.12+ (a supported LTS is recommended) and npm. The foundation is validated on the available Node version recorded in `docs/TESTING.md`.

```sh
npm ci
npm run dev
```

On Windows use `npm.cmd run dev` and open http://localhost:5173. Set `VITE_API_BASE_URL=http://localhost:5000/api` in ignored `.env.local` for the approved local backend (configured in this workspace). Restart Vite after environment changes. The backend must allow this exact frontend origin and credentials. Vite environment variables are public; never put credentials in them. The root preview still works without API configuration; authentication reports failure when unconfigured.

## Quality checks

```sh
npm run typecheck
npm run lint
npm run format:check
npm run test:run
npm run test:coverage
npm run build
npm run check:dist
npx playwright install chromium
npm run test:e2e
```

Playwright builds and serves the production application itself. For a manual production preview use `npm run build` followed by `npm run preview`.

## Source preservation

The original `.dc.html` files, `support.js`, `images/`, `uploads/`, `.thumbnail`, and `AGENTS.md` remain untouched. The production build starts at `index.html`; `publicDir` is disabled. Formatting and linting exclude the supplied export. Do not point a production web server at the repository root: publish only `dist/` with SPA fallback to `index.html`.

See [architecture](docs/ARCHITECTURE.md), [audit](docs/REPOSITORY_AUDIT.md), [migration mapping](docs/MIGRATION_PROGRESS.md), [API contracts](docs/API_CONTRACTS.md), [routes](docs/ROUTES.md), [component guidelines](docs/COMPONENT_GUIDELINES.md), and [testing](docs/TESTING.md).
