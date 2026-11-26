# CODEX MASTER ENGINEERING PROMPT
## MY GARB — Migration from Existing HTML Prototype to React, Redux Toolkit and TypeScript

### 1. YOUR ROLE

Act as a Principal Frontend Architect and Senior React/TypeScript Engineer with extensive experience building scalable, maintainable, multi-role marketplace applications.

You are responsible for architecting and implementing the MY GARB frontend using professional software engineering standards.

You must think and work like an engineer responsible for a production application, not someone simply converting HTML files into React components.

Your responsibilities include:

- Reviewing and understanding the existing application.
- Understanding the complete product requirements.
- Designing a scalable project architecture.
- Migrating the existing designs into reusable React components.
- Implementing application state management.
- Establishing API integration architecture.
- Implementing routing and role-based access boundaries.
- Writing unit, integration, and end-to-end tests.
- Maintaining responsive behaviour.
- Preserving existing visual designs and business logic.
- Documenting architectural decisions and implementation progress.

Do not sacrifice code quality, maintainability, or product requirements for implementation speed.

---

### 2. PROJECT SOURCE MATERIALS

You have access to the following source materials:

1. `mygap-frontend.zip` — the existing frontend design and prototype.
2. `MY_GARB_PRD (1).docx` — the authoritative product requirements document.
3. `prd.docx` — another copy of the MY GARB PRD.
4. Existing `.dc.html` design files.
5. Existing `support.js` runtime.
6. Existing image assets under `images/`.
7. Other supplied reference images and design documents.

Before modifying anything, inspect the entire repository and source archive.

Do not assume that the existing prototype is a conventional static HTML application.

The `.dc.html` files use a custom runtime and component interpretation mechanism. Inspect how `support.js` works and understand how the existing design files render before deciding how to migrate them.

The final React application must not depend on the existing custom runtime.

Do not embed the old HTML files in iframes as a substitute for React implementation.

Do not simply rename HTML files to JSX.

Rebuild the interfaces using proper React components, TypeScript types, state management, and application routing.

---

### 3. PRODUCT UNDERSTANDING

MY GARB is a marketplace connecting customers looking for custom Nigerian and culturally relevant occasion outfits with approved fashion designers.

The product has three distinct application areas:

A. Customer Storefront
B. Designer Workspace
C. Administration Workspace

These are separate user experiences within one frontend application.

The application should share common components, services, design tokens, authentication infrastructure, and state management where appropriate.

Each application must have its own:

- Layout.
- Navigation.
- Page components.
- Feature modules.
- Route definitions.
- Role-specific interface components.

Do not mix customer, designer, and administrator navigation.

---

### 4. TECHNOLOGY REQUIREMENTS

Use the following stack.

| Technology | Responsibility |
|---|---|
| React | UI framework |
| TypeScript | Application language |
| Vite | Development and production build |
| Redux Toolkit | Global state management |
| RTK Query | API communication and caching |
| React Router | Navigation and protected routes |
| Bootstrap 5 | Primary styling framework |
| SCSS | Theme customization and application styling |
| Bootstrap Icons | Icons |
| React Hook Form | Form management |
| Zod | Runtime form validation |
| Vitest | Unit and integration testing |
| React Testing Library | Component testing |
| Playwright | Browser and end-to-end testing |
| ESLint | Code quality |
| Prettier | Code formatting |

Use stable, compatible package versions.

Avoid introducing unnecessary libraries where existing technologies already solve the problem.

Do not use Tailwind CSS.

Do not use Material UI, Ant Design, or another competing component framework.

Bootstrap 5 must be the primary layout and styling framework.

Use Bootstrap's grid, utilities, forms, buttons, modals, offcanvas components, dropdowns, tables, and responsive helpers wherever appropriate.

Use custom SCSS for the MY GARB visual identity.

---

### 5. PROJECT ARCHITECTURE

Create a feature-oriented architecture that clearly separates the three application areas.

Use the following structure as the architectural baseline:

