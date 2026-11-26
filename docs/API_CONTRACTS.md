# API contracts

Phase 2 source of truth: live `http://localhost:5000/api/docs.json`, OpenAPI version 0.7.0, inspected 17 November 2026. The supplied Postman collection includes older 0.6.0 response examples; those examples do not override the live contract. Non-authentication feature contracts will be reviewed in their implementation phases.

| Feature        | Required contract                                                                              | Intended cache tags           |
| -------------- | ---------------------------------------------------------------------------------------------- | ----------------------------- |
| Authentication | Session restoration, registration, verification, recovery, logout, expiry, CSRF/CORS           | Session                       |
| Designers      | Approval visibility, service coverage, taxonomy, filters, pagination, profile editing          | Designer                      |
| Portfolio      | Ownership, visibility, upload transport, cover/order, estimates, deletion                      | Portfolio, Designer           |
| Measurements   | Category schema, units/precision, source/time, review and private access                       | Measurement                   |
| Requests       | Private drafts, submission idempotency, single designer, discussion/withdraw/decline           | Request                       |
| Specifications | Drafts, immutable versions, supersession conflicts, atomic single-order confirmation           | Specification, Request, Order |
| Orders         | Immutable snapshot, production transitions, change/cancellation agreement, deduplicated events | Order, Request                |
| Messaging      | Participants, request/order linkage, pagination, transport, read state, retry identity         | Conversation                  |
| Notifications  | Recipient events, pagination, durable read state, authorized destination                       | Notification                  |
| Reviews        | Eligibility, uniqueness, aggregation, reports, moderation reasons                              | Review, Designer              |
| Issues/admin   | Scoped access, assignment, internal notes, resolutions, approvals/categories, audit            | Issue, Order, Designer, Audit |

For each implemented endpoint, add the actual URL, method, auth rule, payloads, error responses, TypeScript DTOs and invalidation behavior here. Never infer these from fixture objects. Tests may use synthetic transport paths; these are not proposed API endpoints.

## Foundation behavior

`VITE_API_BASE_URL` accepts an HTTP(S) URL or a same-origin absolute path. Empty or malformed configuration fails closed before fetching. Endpoint paths must remain relative to the configured base. The preview makes no requests. `fetchBaseQuery` handles timeout, abort signals, HTTP/network errors and JSON processing; `createApi` supplies caching. There is no silent mock fallback or automatic mutation retry.

Phase 2 uses `credentials: include` and the server-issued HttpOnly `mygarb_session` cookie. All RTK Query mutations send `X-MYGARB-Request: 1`; JSON request bodies use the documented content type. The browser supplies Origin and cookies. No bearer token is read, generated or persisted. Frontend checks are not a substitute for backend authorization.

## Implemented authentication contract (0.7.0)

Base URL: http://localhost:5000/api. The running backend permits browser origin http://localhost:5173 with credentials. Use localhost consistently; 127.0.0.1 is a different origin and is not currently allowed. No proxy rewrites or origin spoofing are used.

| Endpoint                  | Method | Request                                            | Successful response                                                               | Session requirement                               |
| ------------------------- | ------ | -------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| /auth/register            | POST   | name, email, password, role (customer or designer) | 202: success true, data.message; same generic response for new/existing addresses | None; does not log in                             |
| /auth/verify-email        | POST   | email, otp (six digits)                            | 200: success true, data.emailVerified true                                        | None; invalidates prior sessions, does not log in |
| /auth/resend-verification | POST   | email                                              | 202: success true, data.message; delivery not guaranteed                          | None                                              |
| /auth/login               | POST   | email, password                                    | 200: success true, data.user; sets HttpOnly cookie                                | Verified active account                           |
| /auth/me                  | GET    | None                                               | 200: success true, data.user                                                      | Valid active session                              |
| /auth/logout              | POST   | Empty JSON object                                  | 200: success true, data.message; revokes session and clears cookie                | Valid session; repeated logout is 401             |

User contains id, name, email, role (customer/designer/admin), and status (active/suspended). The frontend uses these exact lowercase wire values. Zod validates successful authentication response envelopes. Forms and DTO types live in features/auth/model.ts; endpoints live in services/api/authApi.ts.

Passwords require at least eight Unicode code points, at most 72 UTF-8 bytes and no NUL. Passwords are not trimmed. Email maximum is 254 characters; registration name is required and at most 100. Public admin registration is unavailable.

