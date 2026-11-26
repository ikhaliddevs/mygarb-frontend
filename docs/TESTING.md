# Testing

## Commands

Use `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:run`, `npm run test:coverage`, `npm run build`, `npm run check:dist` and `npm run test:e2e`.

Install Chromium once with `npx playwright install chromium`. Playwright builds/serves production on 127.0.0.1:4173 with strict port selection and no reuse of unknown servers. Browser artifacts are ignored. Run `npx playwright show-report` to inspect the HTML report.

For an installed Chrome fallback on Windows, run `$env:PLAYWRIGHT_CHANNEL='chrome'` before `npm run test:e2e`. Omit the variable in CI to use Playwright's pinned Chromium. Both run through the Playwright Chromium engine; record which browser was used.

## Phase 1 coverage

- API environment validation: blank configuration, trusted URLs/paths and invalid values.
- API transport: no request when unconfigured, endpoint base-path restrictions, successful transport, HTTP and network failures without fixture fallback.
- React Testing Library: lazy routing through providers, not-found recovery, unavailable admin route and safe route errors.
- Playwright: production boot, no legacy/business requests, required viewport widths, keyboard skip navigation and route recovery on desktop/mobile Chromium.
- Artifact check: supplied designs, PRDs and known fixture/runtime markers excluded from production output.

Test transport data is isolated in test modules. These tests do not establish backend integration, authentication, marketplace functionality or full accessibility compliance. CSS visuals require screenshot inspection. The legacy designs have not been browser-certified.

## Later phases

Add unit tests for conversion/validation/lifecycles, component tests for actual forms and dialogs, and cross-role integration/E2E for request → latest specification → exactly one order → production → handover → completion → review. Include stale versions, concurrent clicks, lost-response retries, invalid ownership, suspension, cancellation agreement, open-issue completion blocking, admin resolution and mobile keyboard behavior. Backend guarantees require real integration tests, not solely mocks.

## Validation record

Phase 1 validation completed on Windows with Node 26.3.1 and npm 11.16.0. TypeScript, ESLint, production build and production artifact checks passed. Vitest passed 31 tests across three files. Coverage for the explicitly selected configuration/transport modules was 100% statements, functions and lines, and 93.54% branches; this is not whole-application coverage.

Playwright passed all 18 tests using installed Chrome through its Chromium engine, with desktop and mobile emulation. Desktop and mobile screenshots were inspected. Mobile keyboard testing waits for the lazy route before sending Tab. These checks do not represent testing on physical mobile devices.

Bootstrap 5's upstream Sass code emits deprecation warnings during builds. They remain visible; the production build succeeds. Track Bootstrap's Sass migration before upgrading to a Sass release that removes those APIs.

The dependency audit reports 10 moderate dependency entries arising from one underlying development-only minimatch advisory, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Installed minimatch 10.2.6 is used by ESLint/config-array/typescript-eslint, not the application runtime. The patched major version changes public APIs; a forced transitive major override or automatic tooling downgrade has not been applied. Track compatible upstream upgrades and rerun lint and the audit when updating. This remains an unresolved development-tooling advisory, not a clean audit result.

The registry's latest jsdom failed dependency resolution (`data-urls@^8.0.0` was unavailable). jsdom is pinned to 26.1.0 for a resolvable test environment. Exact resolved tool versions are recorded in the lockfile.

## Phase 2 validation - 17 November 2026

Implemented supported authentication against live OpenAPI 0.7.0 and separate customer/designer/admin shells. Password recovery/reset is deferred by explicit user approval and never sends a request or claims success.

Automated results:

- TypeScript, ESLint and formatting checks passed.
- Vitest: 46 tests passed across five files, including role restrictions, unavailable sessions, validation, secure return destinations, Unicode password bounds, transport cookies/security header and unchanged foundation behavior.
- Playwright: 48 tests passed on installed Chrome, desktop and Pixel 7 emulation. The suite builds production first. Authentication responses in this suite are controlled browser intercepts, not live backend results.
- Browser coverage includes all three roles, restoration, denied cross-role access, logout, expired sessions, registration/verification with separate login, failed login/logout, retry after session failure, verification failure, resend rate limits, unavailable recovery, keyboard password reveal, root regressions and widths 360/375/390/768/1024/1440.
- Desktop/mobile registration screenshots inspected; original photograph and typography retained.
- An existing routing test raced a lazy navigation by finding the old heading. It now waits for the destination heading; assertions were retained. The rerun passed.
- Production build passed as part of Playwright startup. Bootstrap Sass deprecation warnings remain visible. Dependency versions were not changed; the moderate development-only advisory above remains unresolved.
- Final SHA-256 comparison: all 51 original archive files unchanged, none missing. The supplied Postman collection is excluded from formatting and was not edited.

Live backend/browser evidence (separate from mocked suite):

