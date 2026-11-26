# Migration progress

## Milestones

- Phase 0: source/archive/runtime/PRD/asset audit complete. See `REPOSITORY_AUDIT.md`.
- Phase 1: foundation implemented and validation passed. See `TESTING.md` for results and the outstanding development-tooling advisory.
- Phase 2: supported authentication and independent application shells implemented; navigation follow-up validated. Email-dependent live checks are deferred to manual testing by the user; successful admin access remains unverified.
- Phase 3: partially implemented; account, measurements, record viewing, text conversations and notifications are under validation. Approval-dependent discovery/new requests and full specification confirmation remain blocked. See the 26 November continuation below.
- Phase 4: designer workspace pending.
- Phase 5: admin workspace pending.
- Phase 6: documented backend integration pending. Begin contract discovery earlier.
- Phase 7: full testing/accessibility/responsive/performance refinement pending.
- Phase 8: final handover pending.

Every milestone requires typecheck, lint, unit/component tests, build and relevant browser tests. No feature is complete merely because a fixture renders. The foundation preview is not a migrated Discover page.

## Complete source mapping

All destinations below are relative to `src/` except reference documentation. Business-screen migrations remain pending except the supported Auth variants and Phase 2 navigation/shell work described below.

| Existing file               | Variants / classification                                                  | React destination                                                | Status                                               |
| --------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Discover.dc.html            | default, loading; screen                                                   | apps/storefront/pages/DiscoverPage.tsx                           | Pending                                              |
| Search.dc.html              | default, loading, empty, error; screen                                     | apps/storefront/pages/SearchPage.tsx and features/discovery      | Pending                                              |
| Designer Profile.dc.html    | default, noReviews; public screen                                          | apps/storefront/pages/DesignerProfilePage.tsx                    | Pending                                              |
| Portfolio Item.dc.html      | default, noMedia; public screen                                            | apps/storefront/pages/PortfolioItemPage.tsx                      | Pending                                              |
| Auth.dc.html                | signin, signinError, register; recovery explicitly unavailable             | features/auth/                                                   | Supported flows implemented; live acceptance pending |
| New Request.dc.html         | details, errors, measurements, submitted                                   | apps/storefront/features/requests and features/measurements      | Pending                                              |
| Requests and Orders.dc.html | requests, orders, empty                                                    | apps/storefront/pages/RequestsAndOrdersPage.tsx                  | Pending                                              |
| Specification.dc.html       | default, superseded, confirmed                                             | apps/storefront/features/specifications                          | Pending                                              |
| Order.dc.html               | inProduction, handedOver, issueOpen, completed                             | apps/storefront/features/orders, reviews and issues              | Pending                                              |
| Messages.dc.html            | default, failed, empty                                                     | features/messaging with role-specific page composition           | Pending                                              |
| Profile.dc.html             | default, saved; customer screen                                            | apps/storefront/pages/CustomerProfilePage.tsx                    | Pending                                              |
| Designer Dashboard.dc.html  | default, pending                                                           | apps/designer/pages/DesignerDashboardPage.tsx                    | Pending                                              |
| Portfolio Editor.dc.html    | list, edit, uploadError, empty                                             | apps/designer/features/portfolio                                 | Pending                                              |
| Spec Builder.dc.html        | draft, errors, sent                                                        | apps/designer/features/specifications                            | Pending                                              |
| Admin.dc.html               | queue, issue; two screens and admin shell                                  | apps/admin/pages/ApprovalsPage.tsx, IssueDetailPage.tsx, layouts | Pending                                              |
| MGNav.dc.html               | desktop, mobileTop, mobileBottom, footer, footerMobile; auth/active states | apps/storefront/components; separate workspace navigation        | Pending                                              |
| DesignerCard.dc.html        | mosaic, strip; reusable domain card                                        | apps/storefront/components/DesignerCard.tsx                      | Pending                                              |
| PortfolioCard.dc.html       | optional estimate; reusable domain card                                    | apps/storefront/components/PortfolioCard.tsx                     | Pending                                              |
| StatusChip.dc.html          | 17 labels; reusable presentation                                           | shared/components/ui/StatusChip.tsx with domain-owned mappings   | Pending                                              |
| Dialogs.dc.html             | decline, withdraw, cancel; mobile sheet/desktop modal                      | shared dialog primitive and feature-owned forms                  | Pending                                              |
| MY GARB Screens.dc.html     | component sheet and Batch 1 canvas                                         | docs/design-references index and visual baselines; no route      | Reference only                                       |
| MY GARB Batch 2.dc.html     | Batch 2 canvas                                                             | docs/design-references index and visual baselines; no route      | Reference only                                       |
| MY GARB Batch 3.dc.html     | Batch 3 canvas                                                             | docs/design-references index and visual baselines; no route      | Reference only                                       |