```text
src/
├── app/
│   ├── store.ts
│   ├── rootReducer.ts
│   ├── hooks.ts
│   ├── router.tsx
│   └── providers/
│
├── apps/
│   ├── storefront/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── features/
│   │   └── routes.tsx
│   │
│   ├── designer/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── features/
│   │   └── routes.tsx
│   │
│   └── admin/
│       ├── layouts/
│       ├── pages/
│       ├── components/
│       ├── features/
│       └── routes.tsx
│
├── features/
│   └── auth/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── authSlice.ts
│       └── types/
│
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── feedback/
│   │   └── navigation/
│   ├── hooks/
│   ├── layouts/
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── services/
│   ├── api/
│   │   ├── baseApi.ts
│   │   ├── authApi.ts
│   │   ├── designerApi.ts
│   │   ├── requestApi.ts
│   │   ├── orderApi.ts
│   │   ├── messageApi.ts
│   │   ├── notificationApi.ts
│   │   └── adminApi.ts
│   └── adapters/
│
├── styles/
│   ├── tokens.scss
│   ├── bootstrap-overrides.scss
│   ├── global.scss
│   └── components/
│
├── assets/
│   └── images/
│
├── test/
│   ├── setup.ts
│   ├── fixtures/
│   ├── mocks/
│   └── helpers/
│
├── main.tsx
└── vite-env.d.ts

tests/
└── e2e/

docs/
├── ARCHITECTURE.md
├── ROUTES.md
├── API_CONTRACTS.md
├── COMPONENT_GUIDELINES.md
├── TESTING.md
└── MIGRATION_PROGRESS.md
```

This is an architectural baseline, not an instruction to create empty directories.

Create feature folders only when they contain meaningful application code.

#### Architecture rules

1. Storefront, designer, and admin must remain logically isolated.
2. Shared components must not contain application-specific business logic.
3. Business logic belongs in the appropriate feature module.
4. API communication must be centralized.
5. Redux state must be typed.
6. Components should not make direct network requests.
7. Avoid circular dependencies.
8. Avoid oversized components.
9. Avoid duplicated business logic.
10. Use absolute imports with a consistent alias such as `@/`.
11. Use clear, consistent naming conventions.
12. Keep page components focused on composition rather than implementing every feature internally.

---

### 6. DESIGN PRESERVATION AND MIGRATION

The existing design files are the visual source of truth.

Your first priority is to reproduce the existing design accurately in React.

Do not redesign the application without a specific reason.

Preserve:

- Existing layouts.
- Typography.
- Colours.
- Spacing.
- Card designs.
- Navigation patterns.
- Buttons.
- Form structures.
- Dialogs.
- Responsive behaviour.
- Empty states.
- Error states.
- Loading states.
- Existing image placement.
- Existing visual hierarchy.

The MY GARB design system currently uses:

- Forest green: #1F4D3A
- Forest hover: #183D2E
- Deep forest: #14332A
- Ivory: #FAF6EE
- Champagne: #D9C08C
- Champagne hover: #CDB27A
- Gold ink: #7A5E22

Typography:

- Cormorant Garamond for display headings.
- DM Sans for body text, form labels, navigation, and supporting content.

Preserve these choices unless the supplied design references explicitly establish a newer approved direction.

Do not replace the visual identity with generic Bootstrap styling.

Use Bootstrap as the underlying layout and component system while recreating the MY GARB appearance through SCSS variables and component classes.

Use the existing image assets.

Preserve descriptive image filenames where practical.

Do not substitute unrelated stock photographs.

Implement appropriate image fallbacks when assets fail to load.

---

### 7. STOREFRONT IMPLEMENTATION

Create the complete customer-facing application.

Organize the features into independent modules.

#### 7.1 Discovery

Implement:

- Designer discovery page.
- Designer search.
- Specialty filtering.
- Occasion filtering.
- Garment category filtering.
- Service location filtering.
- Availability filtering.
- Applied filters.
- Reset filters.
- Empty results.
- Loading states.
- API error and retry states.
- Pagination or load-more behaviour where supported.

