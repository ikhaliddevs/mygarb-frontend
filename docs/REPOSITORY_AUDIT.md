# Phase 0 repository audit

Recorded during Phase 1 from the completed read-only audit. The original archive contains 51 files, all byte-identical to their extracted counterparts at audit time. The workspace adds `AGENTS.md`. There was no existing package manifest, build configuration, backend contract, test suite or Git repository.

## Inventory

23 design files comprise 15 screen modules, four reusable components, one dialog collection, and three consolidated references. See the complete file-to-destination mapping in `MIGRATION_PROGRESS.md`. `support.js` is a generated 69,150-byte interpreter; its underlying runtime source/build project is absent.

Both PRDs are Draft 2.0, dated 7 October 2026, with identical SHA-256:

`CF14FEB1D0928E39806DB829851D595DBC61E7939D68598A1731583DEA694C84`

The PRD references upstream strategy and original button/product-card design archives that are not supplied. Product categories, locations, operating policies and detailed contracts remain decisions to validate.

## Runtime findings

The export loads React/ReactDOM 18.3.1 from a CDN, extracts `<x-dc>` templates and evaluates `class Component extends DCLogic` with `new Function`. `data-props` supplies editor metadata, root defaults and `$preview` dimensions. `renderVals()` is merged over props. `<dc-import>` fetches sibling files by name; `<sc-if>` and `<sc-for>` compile into React conditionals and lists. Interpolation supports paths, literals, equality and negation, not arbitrary JSX expressions. Inline styles and pseudo-state attributes become React styles/generated CSS. `<helmet>` mounts fonts/styles/metadata. Registry updates, streaming placeholders and preserved logic state support design editing.

All supplied logic consists of fixture-derived presentations. No application event handlers, business fetches, persistence or state mutations are implemented. Most links use `#`. Saved/sent/confirmed states and unread counts are illustrations. Screen props explicitly select mobile or desktop; fluid CSS also uses flex, auto-fit grids, clamp and container-relative sizing. The three canvas documents instantiate 360px mobile and 1440px desktop frames; they are not production pages.

## Asset audit

23 JPEGs total 1,211,231 bytes. All decode and all are referenced. No referenced JPEG filename was missing. Dimensions range from 292x448 to 700x468, with both portrait and square crops. `uploads/PICTURES INSPO.png` is a 3843x3515 collage (~13.3 MB). `.thumbnail` is a WebP preview of Batch 3.

Assets: agbada-family-wide, agbada-trio, ankara-couple, ankara-jumpsuit, ankara-mens-set, ankara-peplum, ankara-two-piece, ankara-wrap-dress, beige-green-shirt, beige-jumpsuit, beige-tux, black-beige-shirt, black-gold-agbada, black-suit, bride-cream-iro-gele, brown-agbada, brown-gown-cross, brown-gown-oneshoulder, corset-trousers, gold-lace-gele, group, maroon-iro-gele, navy-kaftan-set (all `.jpg`).

Some captions do not match photos. `ankara-peplum.jpg` shows a corset/trouser outfit. The portfolio gallery contains different garments as if they were one piece. Photos are reused across fictional designers and private evidence examples. Preserve sources but correct content relationships before production. Small originals may not support sharp desktop heroes. The `noMedia` state is a fixture, not an image-error handler.

## Important gaps and conflicts

- Designer screens reuse customer navigation; each role needs its own shell.
- Request review/send step, request details, notifications, verification/reset completion, designer profile/settings, change and cancellation responses, issue reporting, admin dashboard/moderation/audit/category screens are incomplete or absent.
- Mobile messaging couples thread selection to failure; media failure also removes an estimate. Separate these states.
- Sent specification controls still look editable. Drawn radios/checkboxes are not functioning native controls. Dialog focus management is absent.
- The same issue fixture ID belongs to different orders across views.
- Four portfolio items, six images, 30-minute recovery expiry, two-day approval response and 1000-character reviews are design assumptions, not established backend rules.
- Strict ready-before-occasion validation conflicts with the PRD's negotiated alternative-date behavior.
- Email order updates are shown but deferred by the PRD pending validation.
- Private upload copy must account accurately for scoped support access.

## Business rules to retain

Approved-only discovery; no public admin registration; owner/participant-scoped private records; one designer per request; independent request/order/issue lifecycles; latest submitted specification only; atomic single-order confirmation; immutable submitted versions and order snapshots; messages never modify commercial terms; unresolved issues block completion; handover precedes customer completion; one eligible review per completed order; suspension blocks new work but preserves existing records; cancellation needs agreement or administrative resolution; direct-party pilot payments only; no cart, wallet, refunds execution or courier tracking. Backend authorization remains mandatory.

Request quantities 1–50 are specified by the engineering instructions/design. PRD requires positive category-dependent measurements, actual unit conversion, future needed-by dates and proposes JPEG/PNG/WebP at 5 MB per file. Group measurements, retention, approval criteria, pilot taxonomy/geography and commercial/handover/correction policies remain unresolved.

The audit was source-based plus visual asset inspection, not browser certification of every legacy variant.