- GET /api/docs.json returned OpenAPI 0.7.0; GET /api/health/ready returned 200 ready.
- Browser origin http://localhost:5173 is allowed with credentials. 127.0.0.1 is not the configured origin.
- Executed npm.cmd run dev; the port was already occupied by this repository's Vite process. Verified its command path and used that running server without stopping it.
- Used fresh Gmail plus-alias test accounts for the user-supplied customer/designer inboxes. Passwords were generated for these accounts and kept outside the repository; they were not printed or committed. No existing accounts were changed.
- Customer and designer registration ultimately returned 202 and displayed the generic verification page. Initial browser attempts timed out; later attempts received the documented response. A 202 does not prove mail delivery.
- Both accounts' pre-verification login returned 401 and no mygarb_session cookie. Both protected entry routes redirected to login. Recovery correctly displayed unavailable.

Remaining live acceptance dependencies:

- The user reports that neither test inbox received an OTP. Successful verification, code replay/expiry, resend delivery, verified login, cookie restoration, logout and post-logout rejection have not yet been verified against the real backend. Do not infer success from the mocked tests.
- The user confirmed that no dedicated test administrator exists. Successful real admin access and real cross-role denial after a verified login remain unverified.
- No backend services, database records or administrator roles were created outside the authorized public registration flow. Test accounts may remain on the local backend; no account-deletion endpoint was assumed.

Phase 2 remains implemented but not accepted as complete until the outstanding live checks are resolved. Phase 3 has not started.

## Mail-delivery investigation - 17 November 2026

Read-only inspection found the local backend mail configuration selects Gmail; sender and app-password fields are present. Values were not printed. The environment file predates the running backend process; inherited process overrides were not independently inspected.

A non-sending Nodemailer SMTP verification using that configuration failed with ETIMEDOUT at stage CONN, without an SMTP response code. This establishes a current connection failure before authentication; it does not establish invalid credentials or a Gmail rejection. No inbox was opened and no mail was sent by this diagnostic.

The backend's Gmail adapter catches and replaces provider exceptions; the verification service logs only verification_email_delivery_failed. No persisted .log/.out/.err file containing that event was found in the backend or VS Code log directories. Per-signup SMTP attempts cannot be conclusively correlated from retained logs. HTTP 202 remains a generic acknowledgement, not delivery evidence.

No resend was issued: the user's authorization was conditional on working delivery, which the connection check did not establish. Backend code, mail configuration and database records were not modified during this investigation. Live OTP verification, successful login, cookie restoration and logout remain pending. Successful live admin access is explicitly unverified; no admin provisioning is planned.

Once mail connectivity is restored, use the documented POST /auth/resend-verification once per affected test alias, then let the user enter codes directly in the Email and Verification code fields at http://localhost:5173/verify-email. Do not request inbox access or ask the user to paste OTPs into chat.

## Mail follow-up - 23 November 2026

Backend readiness returned HTTP 200. Gmail remains configured with the required fields present (values not printed). The non-sending SMTP connection/authentication check passed, unlike the 17 November timeout. This does not prove inbox delivery. A repeat search found no persisted delivery-failure logs in the backend or VS Code log directories; the earlier signup attempts still cannot be conclusively correlated.

After checking the live 0.7.0 resend contract, exactly one POST attempt was made for each of the two existing test aliases. Neither attempt produced a confirmed parsed API response in the diagnostic, and neither was retried. The attempt outcomes are indeterminate; do not claim successful resend or delivery. Subsequent read-only readiness and CORS preflight checks returned 200 and 204. The verification page at http://localhost:5173/verify-email returned 200.

The user should enter any received code directly in that page with the exact corresponding test alias. No inbox was opened, no secrets printed, and no verification, login or logout was performed. These live flows remain pending. Successful live admin access remains unverified because no dedicated admin account exists. No backend configuration or source was changed.

## Readiness follow-up - 26 November 2026

Read-only checks returned HTTP 200 for backend readiness, live OpenAPI (still version 0.7.0), and the frontend verification page. No additional resend, verification, login or logout request was made. Awaiting the user's confirmation of which dedicated accounts have been verified before continuing authenticated live checks. Successful admin access remains unverified; no test administrator is available. Existing automated test results are historical results, not rerun on this date.

26 November account clarification: the user confirms that the two exact inbox addresses (without the earlier plus aliases) are verified. This is user-confirmed verification, not an automated live result. Existing credentials for those accounts are required to test login, actual server roles, cookie restoration and logout. Do not reuse the generated alias-account passwords or change existing account passwords. Successful admin access remains unverified.

## Supplied-credential checks - 26 November 2026

Read the user-supplied private credentials file outside the repository without printing or copying its contents. Backend readiness and frontend login returned 200. The first entry has an invalid email format and cannot pass the login form validation. For the second entry, a diagnostic browser submission reached the documented /api/auth/login endpoint and received HTTP 401. No successful authenticated session was established. Initial browser checks timed out awaiting a login response; no success is inferred from those attempts.

Successful login, actual role confirmation, cookie restoration, cross-role denial while authenticated and logout remain blocked until corrected working credentials are supplied. No passwords, sessions, account roles or backend settings were changed. No additional verification codes were requested. Existing automated results are unchanged and were not rerun for this credentials-only check.