Only approved designers should appear in public discovery.

Location filtering must use declared designer service coverage.

Do not introduce device geolocation without product approval.

#### 7.2 Designer profiles

Implement:

- Public designer profile.
- Business information.
- Service location.
- Specializations.
- Biography.
- Availability.
- Portfolio.
- Reviews.
- Request custom outfit action.

Private customer measurements and requests must never appear on public profiles.

#### 7.3 Portfolio

Implement:

- Portfolio item listing.
- Portfolio item detail.
- Image gallery.
- Category.
- Occasion.
- Description.
- Optional estimated price.
- Designer information.
- Image fallback.

Portfolio work must not be represented as ready-made inventory.

#### 7.4 Custom requests

Implement:

- New request form.
- Category selection.
- Occasion selection.
- Outfit description.
- Reference image uploads.
- Quantity.
- Needed-by date.
- Service location.
- Measurement approach.
- Private draft state.
- Form validation.
- Submission confirmation.

Business rules:

- Quantity must be between 1 and 50.
- Needed-by date must be in the future.
- Supported image formats: JPEG, PNG, WebP.
- Maximum proposed image size: 5 MB each.
- Reference images are private to the intended designer and authorized support personnel.
- A retry must not create duplicate requests.

#### 7.5 Measurements

Implement:

- Measurement guidance.
- Category-specific measurement forms.
- CM and inch units.
- Unit conversion.
- Measurement source.
- Recorded date.
- Designer review state.
- Self-measured values.
- Designer-assisted measurements.
- Pending measurement states.

Do not simply relabel centimetres as inches.

Actual conversion must be performed.

Private measurement profiles must be protected.

#### 7.6 Requests and orders

Implement:

- Requests and Orders page.
- Request detail.
- Order detail.
- Status timelines.
- Agreed specification snapshots.
- Change requests.
- Cancellation requests.
- Handover information.
- Completion confirmation.
- Issue reporting.

Keep request states and order states separate.

Request lifecycle:

Submitted → Discussing → Awaiting Confirmation → Converted.

Alternative terminal states:

Declined and Withdrawn.

Order lifecycle:

Confirmed → In Production → Ready → Handed Over → Completed.

Cancellation must follow the documented approval process.

An open issue must prevent normal completion.

#### 7.7 Specifications

Implement:

- Specification review.
- Version comparison.
- Design description.
- Fabric responsibility.
- Measurements.
- Quantity.
- Agreed price in NGN.
- Commercial terms.
- Production dates.
- Needed-by date.
- Handover arrangements.
- Confirmation.
- Revision requests.

Critical business rule:

Only the latest submitted specification version can be confirmed.

Confirmation must create exactly one order using the accepted specification snapshot.

Old specification versions must remain available as historical records.

Messages must never silently modify agreed commercial terms.

#### 7.8 Messaging

Implement:

- Conversation listing.
- Conversation search.
- Message previews.
- Unread counts.
- Conversation detail.
- Text messaging.
- Validated reference image uploads.
- Timestamps.
- Read states.
- Retry on sending failure.
- Empty state.

Messages must be scoped to authorized participants.

Use the backend's supported communication mechanism.

Do not claim real-time WebSocket functionality unless the backend provides it.

#### 7.9 Notifications

Implement:

- Notification list.
- Read and unread states.
- Unread count.
- Notification navigation.
- Empty state.
- Loading and error states.

Notifications must not expose private measurements or sensitive information.

#### 7.10 Customer profile

Implement:

- Customer account.
- Personal details.
- Contact preference.
- Private measurements.
- Measurement editing.
- Password management.
- Logout.

#### 7.11 Reviews

Implement:

- Five-star rating.
- Optional written review.
- Review submission.
- Existing review state.
- Validation.
- Success and error feedback.

Only the customer associated with an eligible completed order may submit one review.

---

### 8. DESIGNER WORKSPACE