Errors use success false and error.code/error.message. Relevant codes: INVALID_INPUT (400), VERIFICATION_FAILED (400), INVALID_CREDENTIALS or UNAUTHENTICATED (401), CSRF_REJECTED or FORBIDDEN (403), AUTH_RATE_LIMITED or RATE_LIMITED (429); the API also documents 413, 415 and 500. UI messages are mapped to safe explanations; network, timeout and unexpected responses produce a retryable failure, never mock success. Mutations are not automatically retried.

OTP expires after 10 minutes, is single-use and permits at most five attempts. Verification rate limit: 15 requests/15 minutes/IP. Registration: five/hour/IP. Resend: 60-second cooldown, five sends/account/24 hours and five requests/hour/IP. The server enforces these limits; a generic resend response does not prove an email was sent. Password recovery/reset has no contract and is explicitly deferred by the user.

Session queries provide the Session tag and have zero unused-cache retention. Guards refetch on mount, focus, reconnect and every 60 seconds while mounted. A failed lookup hides workspace content; 401 redirects to sign-in, other failures offer retry. Login/logout clear RTK Query state so another identity does not inherit cached records. Protected data must still be authorized per request on the server. Absolute session lifetime and cookie deployment attributes beyond HttpOnly are server-owned; no client expiry duration is invented.

## Phase 3 supported subset (26 November 2026)

Live 0.7.0 was inspected together with backend source. See [contract reconciliation](PHASE3_BLOCKERS.md) for the narrower backend PRD, approval mismatch and correction: M4 confirmation already guarantees one order. Local submission-key backend edits are paused and are not assumed to be loaded by the running API.

All following calls use the existing session cookie and mutation header. No production mock adapter is used. Responses retain success/data envelopes and are Zod-validated in customerApi.ts and recordsApi.ts. All queries have zero unused-cache retention. Protected customer pages remain behind server-session role guards.

| Endpoint                | Method / request                     | Data / access                                                                                           | Cache                         |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------- |
| /profile                | GET; PATCH name, phone               | profile: id, name, private phone; own customer                                                          | Session invalidation on save  |
| /measurements           | GET; PUT unit, values[{label,value}] | measurements null or unit, values, updatedAt; own customer; full replacement                            | Measurement                   |
| /requests               | GET page, limit, optional status     | requests, page, limit, hasMore; participant summaries                                                   | Request                       |
| /requests/:id           | GET                                  | request detail including original measurementSnapshot, responseText, optional proposal and orderPending | Request                       |
| /orders                 | GET page, limit, optional status     | orders, page, limit, hasMore; participant summaries                                                     | Order                         |
| /orders/:id             | GET                                  | order detail with immutable original snapshot, effectiveMeasurements and history                        | Order                         |
| /requests/:id/messages  | GET page, limit; POST text           | requestId, orderId and messages or message; authorized participants only                                | Conversation by request ID    |
| /notifications          | GET page, limit                      | notifications, page, limit, hasMore, deliveryPending; recipient only                                    | Notification                  |
| /notifications/:id/read | PATCH {}                             | notification id/readAt; idempotent owner-only mark read                                                 | Notification invalidated      |
| /requests/:id/confirm   | PATCH {}                             | order; owning customer only. Frontend exposes only recovery after confirmed/orderPending=true           | Request and Order invalidated |

Measurement labels: unique case-insensitively, nonempty, max60; max50 values, each >0 and <=1000. Empty replacement clears saved measurements. Conversion uses exactly 2.54 cm per inch, not relabelling. Profile editing supports only name and private phone, not invented contact preferences or password changes.

Lists use limit20, pages1?1000. Request and order enums remain distinct wire values. Messages are trimmed plain text of 1?2000 characters; no HTML rendering, uploads or WebSocket claim. Failed sends retain drafts and advise refreshing before retry because message writes are not idempotent. Notifications poll every30 seconds while focused and show only the current page's unread count.

Errors include400 validation,401 session,403 role,404 inaccessible/missing record,409 conflict/closed conversation,429 throttling and5xx failures. Recovery can return503 CONFIRMATION_PENDING; retry the same request, never create a replacement. Load failures expose retry; mutations have no automatic retry. Frontend validation and role guards never replace backend ownership/authorization.
