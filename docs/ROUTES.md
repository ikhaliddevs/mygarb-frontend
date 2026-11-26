# Routes

## Implemented

| Route | Behavior                                                                     |
| ----- | ---------------------------------------------------------------------------- |
| `/`   | Lazy-loaded development preview, explicitly unavailable marketplace features |
| `*`   | Lazy-loaded not-found page with working return-home link                     |

Phase 2 adds /login, /register, /verify-email, /forgot-password, /reset-password and /access-denied. Both recovery routes explicitly report unavailable and make no API call.

Protected shell routes: /account (customer), /designer/dashboard (designer), /admin/dashboard (admin). /designer and /admin redirect to their overview pages. Server session restoration precedes every workspace. A wrong role or suspended account is denied. A missing session redirects to login with an internal role-scoped return destination. Failed session lookup hides protected content and provides retry. Each shell has separate navigation; future feature labels are explicitly unavailable and have no dead links. All routes retain error handling and unknown paths retain the not-found screen.

## Planned

- Public: `/discover`, `/search`, `/designers/:designerId`, `/portfolio/:portfolioItemId`.
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.
- Customer: `/account/profile`, `/account/measurements`, `/account/requests`, `/account/requests/new`, `/account/requests/:requestId`, `/account/specifications/:specificationId`, `/account/orders/:orderId`, `/account/messages`, `/account/messages/:conversationId`, `/account/notifications`, `/account/issues/:issueId`.
- Designer: `/designer/dashboard`, `/designer/profile`, `/designer/portfolio`, `/designer/portfolio/new`, `/designer/portfolio/:portfolioItemId/edit`, `/designer/requests`, `/designer/requests/:requestId`, `/designer/specifications/:requestId`, `/designer/orders`, `/designer/orders/:orderId`, `/designer/messages`, `/designer/messages/:conversationId`, `/designer/notifications`, `/designer/settings`.
- Admin: `/admin/dashboard`, `/admin/approvals`, `/admin/approvals/:designerId`, `/admin/designers`, `/admin/issues`, `/admin/issues/:issueId`, `/admin/reviews`, `/admin/categories`, `/admin/audit`.

Before these are registered, implement session restoration and guards for CUSTOMER, DESIGNER and ADMIN. Preserve internal return destinations after login. Lazy-load workspace route groups. Server ownership/role checks remain authoritative.

Auth-page links preserve only the returnTo query value across registration, verification and recovery navigation. Login validates it against the authenticated role before navigating. Dot-segment paths, external destinations, encoded paths and control characters fall back to the role home. Recovery continues to show unavailable without contacting an endpoint.

## Phase 3 partial implementation ? current

Customer-protected lazy routes now include /account/profile, /account/measurements, /account/requests, /account/requests/:id, /account/orders/:id, /account/messages, /account/messages/:id and /account/notifications. Conversation IDs in these routes are request IDs, matching the API. The above planned list is a roadmap, not a statement that every route is available. Public discovery and new-request routes remain unregistered pending approval reconciliation. Full specification confirmation and order-completion actions remain unavailable. An already confirmed request with orderPending=true exposes safe same-request recovery.