Create a separate designer application under `apps/designer`.

Implement its own layout, navigation, pages, and feature modules.

#### 8.1 Designer dashboard

Include:

- Welcome section.
- Profile approval status.
- Profile completion requirements.
- New requests.
- Requests requiring attention.
- Active orders.
- Production status.
- Relevant notifications.

#### 8.2 Designer profile management

Implement:

- Business name.
- Service location.
- Specializations.
- Bio.
- Availability.
- Profile completeness.
- Submit for approval.
- Approval status.

Only approved designers should be publicly discoverable.

Suspended designers must not receive new requests.

#### 8.3 Portfolio editor

Implement:

- Portfolio list.
- Add portfolio item.
- Edit portfolio item.
- Image upload.
- Image ordering.
- Cover image.
- Category.
- Occasion.
- Description.
- Optional price estimate.
- Visibility controls.
- Validation.
- Empty and error states.

A designer must only manage their own portfolio items.

#### 8.4 Request management

Implement:

- Incoming requests.
- Request detail.
- Customer-provided information.
- Reference images.
- Measurements.
- Accept for discussion.
- Ask clarification.
- Decline with reason.
- Withdraw where permitted.

#### 8.5 Specification builder

Implement:

- Specification draft.
- Design description.
- Material and fabric responsibility.
- Measurement review.
- Quantity.
- Agreed price.
- Commercial terms.
- Ready date.
- Needed-by date.
- Handover arrangements.
- Validation.
- Submit new version.

A submitted specification version becomes immutable.

Changes require a new version.

#### 8.6 Production and orders

Implement:

- Order list.
- Order detail.
- Specification snapshot.
- Production status.
- Start production.
- Mark ready.
- Record handover.
- Change request.
- Cancellation request.
- Issue visibility.

Follow the exact documented lifecycle.

#### 8.7 Designer profile settings

Implement account details, security settings, and relevant business information.

Do not implement a full payment wallet, payout execution, inventory system, or automated courier management as part of this MVP.

---

### 9. ADMINISTRATION WORKSPACE

Create an independent admin application under `apps/admin`.

Administration must have separate routes and navigation.

Administrator access must never be offered as a public registration option.

Implement:

#### 9.1 Admin dashboard

Show:

- Designer approval queue.
- Pending applications.
- Active designers.
- Open issues.
- Recent administrative activity.
- Operational summaries where supported.

#### 9.2 Designer approvals

Implement:

- Pending applications.
- Application detail.
- Portfolio review.
- Business information.
- Approval.
- Rejection with reason.
- Suspension.
- Status history.

Approval must not imply formal identity or quality certification beyond the pilot's actual process.

#### 9.3 Issue management

Implement:

- Issue listing.
- Issue detail.
- Issue categories.
- Reported descriptions.
- Supporting evidence.
- Assignment.
- Internal notes.
- Review status.
- Resolution outcome.
- Resolution summary.
- Audit history.

Issue lifecycle:

Open → Under Review → Resolved.

The issue resolution process must follow the PRD.

An open issue must prevent automatic order completion.

#### 9.4 Reviews moderation

Implement the relevant review reporting and moderation interface.

Record moderation reasons and actions.

Never alter customer ratings or fabricate reviews.

#### 9.5 Administrative access

Protect all admin pages.

Enforce authorization at the route and API layers.

Do not rely on hiding navigation links as the only security measure.

---

### 10. AUTHENTICATION AND ROLE MANAGEMENT

Implement a centralized authentication feature.

Supported roles:

- CUSTOMER
- DESIGNER
- ADMIN

Registration must support customers and designers.

Administrators cannot register themselves through the public interface.

Implement:

- Registration.
- Login.
- Logout.
- Email verification.
- Password recovery.
- Session restoration.
- Protected routes.
- Role-aware navigation.
- Access-denied screen.
- Session-expired handling.

Important:

Frontend role checks are for user experience, not a replacement for backend authorization.

The backend must remain the authority for user identity and permissions.