## Per-module workflow

Record data dependencies, interactions, state variants and responsive rules; implement typed components and accessible behavior; attach only documented APIs; test validation/permissions/retries; compare against mobile/desktop references; document remaining integration dependencies. Preserve originals throughout.

## Phase 2 scope and acceptance (approved 17 November 2026)

Source of truth: running local backend at http://localhost:5000/api and live OpenAPI 0.7.0. Supported registration, OTP verification/resend, login, logout, session restoration and expiry handling are in scope. Password recovery/reset is explicitly deferred by the user; its routes display unavailable and send no request. No mock authentication adapter ships in the application.

Implemented:

- Responsive auth pages based on Auth.dc.html, original agbada photograph, local fonts and Bootstrap theme; React Hook Form/Zod validation, native role radios, password visibility and accessible field errors.
- Credentialed RTK Query endpoints with the required security header, validated response envelopes, safe error states and no automatic mutation retries.
- Customer, designer and admin layouts, independent navigation and lazy overview routes. Phase 3+ feature labels clearly say coming soon; no operational dashboard data is fabricated.
- Session-first role guards, safe internal return destinations, access denied, unavailable-session retry, sign-out failure feedback, identity-change cache reset, focus/reconnect and 60-second mounted-session rechecks.
- Root preview preserved with sign-in/register links; unknown routes and error boundaries retained.

Acceptance checklist:

- [x] Supported authentication UI and real endpoint integration implemented.
- [x] Role-scoped shells and shared presentation components implemented without Phase 3 business features.
- [x] No public administrator registration; server remains authority for identity and role.
- [x] Recovery/reset visibly unavailable under the approved exception.
- [x] TypeScript, lint, 52 unit/component tests and 50 production browser checks passed; see TESTING.md.
- [x] Desktop/mobile authentication screenshots inspected and supplied visual identity retained.
- [ ] Complete live customer and designer OTP verification, successful login, cookie restoration and logout with dedicated accounts.
- [ ] Verify successful live admin access with an existing provisioned test administrator.
- [x] Final archive comparison: all 51 originals unchanged; see TESTING.md.

Phase 2 is not marked complete while live acceptance remains outstanding. Controlled-response tests establish frontend behavior, not successful backend authentication. The later user-authorized Phase 3 continuation below supersedes historical not-started statements. Bootstrap Sass deprecations and the moderate development-tooling advisory remain documented and unchanged.

Mail follow-up: Gmail SMTP connectivity check failed with ETIMEDOUT / CONN; no resend performed. The user will enter codes directly after mail delivery is restored. No dedicated test admin exists; successful live admin access remains unverified. See TESTING.md.

23 November follow-up: SMTP verification now passes. One resend attempt per existing test account was made, with indeterminate API-response outcomes and no retries. User-entered verification and subsequent live authentication checks remain pending; see TESTING.md.

26 November account clarification: the user confirms that the two exact inbox addresses (without the earlier plus aliases) are verified. This is user-confirmed verification, not an automated live result. Existing credentials for those accounts are required to test login, actual server roles, cookie restoration and logout. Do not reuse the generated alias-account passwords or change existing account passwords. Successful admin access remains unverified.

Supplied-credential follow-up (26 November): first entry fails email-format validation; second account login returns 401. Live acceptance remains pending corrected working credentials. No Phase 3 work started.

