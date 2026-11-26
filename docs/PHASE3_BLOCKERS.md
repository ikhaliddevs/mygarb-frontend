# Phase 3 contract reconciliation — 26 November 2026

This assessment belongs to this Claude-HTML-to-React/Redux/TypeScript/Vite migration and its `AGENTS.md`, `REPOSITORY_AUDIT.md` and `MIGRATION_PROGRESS.md`. The older frontend's milestone plan does not govern this repository. Backend `docs/PRD.md` describes a narrower M1–M6 implementation; it is evidence of API behavior, not permission to weaken this migration's requirements.

## Confirmed findings

| Requirement                                                        | Actual implementation                                                                                                                                                                                                                                                                                     | Frontend decision                                                                                                                                              |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Confirmation creates exactly one order                             | Already implemented in M4 and documented in live OpenAPI 0.7.0: PATCH `/api/requests/{id}/confirm`, body `{}`. Atomic accepted-to-confirmed intent, deterministic order ID, unique requestId index and insert-only upsert. Concurrent/repeated calls preserve snapshot, history and timestamps.           | Duplicate prevention is **not** a confirmation blocker. The earlier broad assessment was incorrect.                                                            |
| Recover a confirmed intent whose order insertion failed            | 503 `CONFIRMATION_PENDING`; GET request reports `status: confirmed`, `orderPending: true`. Explicit same-endpoint retry recovers the same order after restart or lost response.                                                                                                                           | Implemented recovery button only for that server-reported state. No new agreement is made.                                                                     |
| Confirm only the latest submitted immutable specification          | M4 has one immutable accepted price/date proposal, not general specification versions. M5 version numbers govern post-confirmation measurement amendments, not full commercial specifications. Fabric responsibility, commercial terms, handover terms and submitted/superseded full versions are absent. | Initial confirmation remains unavailable. Show actual proposal price/date without relabelling it a complete specification.                                     |
| Only approved designers discoverable and eligible for new requests | Backend M3/M4 checks active account plus business name, location, specialties and portfolio. No approval record, approval API or approval predicate. `available: false` is informational.                                                                                                                 | **Blocked scope mismatch. User explicitly kept approval policy pending. Do not add approval, reinterpret active as approved, or change existing eligibility.** |
| Retrying a new request cannot create duplicates                    | Running 0.7.0 explicitly creates a new request on each POST. A minimal optional submissionKey patch was added locally before backend work was paused.                                                                                                                                                     | No new-request action enabled. Local backend patch is not assumed to be running or released.                                                                   |

The submissionKey patch preserves unkeyed clients, scopes keys to the authenticated customer, validates UUID syntax, fingerprints normalized fields and returns 409 `IDEMPOTENCY_CONFLICT` for changed details. Eight concurrent keyed submissions create one request/event; retries retain the original measurement snapshot after profile changes. Keys persist with records; existing input/date validation still applies. This is separate from the already-working M4 order deduplication.

## Backend pause and data effects

At the user's pause instruction, exactly these backend files had been changed by this work:

- `src/validators/orders.js`
- `src/models/orders.js`
- `src/services/orders.js`
- `src/docs/openapi.json`
- `tests/orders.test.js`

They remain local and uncommitted; nothing was reverted. Pre-existing changes to email/configuration/dependency files and handover documents were preserved. No administrator approval code was added. No API restart, configuration change or development account/data mutation was performed.

The read-only credential diagnosis used the private supplied file and backend-configured database. Account 1 exists, is active and verified, but the supplied password fails bcrypt comparison. Account 2's exact normalized email is absent from that database. No passwords/hashes were printed or saved, no passwords reset, and no further login retries made. Successful live login, session restoration, authenticated role guards and logout remain blocked. There is no dedicated test administrator.

The focused backend tests used only guarded local `mygarb_phasonable_test`. They created and cleaned their own users, sessions, requests and orders. The new unique partial submission-key index remains in that test database; no database was dropped or reset. The backend patch requires future review and controlled startup/index preparation before it can be relied on by the frontend. Backend work is now paused, including rollout and further tests/edits.

## Remaining Phase 3 scope

Independent implemented modules: private name/phone profile editing, named measurements with real cm/in conversion, request/order lists and details, original snapshots, scoped text messages, notification read state, and confirmed-order recovery. Live acceptance remains pending usable credentials.

Still missing or blocked: approved discovery/public profiles and portfolio browsing, retry-safe approved new requests and private uploads/drafts, full versioned specifications, category/source/review measurement semantics, handover/issue-aware completion, cancellation approval, reviews and supported password recovery. The backend also permits quantities up to 100 while the frontend plan requires 1–50; any eventual form must enforce the stricter approved bound. No unsupported mutation, fabricated endpoint or successful mock fallback is exposed. Phase 3 is not complete.