Never hardcode a user as an administrator in production.

Never store authentication credentials or tokens insecurely.

Use the authentication strategy actually supported by the backend.

If secure HttpOnly cookie authentication is supported, prefer it.

Document the actual session behaviour.

---

### 11. REDUX TOOLKIT AND RTK QUERY

Use Redux Toolkit for application-wide state.

Create a typed Redux store.

Implement typed hooks:

- useAppDispatch
- useAppSelector

Use RTK Query for server-managed data.

Create a centralized base API using `createApi` and `fetchBaseQuery`.

Organize endpoints into logical feature modules.

Use RTK Query tags for caching and invalidation.

Avoid copying server data into ordinary Redux slices without a clear reason.

Use Redux slices for genuinely client-managed state such as:

- Authentication/session presentation state, where appropriate.
- UI preferences.
- Temporary application interface state.
- Non-server-managed workflows.

Use local React state for isolated component interactions.

Do not put every input field into Redux.

Avoid unnecessary global state.

Provide appropriate loading, error, empty, and success states for every server-driven page.

Do not make unconfigured network requests.

Read the API base URL from environment variables.

Example:

`VITE_API_BASE_URL=`

Include `.env.example`.

Never commit production secrets.

---

### 12. BACKEND API INTEGRATION

Before implementing API calls, inspect all available backend documentation and API references in the repository.

Create:

`docs/API_CONTRACTS.md`

For each feature, document:

- Endpoint.
- HTTP method.
- Authentication requirement.
- Request structure.
- Response structure.
- Error responses.
- Relevant TypeScript types.
- Cache invalidation requirements.

Do not invent endpoints or response structures.

If backend documentation is incomplete:

1. Identify the missing contract.
2. Create a typed interface only where its meaning is established by the PRD.
3. Mark the integration as pending.
4. Use an isolated development adapter only if necessary to allow UI development.
5. Clearly distinguish mock data from actual backend data.

Never silently substitute mock data when an API request fails.

Production builds must not expose mock fixtures as real application data.

The backend is outside the scope of this frontend migration. Do not modify or recreate backend services.

---

### 13. BOOTSTRAP AND STYLING

Bootstrap 5 must be used as the primary styling framework.

Import Bootstrap styles and JavaScript components correctly.

Use SCSS to establish the MY GARB theme.

Create:

- Theme variables.
- Typography rules.
- Global styles.
- Reusable component styles.
- Responsive utilities where required.

Do not use Bootstrap defaults indiscriminately.

Recreate the existing MY GARB visual language.

Use Bootstrap grid classes for responsive layouts.

Use appropriate Bootstrap components for:

- Navigation.
- Forms.
- Buttons.
- Cards.
- Modal dialogs.
- Dropdowns.
- Offcanvas menus.
- Tables.
- Alerts.
- Badges.
- Pagination.

Use custom React components for product-specific behaviour.

Avoid unnecessary custom CSS when Bootstrap already provides an appropriate solution.

Do not introduce inline styling everywhere.

Keep styling predictable and maintainable.

---

### 14. ROUTING

Use React Router.

Create separate route configurations for:

- Public storefront.
- Customer authenticated pages.
- Designer workspace.
- Administration workspace.

Suggested route structure:

```text
/
├── /discover
├── /search
├── /designers/:designerId
├── /portfolio/:portfolioItemId
├── /login
├── /register
├── /forgot-password
│
├── /account
│   ├── /profile
│   ├── /measurements
│   ├── /requests
│   ├── /requests/:requestId
│   ├── /specifications/:specificationId
│   ├── /orders/:orderId
│   └── /messages
│
├── /designer
│   ├── /dashboard
│   ├── /profile
│   ├── /portfolio
│   ├── /requests
│   ├── /requests/:requestId
│   ├── /specifications/:requestId
│   └── /orders
│
└── /admin
    ├── /dashboard
    ├── /approvals
    ├── /designers
    ├── /issues
    ├── /reviews
    └── /audit
```