Corrected-credential retry (26 November): both entries now pass input-format validation. One live browser login attempt per account reached the 0.7.0 backend; both returned HTTP 401. No additional retries were made and no authenticated session was established. This generic response does not distinguish incorrect credentials from an unverified/ineligible account. Live restoration, authenticated role checks and logout remain pending working backend authentication. No credentials were printed or changed.

## Phase 2 independent completion - 26 November 2026

Per the latest instruction, Gmail/email verification testing is left to the user. No credentials were accessed and no email, verification or login mutations were sent during this continuation. A read-only live API check confirmed version 0.7.0 and the existing six authentication endpoints; recovery/reset remains unsupported.

Fixed loss of returnTo across registration, verification and recovery navigation, and rejected literal dot-segment return paths. Added full-journey desktop/mobile regression coverage and tests that deny suspended accounts in all three roles. The application retains real API integration; controlled responses are confined to tests and do not bypass production verification.

Validation: TypeScript and ESLint passed; 52 unit/component tests passed across five files; all 50 Playwright checks passed using installed Chrome with desktop/mobile emulation. The Playwright run included a successful production build. Production artifact checks and final formatting checks are recorded alongside the continuation. No functional check was weakened or disabled. Bootstrap Sass deprecations remain visible; the documented moderate development dependency advisory was not changed.

All 51 original archive entries remain SHA-256 identical. Existing accounts, credentials, settings, backend code and the supplied collection were preserved. No commit, push or deployment was performed.

Pending manual/live acceptance: delivery, OTP verification, verified account login, real cookie restoration/logout and successful administrator access. Historical HTTP 401 results remain failures, not passes. Phase 2 is not declared fully accepted, and Phase 3 has not started.

## Phase 3 partial implementation and blocker diagnosis ? 26 November 2026

Current results supersede historical not-started statements; Phase 3 is partial, not accepted as complete.

| Check                | Actual result                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript           | PASS, npm.cmd run typecheck                                                                                                                                                                                                                                                                                                                                                      |
| ESLint               | PASS after replacing React Hook Form watch with useWatch; initial incompatible-library warning was fixed, not suppressed                                                                                                                                                                                                                                                         |
| Unit/component       | PASS, 70 tests across seven files                                                                                                                                                                                                                                                                                                                                                |
| Production build     | PASS as part of Playwright webServer startup                                                                                                                                                                                                                                                                                                                                     |
| Production boundary  | PASS across60 generated files; original runtime/design documents and development fixtures excluded                                                                                                                                                                                                                                                                               |
| Browser              | PASS,82 checks using installed Chrome; desktop1440 and mobile390, with existing auth/foundation checks at all six planned widths                                                                                                                                                                                                                                                 |
| New browser coverage | Profile save/reload; real unit conversion and saved units; duplicate-label rejection; separate requests/orders and immutable snapshots; plain-text messages; no automatic failed-send retry; notification read/navigation; profile retry and dirty-form retention; invalid IDs; pending-order recovery503 then explicit same-ID retry; initial specification confirmation absent |
| Visual inspection    | Mobile profile and measurement screenshots inspected for usable fields, wrapping and preserved theme. This is not a complete pixel comparison of every archive screen.                                                                                                                                                                                                           |
| Source preservation  | PASS, all51 original ZIP entries remain SHA-256 identical                                                                                                                                                                                                                                                                                                                        |

Frontend browser tests intercept API responses; they do not prove successful authentication or writes against the running development backend. Production code uses the real configured API. The existing localhost5173 preview was preserved; Playwright built and started its own production preview on4173. No development backend mutation, verification bypass or Gmail access was performed by these tests.

Before backend work was paused, backend lint and12 focused real-MongoDB request/order tests passed. This includes the11 existing M4 tests and the added keyed-submission concurrency/replay test. Eight concurrent confirmation calls returned one order with one initial event; unique requestId index, frozen snapshots, cancellation races, lost-response recovery and process-restart recovery passed. Eight concurrent keyed submissions returned one request/event; changed-payload replay returned409 and another customer's identical key remained isolated. Fixture cleanup assertions passed. The test database retains the added submission-key index. No full backend suite, clean install or rollout is claimed for this patch; backend work is paused and its running version was not restarted.

Read-only diagnosis (no secret output): credential entry1 matches an existing active, verified customer but its password fails bcrypt comparison; entry2's normalized email does not exist in the configured database. No additional login retries or account changes were made. Live successful login/session restoration/authenticated role-guard/logout checks remain blocked, and successful admin access remains unverified. User-confirmed email verification is not counted as a successful login.

Approval policy/eligibility changes are explicitly deferred by the user. New requests and approved discovery remain blocked; full versioned specification confirmation remains unavailable despite M4's existing duplicate-safe price/date confirmation. See PHASE3_BLOCKERS.md for the evidence, exact changed backend files and database effects. Bootstrap Sass deprecations and the previously documented moderate development dependency advisory remain unchanged. No commit, push, deployment or automatic revert.
