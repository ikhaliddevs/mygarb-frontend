# Architecture

## Scope and status

Phase 0 audited the design export. Phase 1 establishes the toolchain, typed store, providers, API boundary, theme and test infrastructure. Phase 2 implements supported authentication and independent application shells. The preview is not a migrated Discover screen or a live marketplace.

## Dependency direction

`app` composes providers and routes. Application pages compose their own features. Features consume domain types, shared UI and the centralized API. Shared UI must not import application features. API transport must not import the store or a page, avoiding store/API cycles.

Phase 1 foundation directories (retained):

```text
src/app/                         store, reducer, hooks, router, providers
src/apps/storefront/pages/       honest development preview
src/services/api/                base API and guarded transport
src/shared/config/               environment validation
src/shared/components/feedback/  route errors and not-found recovery
src/styles/                      tokens and Bootstrap customization
src/test/                        component-test setup
tests/e2e/                       production smoke and responsive checks
scripts/                        production artifact boundary check
```

Phase 2 adds `apps/designer` and `apps/admin` with independent layouts, navigation, overview pages and routes, plus storefront account routes, `features/auth`, shared form fields and a presentation-only workspace shell. Feature modules for operational workflows remain for later phases. Do not create empty feature folders. Shared cross-role features can live in `features/auth`, `features/messaging` and `features/notifications`. Pure lifecycle, measurement and agreement types/helpers belong in `domain/` when implemented. Business-specific cards belong in storefront components, not generic UI.

## State

RTK Query owns server data and caching. The store uses the API reducer and middleware, with typed dispatch/selector hooks. Each provider instance installs and cleans up focus/reconnect listeners. Tests can create isolated stores. No ordinary slice is added without genuine client state.

Use URL parameters for discovery filters; React Hook Form/Zod for forms; local state for dialogs and galleries. Private draft persistence requires an explicit contract. Never persist authentication tokens or private measurements through a generic persistence library. Login and logout clear RTK Query state; no tokens or passwords are persisted by the application.

## API boundary

One base API is ready for endpoint injection, with domain tags. Authentication endpoints use the live 0.7.0 contract; other feature endpoints are deferred. Missing/invalid configuration returns a typed RTK Query error without network access. The transport accepts relative endpoint paths within the configured base. It returns HTTP/network failures without falling back to fixtures.

Authentication uses HttpOnly cookies, credentialed requests and the documented security header. See API_CONTRACTS.md. The root preview still makes no API call.

## Routing and styling

React Router lazy-loads the preview and not-found screen. A route error boundary avoids exposing internal error details. Role workspace routes now sit behind live session guards. Production hosting must serve `dist/index.html` for application navigation.

Bootstrap 5 is the primary CSS foundation. Sass overrides establish the supplied forest/ivory/champagne identity. Fonts are bundled locally through Fontsource; no Google Fonts network dependency is needed. Bootstrap Icons are available locally. Individual Bootstrap JavaScript plugins will be initialized/disposed through React-owned adapters when modal, dropdown or offcanvas components are needed; importing global DOM behavior before there are interactive components is unnecessary.

## Production separation

`publicDir: false` prevents accidental copying of source uploads. Only imported assets enter the bundle. Original images stay in place until a feature needs them; then preserve or copy their descriptive names into `src/assets/images`. Development fixtures must never be imported by production features. `check:dist` checks for reference files and known legacy markers; it is a regression check, not an exhaustive security scanner.

No Git repository, branch or commit was created. No backend was added. No website was deployed.