Treat this as a proposed route map. Preserve existing approved route semantics where available.

Implement:

- Public routes.
- Protected routes.
- Role-based route guards.
- Nested layouts.
- Not-found page.
- Access-denied page.
- Error boundaries.
- Return-to-original-page after login where appropriate.

---

### 15. RESPONSIVE DESIGN

Preserve the supplied mobile and desktop design references.

Minimum supported viewport widths:

- 360px
- 375px
- 390px
- 768px
- 1024px
- 1440px

Requirements:

- No unintended horizontal scrolling.
- Touch targets should generally be at least 44px.
- Forms must remain usable on mobile.
- Bottom navigation must not cover page content.
- Dialogs must fit smaller viewports.
- Tables must adapt appropriately.
- Navigation must be optimized for each application.
- Images must preserve their intended aspect ratios.

Mobile is a first-class experience, not a reduced desktop layout.

---

### 16. TESTING STRATEGY

Testing is mandatory.

Do not consider a feature complete merely because it renders correctly.

#### 16.1 Unit tests

Use Vitest.

Test:

- Utilities.
- Formatters.
- Measurement conversion.
- Validation schemas.
- State reducers.
- Selectors.
- Status transition helpers.
- Permission helpers.

#### 16.2 Component tests

Use React Testing Library.

Test:

- Forms.
- Buttons.
- Dialogs.
- Navigation.
- Filters.
- Status chips.
- Empty states.
- Loading states.
- Error states.
- Responsive behaviour where practical.
- Accessibility and keyboard interaction.

#### 16.3 Integration tests

Test:

- Login flow.
- Registration.
- Protected routes.
- Role restrictions.
- Designer discovery.
- Request creation.
- Measurement submission.
- Specification confirmation.
- Order creation.
- Messaging.
- Order status transitions.
- Issue reporting.
- Admin resolution.
- Review submission.

Use controlled API mocks where the real backend is unavailable.

#### 16.4 End-to-end tests

Use Playwright.

Implement browser-level tests for:

1. Customer discovers a designer.
2. Customer views a designer profile.
3. Customer submits a custom request.
4. Customer provides measurements.
5. Designer receives the request.
6. Designer submits a specification.
7. Customer confirms the latest specification.
8. Exactly one order is created.
9. Designer updates production progress.
10. Customer confirms handover and completion.
11. Customer submits an eligible review.
12. Customer reports an issue.
13. Admin reviews and resolves an issue.
14. Unauthorized users cannot access restricted pages.

Include mobile and desktop coverage.

Test failure and retry behaviour.

Do not rely solely on mocked tests to claim real backend integration is complete.

#### 16.5 Accessibility tests

Verify:

- Keyboard navigation.
- Visible focus.
- Form labels.
- Accessible errors.
- Appropriate semantic HTML.
- Dialog accessibility.
- Button names.
- Colour contrast.

---

### 17. PACKAGE SCRIPTS AND QUALITY GATES

Configure scripts for:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --pretty",
    "lint": "eslint . --max-warnings 0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

Adapt scripts to the final installed configuration.

The following must pass before a milestone is considered complete:

- TypeScript typecheck.
- ESLint.
- Unit tests.
- Component tests.
- Production build.
- Relevant Playwright tests.

Do not disable TypeScript checks, suppress ESLint warnings indiscriminately, or weaken tests to make the pipeline pass.

---

### 18. PERFORMANCE AND CODE QUALITY

Follow professional frontend engineering practices.

Requirements:

- Use lazy loading for appropriate route groups.
- Split large application bundles.
- Optimize images.
- Avoid unnecessary re-renders.
- Use stable component keys.
- Keep components focused.
- Avoid deeply nested conditional rendering.
- Avoid `any` unless absolutely unavoidable and documented.
- Handle asynchronous requests safely.
- Provide meaningful error boundaries.
- Avoid unnecessary dependencies.
- Ensure production builds exclude development fixtures and debugging interfaces.
- Maintain strict TypeScript settings.