Corrected-credential retry (26 November): both entries now pass input-format validation. One live browser login attempt per account reached the 0.7.0 backend; both returned HTTP 401. No additional retries were made and no authenticated session was established. This generic response does not distinguish incorrect credentials from an unverified/ineligible account. Live restoration, authenticated role checks and logout remain pending working backend authentication. No credentials were printed or changed.

## Phase 2 continuation - 26 November 2026

The user will handle Gmail/email verification manually later. No inbox access, resend, credential retry, account changes or verification bypass is authorized by this continuation. Email-dependent live verification, login, session restoration and logout remain pending, not passed. Password recovery/reset remains deferred because the current 0.7.0 API still has no supported endpoints. No dedicated test admin exists.

Completed the remaining return-navigation behavior: preserve the original protected destination through login, registration, verification and the unavailable-recovery page, then enforce the server-reported role before redirecting. Reject literal dot-segment return paths as well as external/encoded unsafe destinations. Added regression coverage for the complete auth navigation journey and suspended accounts in all three workspaces. Production endpoints and verification requirements are unchanged.

Phase 2 frontend implementation and automated validation are complete for the supported scope; remaining manual/live acceptance is still pending. Phase 3 is not started, and blocked authentication checks are not marked complete. No commits, pushes or deployments.

## Phase 3 continuation and backend pause ? 26 November 2026

User-authorized Phase 3 work follows this migration's Phase 0 assessment and plan, not the separate older frontend's milestones. Historical not-started notes above are superseded. Phase 2 live acceptance and Phase 3 completion remain pending.

Implemented the supported customer subset: private profile editing; private measurement replacement and actual cm/in conversion; paged/filterable request/order lists and separate details; immutable original snapshots; scoped text conversations with retained failed drafts; notifications with page-local unread counts and mark-read; loading/error/empty states and mobile navigation. Session rechecks retain dirty forms while a valid cached session exists, but errors still hide protected content. Fixed a React Hook Form watch lint warning using useWatch without disabling the rule.

Reconciled M4: duplicate-safe order confirmation already exists and is documented. Show accepted proposal price/date, and enable only recovery of an already confirmed pending order. Initial full-specification confirmation remains blocked by missing versioned commercial specification support. Approval-dependent discovery/new requests remain blocked; the user explicitly deferred any approval policy or eligibility changes. See PHASE3_BLOCKERS.md for exact findings, backend files changed before the pause, database effects and credential diagnosis.

### Frontend file inventory for this continuation

Added:

- src/apps/storefront/features/account/model.ts and model.test.ts
- src/apps/storefront/features/records/model.ts, model.test.ts and ConfirmedOrderRecovery.tsx
- src/apps/storefront/pages/CustomerProfilePage.tsx, MeasurementsPage.tsx, RequestsAndOrdersPage.tsx, RecordDetailPage.tsx, ConversationsPage.tsx, ConversationPage.tsx and NotificationsPage.tsx
- src/services/api/customerApi.ts and recordsApi.ts
- src/shared/components/feedback/DataFeedback.tsx
- src/shared/components/navigation/PageControls.tsx
- src/shared/components/ui/ReferenceGallery.tsx
- tests/e2e/customer.spec.ts
- docs/PHASE3_BLOCKERS.md

Modified:

- src/apps/storefront/routes.tsx
- src/apps/storefront/layouts/StorefrontLayout.tsx
- src/apps/storefront/pages/AccountPage.tsx
- src/features/auth/RequireRole.tsx
- src/styles/global.scss
- docs/MIGRATION_PROGRESS.md, TESTING.md, API_CONTRACTS.md and ROUTES.md

This is the task's known edit inventory; the frontend directory has no Git repository, so it is not presented as a Git diff. Generated dist and ignored browser test reports are verification artifacts. Original archive files and supplied Postman collection are not migration edit targets. No dependency, account, setting, commit, push or deployment changes were made in the frontend.

Source-map updates: Profile is partial (supported private account and measurements); Requests and Orders, Order and Messages are partial supported API views; Specification is blocked except actual proposal display and committed-order recovery; MGNav is partial shell/customer navigation. Other source-map entries remain pending/reference-only as listed above.