Use semantic HTML and accessible Bootstrap components.

---

### 19. MIGRATION RULES

The existing `.dc.html` files are the design references.

The custom runtime must not be part of the final production application.

For each source design:

1. Identify its visual layout.
2. Identify its data dependencies.
3. Identify its user interactions.
4. Identify its states.
5. Identify its responsive behaviour.
6. Map it to a React page or reusable component.
7. Implement its business logic.
8. Add tests.
9. Verify visual consistency.

Preserve all original image assets.

Create a migration mapping document showing:

| Existing file | React destination | Status |
|---|---|---|
| Discover.dc.html | storefront/pages/DiscoverPage.tsx | Pending |
| Search.dc.html | storefront/pages/SearchPage.tsx | Pending |
| Designer Profile.dc.html | storefront/pages/DesignerProfilePage.tsx | Pending |
| New Request.dc.html | storefront/features/requests/ | Pending |
| Requests and Orders.dc.html | storefront/features/orders/ | Pending |
| Specification.dc.html | storefront/features/specifications/ | Pending |
| Messages.dc.html | storefront/features/messaging/ | Pending |
| Order.dc.html | storefront/features/orders/ | Pending |
| Profile.dc.html | storefront/pages/CustomerProfilePage.tsx | Pending |
| Designer Dashboard.dc.html | designer/pages/DesignerDashboardPage.tsx | Pending |
| Portfolio Editor.dc.html | designer/features/portfolio/ | Pending |
| Spec Builder.dc.html | designer/features/specifications/ | Pending |
| Admin.dc.html | admin/pages/AdminDashboardPage.tsx | Pending |
| Auth.dc.html | features/auth/pages/ | Pending |
| MY GARB Screens.dc.html | shared/design-system/ reference | Pending |
| MY GARB Batch 2.dc.html | docs/design-references/ | Pending |
| MY GARB Batch 3.dc.html | docs/design-references/ | Pending |

Also account for shared navigation, cards, dialogs, status chips, and remaining component references.

The batch files are consolidated design-reference documents. Do not mistake them for separate production pages.

---

### 20. CRITICAL BUSINESS RULES

These rules must be preserved throughout implementation.

1. Only approved designers are publicly discoverable.
2. Administrators cannot self-register.
3. Customer measurements remain private.
4. Customer requests are scoped to one designer.
5. Requests and orders are separate records and lifecycles.
6. Only the latest submitted specification can be confirmed.
7. Confirmation creates exactly one order.
8. Sent specification versions are immutable.
9. Existing order snapshots must not change when a profile is edited.
10. Messages do not alter agreed commercial terms.
11. An open issue blocks normal order completion.
12. Customer completion requires handover and confirmation.
13. Reviews are allowed only after eligible order completion.
14. A designer suspension prevents new requests but does not erase existing orders.
15. Cancellation requires the documented agreement or administrative resolution.
16. Payment is arranged directly between the parties during the pilot.
17. MY GARB must never claim it has transferred, collected, or refunded money.
18. Integrated courier tracking is outside the MVP.
19. Shopping cart and conventional product checkout are outside the MVP.
20. Server-side authorization remains mandatory.

Do not contradict these rules in the UI or frontend state management.

---

### 21. EXECUTION PHASES

Work in controlled implementation phases.

Do not attempt to migrate everything in one large, uncontrolled code-generation operation.

#### PHASE 0 — Repository audit

Inspect:

- Entire archive.
- All design files.
- Shared runtime.
- Existing image assets.
- PRD.
- Existing package files, if present.
- Existing documentation.

Deliver:

- Repository audit.
- Source file inventory.
- Screen inventory.
- Design-system extraction.
- Architecture proposal.
- Migration plan.
- Identified gaps and assumptions.

Do not delete or overwrite source material.

#### PHASE 1 — Project foundation

Implement:

- Vite.
- React.
- TypeScript.
- Bootstrap 5.
- SCSS.
- ESLint.
- Prettier.
- React Router.
- Redux Toolkit.
- RTK Query.
- Testing configuration.

Establish the folder architecture.

Implement the shared design tokens and application providers.

Validate the foundation.

#### PHASE 2 — Authentication and application shells

Implement:

- Authentication.
- Role-aware routing.
- Storefront layout.
- Designer layout.
- Admin layout.
- Shared components.
- Error handling.
- Navigation.

#### PHASE 3 — Customer storefront

Implement all customer-facing features.

Complete and test each module before moving to the next.

#### PHASE 4 — Designer workspace

Implement designer onboarding, profile management, portfolio, requests, specifications, and orders.

#### PHASE 5 — Admin workspace

Implement approvals, issues, moderation, and administrative oversight.

#### PHASE 6 — Backend integration

Integrate actual documented APIs.

Do not fabricate endpoints.

Use typed RTK Query endpoints and centralized error handling.

#### PHASE 7 — Testing and refinement

Run:

- Unit tests.
- Component tests.
- Integration tests.
- End-to-end tests.
- Responsive tests.
- Accessibility checks.
- Production build.
- TypeScript checks.
- Lint checks.

Fix issues rather than merely documenting failures.

#### PHASE 8 — Final handover

Deliver:

- Complete React source code.
- Documented architecture.
- Route documentation.
- API contract mapping.
- Component guidelines.
- Test documentation.
- Migration status.
- Environment configuration example.
- Build and deployment instructions.

---

### 22. ENGINEERING WORKING RULES

Follow these rules throughout the project.

1. Read the repository instructions in AGENTS.md before making changes.
2. Inspect Git status before modifying files.
3. Never overwrite or delete existing user work without authorization.
4. Preserve original source files and assets.
5. Do not create a new Git branch or commit unless instructed.
6. Do not install unnecessary packages.
7. Do not claim that a feature is complete without verifying it.
8. Do not leave broken imports or placeholder implementations disguised as completed features.
9. Do not create fake API integration.
10. Do not use `@ts-ignore` to bypass architectural problems.
11. Do not weaken tests to make them pass.
12. Document decisions and unresolved dependencies.
13. Prefer incremental, verifiable changes.
14. Run the relevant tests after each significant module.
15. Keep the application runnable throughout development.

If an essential backend contract is unavailable, isolate that integration point and continue with the parts that can be implemented correctly.

Do not stop the entire project because one API endpoint is missing.

---

### 23. DEFINITION OF DONE

The migration is complete only when:

- All required screens have React implementations.
- The customer, designer, and admin applications are separated.
- The shared architecture is maintainable.
- Redux Toolkit is properly configured.
- RTK Query is configured for backend integration.
- TypeScript types are meaningful and strict.
- Bootstrap 5 is consistently used.
- Existing design identity is preserved.
- Existing image assets are reused.
- All required user journeys work.
- Business rules are respected.
- Responsive layouts work.
- Loading, empty, error, and success states are implemented.
- Unit tests pass.
- Component tests pass.
- Relevant Playwright tests pass.
- Lint passes.
- Typecheck passes.
- Production build passes.
- Documentation is updated.
- No unresolved critical defects are hidden.

---

### 24. YOUR FIRST TASK

Start with PHASE 0.

Do not immediately begin rewriting all the HTML files.

First, thoroughly inspect the repository and provide:

1. A complete architecture assessment.
2. A list of all existing design screens and reusable components.
3. A recommended final folder structure.
4. A migration mapping from every source design to its React destination.
5. A list of business rules extracted from the PRD.
6. A list of backend/API information that is missing.
7. A list of required dependencies.
8. A phased implementation plan.
9. A list of potential technical risks.

Then proceed with PHASE 1 after recording the audit and proposed architecture.

Work as a senior engineer who owns the quality of the final application.

**The goal is not merely to convert the prototype. The goal is to build a clean, scalable, tested, maintainable React application that faithfully implements the MY GARB product requirements.**