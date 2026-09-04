# Berlin Food Product Requirements Document

## Document Control

| Field | Value |
| --- | --- |
| Product | Berlin Food |
| Document type | Project-level Product Requirements Document (PRD) |
| Status | Draft for product, engineering, operations, and security review |
| Date | 2026-08-27 |
| Product stage | Pre-launch stabilization; implementation and prototypes coexist |
| Primary language today | Arabic, right-to-left (RTL) |
| Decision convention | **Confirmed** = evidenced in discovery or repository; **Proposed** = recommended target; **TBD** = unresolved decision |
| Launch status | **Blocked until all P0 security and order-data-integrity gates are complete** |

## 1. Executive Summary

Berlin Food is a single-brand food delivery application that connects customers, delivery applicants and couriers, and restaurant administrators in one web product.

The current repository contains:

- A public landing page and public menu.
- Email/password and Google authentication.
- Multi-step customer onboarding.
- A persisted client-side cart and checkout flow.
- Customer order history and profile settings.
- Delivery application, application tracking, courier dashboard, available-order, active-delivery, order-history, and profile surfaces.
- Admin dashboard, menu, order, user, delivery-request, and profile surfaces.
- Supabase-backed authentication and data access.
- A configured PWA service worker and manifest, although the install prompt is not mounted.

The product is not launch-ready. Functional implementation and visual prototypes coexist, and some controls or metrics are static or incomplete. More importantly, the current implementation exposes launch-blocking security and data-integrity risks:

- Service-role create-user and delete-user API routes do not demonstrate authentication or admin authorization.
- The delete-user route logs the Supabase service-role key.
- Checkout creates an order and its items in separate client-issued writes.
- Client values determine order item prices and totals.
- Repository evidence does not include database migrations, Row Level Security (RLS) policies, or tests.
- Role, status, currency, geography, password, and route conventions are inconsistent.

This PRD prioritizes a secure, reliable MVP for menu-to-delivery operations. Payment processing, advanced live tracking, reordering, table booking, newsletter automation, dark mode, and advanced analytics are deferred unless separately approved.

## 2. Product Vision and Problem

### 2.1 Vision

Deliver a refined, trustworthy single-brand ordering experience in which a customer can move from menu discovery to successful delivery with minimal uncertainty, while restaurant staff and couriers operate from one consistent source of truth.

### 2.2 Customer Problem

Customers need to:

- Understand what is available and what it costs.
- Create an account without losing shopping intent.
- provide a valid delivery destination.
- Place an order with confidence that price, status, and fulfillment are correct.
- Understand what is happening after submission.
- Review past orders and maintain account details.

### 2.3 Operations Problem

Restaurant administrators need to:

- Maintain an accurate, available menu.
- Receive and progress valid orders.
- Control user and courier access safely.
- Review and decide delivery applications.
- Monitor operational performance using real data.

Couriers need to:

- Apply and understand application status.
- Access courier features only after approval.
- Claim eligible deliveries without race conditions.
- See sufficient pickup and destination information.
- Progress assigned orders through a controlled workflow.

### 2.4 Product Principle

Trust takes priority over feature breadth. No public launch should occur while privileged account operations are exposed or while order totals and line items can become inconsistent.

## 3. Repository Basis and Evidence

This PRD is based on confirmed discovery findings and repository inspection.

### 3.1 Primary Sources

- Runtime and dependencies: `package.json`
- Next.js and PWA configuration: `next.config.ts`, `public/manifest.json`
- Global Arabic/RTL metadata: `src/app/layout.tsx`
- Route authorization proxy: `src/proxy.ts`
- Route surfaces: `src/app/**/page.tsx`, `src/app/api/**/route.ts`
- Supabase clients and domain access: `src/utils/supabase/*`, `src/api/*`
- Generated schema types: `src/types/database.types.ts`
- Cart state and checkout: `src/stores/cart.store.ts`, `src/components/cart/Cart.tsx`
- Menu experience: `src/app/menu/page.tsx`, `src/components/menu/Menu.tsx`
- Customer orders: `src/components/orders/Orders.tsx`
- Admin surfaces: `src/components/admin/*`
- Delivery surfaces: `src/components/delivery/*`
- Authentication and onboarding: `src/components/auth/*`
- Known work notes: `Tasks.md`
- System documentation: `docs/system_design.excalidraw`, `docs/system design.excalidraw.png`

### 3.2 Design Evidence Limitation

The named `docs/Design/` folders described elsewhere in project context are absent from this repository snapshot. Only the system diagram and its PNG export are present. Therefore, design intent in this PRD is reconstructed from the implementation, global styles, project context, and system diagram; it is not treated as pixel-accurate approved design documentation.

## 4. Target Users and Jobs to Be Done

### 4.1 Guest

**JTBD-G1:** When deciding what to eat, I want to browse a current menu without creating an account so I can determine whether Berlin Food meets my needs.

**JTBD-G2:** When I decide to order, I want registration or login to preserve my cart and intended destination so I do not restart.

### 4.2 Customer

**JTBD-C1:** When building an order, I want clear availability, quantities, fees, and a final total so I can make an informed purchase.

**JTBD-C2:** When checking out, I want to select a supported address and submit once so I know the restaurant received one correct order.

**JTBD-C3:** After ordering, I want a reliable status and history so I know what happens next and can resolve problems.

**JTBD-C4:** When my information changes, I want to update my profile, address, and password securely.

### 4.3 Delivery Applicant

**JTBD-A1:** When applying to deliver, I want to submit the required information and receive a reference I can use to check progress.

**JTBD-A2:** While awaiting review, I want a clear pending, approved, or rejected result without gaining courier privileges early.

### 4.4 Approved Courier

**JTBD-D1:** When available for work, I want to see and claim eligible deliveries without another courier claiming the same order.

**JTBD-D2:** During fulfillment, I want pickup, customer contact, destination, and status controls appropriate to the current stage.

**JTBD-D3:** After completion, I want an accurate history and delivery performance summary.

### 4.5 Administrator

**JTBD-AD1:** When operating the restaurant, I want to manage menu availability and order progression from one controlled interface.

**JTBD-AD2:** When managing access, I want to review users and delivery applicants without exposing privileged credentials or exceeding my role.

**JTBD-AD3:** When evaluating performance, I want metrics derived from production data and clearly labeled time ranges.

## 5. Current-State Classification

Classification reflects repository evidence, not production verification.

| Area | Classification | Evidence / qualification |
| --- | --- | --- |
| Public landing | Implemented, partially functional | Links to menu/auth exist; some CTAs and contact content require validation in `src/components/landing/LandingV1.tsx` |
| Public menu display | Live data surface | Menu/category fetching exists; item rendering and add-to-cart exist |
| Menu search | Prototype UI | Input has no demonstrated filtering handler in `src/components/menu/Menu.tsx` |
| Menu category/filter controls | Incomplete | Category controls are commented out; filter button has no demonstrated behavior |
| Cart | Implemented client state | Zustand persistence in `src/stores/cart.store.ts` |
| Checkout | Implemented but unsafe | Direct client writes, client totals, and non-atomic order/item inserts |
| Customer auth | Substantially implemented | Password, Google OAuth, reset flows exist; policy consistency remains unresolved |
| Customer onboarding | Implemented with validation gaps | Multi-step route flow exists; TODO markers remain |
| Customer order history | Partially functional | Data and status UI exist; tracking and reorder are incomplete |
| Customer profile | Partially functional | Profile/password/session surfaces exist; password rules differ |
| Delivery application | Partial | Form, tracking, admin review, and completion surfaces exist; route and submission inconsistencies remain |
| Courier workflows | Partial | Dashboard, queue, active delivery, history, map/profile surfaces exist |
| Admin menu | Mixed live/prototype | CRUD components exist; some sample/static row presentation remains |
| Admin orders | Partially functional | Listing and status management exist; canonical transitions and payment semantics are absent |
| Admin users | Partially functional, unsafe privileged APIs | Create/delete routes use service role without demonstrated authorization |
| Admin delivery requests | Partially functional | Search/filter/review surfaces exist |
| Admin analytics | Static prototype | Hard-coded revenue, order, AOV, customer, and chart values in `src/components/admin/Dashboard.tsx`; `src/api/admin.dashboard.ts` is empty |
| Delivery metrics | Mixed | Some queries exist, while displayed metrics require source and definition validation |
| Payment | Not implemented | Payment-related visual labels/icons do not establish payment processing |
| PWA | Configured, incomplete UX | Manifest/service worker configured; install prompt commented out in `src/app/layout.tsx` |
| Dark mode | Not implemented as user-selectable feature | Requirement exists in project context, but no complete toggle/persistence is evidenced |
| Newsletter | Prototype UI | Email field/button have no demonstrated submission integration |
| Table booking | Data/prototype residue, out of MVP | `reservations` appears in generated types; `/book` link has no matching route |
| Tests | Not evidenced | No test script or repository test suite found in inspected project metadata |
| Database migrations/RLS | Not evidenced | No SQL migrations or policy definitions found in the repository snapshot |

## 6. Goals and Success Metrics

All numerical targets below are **Proposed** until product, operations, and engineering approve definitions and instrumentation.

### 6.1 MVP Goals

1. Secure all privileged and role-based operations.
2. Make order creation atomic, idempotent, and server-authoritative.
3. Provide a complete menu-to-delivery journey for the canonical operating market.
4. Give admins and couriers reliable operational controls using a shared status model.
5. Establish measurable product and reliability baselines.

### 6.2 Proposed Success Metrics

| Metric | Proposed target | Measurement notes |
| --- | --- | --- |
| Privileged endpoint authorization | 100% of privileged endpoints authenticated and role-authorized | Automated negative and positive integration tests |
| Service secret exposure | 0 secrets in client bundles, responses, logs, or source control | CI secret scan plus runtime log review |
| Order write consistency | 100% of accepted orders have valid order items and server-calculated totals | Database invariant query and integration tests |
| Duplicate order rate | <0.1% of checkout attempts | Idempotency key analysis; exclude deliberate repeat purchases |
| Checkout technical success | >=98% of valid submission attempts | `order_submit_succeeded / order_submit_started` |
| Menu-to-order conversion | Baseline first; **Proposed** >=8% within 90 days | Unique authenticated/anonymous sessions, consent-aware |
| Checkout completion | **Proposed** >=70% from checkout start | Segment auth interruption and address errors |
| Order acceptance latency | **Proposed** p90 <=5 minutes during open hours | Created to confirmed/preparing transition |
| Fulfillment completion | **Proposed** >=95% of accepted orders reach delivered | Exclude test orders; cancellation reasons required |
| Status freshness | **Proposed** 95% of operational transitions visible within 10 seconds | Requires realtime or bounded polling |
| Core API availability | **Proposed** >=99.9% monthly | Auth, menu read, order create/read/update |
| Core Web Vitals | **Proposed** p75 good for LCP, INP, and CLS | Mobile field data by primary geography |
| Accessibility | 0 known critical/serious WCAG 2.2 AA violations at release | Automated scan plus keyboard/screen-reader checks |
| Support contact rate | Baseline first; **Proposed** <5% of fulfilled orders | Categorize order/status/address/payment issues |

## 7. Scope and Priorities

Priority definitions:

- **P0:** Required for MVP launch or to remove material security/data-integrity risk.
- **P1:** High-value post-stabilization capability.
- **P2:** Later optimization, expansion, or experiment.

### 7.1 MVP / P0 Public Scope

- Responsive public landing with working navigation and accurate operating claims.
- Public menu with current item name, description, image, category, availability, and canonical price/currency.
- Functional menu search and category filtering.
- Add-to-cart from available items only.
- Clear links to login, customer registration, and delivery application.
- Valid legal/privacy/contact destinations required for launch.
- Graceful loading, empty, unavailable, and error states.

### 7.2 MVP / P0 Customer Scope

- Email/password registration and login.
- Google OAuth login, subject to approved provider configuration.
- Password recovery and reset.
- Customer onboarding for identity/contact and one or more delivery addresses.
- Persistent cart across auth transition on the same device.
- Quantity update, removal, subtotal, fee, tax if applicable, and server-confirmed total.
- Authenticated checkout with supported address validation.
- Atomic, idempotent order submission.
- Confirmation with order identifier and summary.
- Current and historical orders with canonical status labels.
- Profile, address, and password management.
- Customer-visible cancellation only where operations policy permits.

### 7.3 MVP / P0 Delivery Scope

- Public delivery application form with validation and consent.
- Non-guessable application tracking reference or authenticated tracking.
- Pending, approved, and rejected application status.
- Admin-controlled approval before courier access.
- Courier role protection across all courier routes and APIs.
- Availability state.
- Eligible delivery queue.
- Atomic claim/assignment of an eligible order.
- Active delivery details, destination, and permitted contact information.
- Controlled pickup, out-for-delivery, and delivered transitions.
- Courier delivery history.

### 7.4 MVP / P0 Admin Scope

- Admin-only route and API access.
- Menu category and item create, update, availability toggle, and delete/archive policy.
- Order list, detail, search/filter, and valid status actions.
- User list and safe role/status management.
- Safe admin-mediated user creation/deactivation only if operationally required.
- Delivery application review, approve, and reject.
- Courier account activation tied to approved application.
- Audit records for privileged actions.
- Minimal operational dashboard using real data or explicitly labeled unavailable modules.

### 7.5 P1 Roadmap

- Real-time customer status tracking and courier location where legally and operationally approved.
- Reorder from an eligible historical order with current-price/availability review.
- Online payment through an approved provider, including refund and webhook handling.
- Production admin analytics with date filters and metric definitions.
- Delivery performance metrics with transparent calculation rules.
- User-selectable dark mode with persisted preference.
- Mounted, tested, dismissible PWA install experience.
- Notification channels for order and delivery-application changes.
- Saved address management improvements and delivery instructions.
- Arabic content quality pass and localization architecture for a second language.

### 7.6 P2 Roadmap

- Promotions, vouchers, loyalty, and referrals.
- Newsletter subscription and consent management.
- Scheduled orders.
- Advanced menu personalization and recommendations.
- Advanced courier dispatch and route optimization.
- Table booking, only if Berlin Food expands into dine-in operations.
- Multi-brand, multi-restaurant, or marketplace support.
- Advanced experimentation and segmentation tooling.

## 8. Explicit Non-Goals for MVP

- Multi-restaurant marketplace discovery or commissions.
- Multi-brand tenancy.
- Native iOS or Android applications.
- Cashless payment processing unless promoted into P0 by an approved market requirement.
- Continuous live courier GPS tracking.
- Route optimization or fleet scheduling.
- Loyalty, referral, voucher, or promotion engines.
- Table reservations.
- Newsletter marketing automation.
- Customer reviews of menu items.
- Complex inventory or kitchen display management.
- Multi-currency checkout.
- Full business-intelligence warehouse or predictive analytics.

## 9. Functional Requirements

### 9.1 Public and Menu

| ID | Priority | Requirement |
| --- | --- | --- |
| PUB-001 | P0 | Guests shall access landing and menu routes without authentication. |
| PUB-002 | P0 | All public navigation and CTAs shall resolve to an implemented route, valid anchor, or approved external destination. |
| PUB-003 | P0 | Public claims about delivery area, opening hours, fees, taxes, contact details, and timing shall come from approved business configuration or content. |
| PUB-004 | P0 | The menu shall display only customer-visible categories and items. |
| PUB-005 | P0 | Each item shall show name, description when available, image/fallback, availability, and price in the canonical currency. |
| PUB-006 | P0 | Search shall filter by approved searchable fields, at minimum item name, with clear no-results behavior. |
| PUB-007 | P0 | Category controls shall filter the menu and provide an accessible all-items state. |
| PUB-008 | P0 | Unavailable items shall not be addable to cart. |
| PUB-009 | P1 | The system may show operating-hours or temporary-closure messaging without falsely implying checkout is available. |
| PUB-010 | P2 | Menu recommendations may be personalized only after analytics/privacy requirements are satisfied. |

### 9.2 Authentication and Onboarding

| ID | Priority | Requirement |
| --- | --- | --- |
| AUT-001 | P0 | Customers shall register with email/password using one canonical password policy enforced by UI and Supabase configuration. |
| AUT-002 | P0 | Customers shall log in with email/password and receive non-enumerating error messages. |
| AUT-003 | P0 | Google OAuth shall use allowlisted redirect URLs and create/link a valid customer profile. |
| AUT-004 | P0 | Password reset links shall expire and redirect only to approved origins. |
| AUT-005 | P0 | Registration shall never permit a user to self-assign admin or courier privileges. |
| AUT-006 | P0 | Profile creation shall be transactional or recoverable when auth signup succeeds but profile creation fails. |
| AUT-007 | P0 | Onboarding shall validate required identity, phone, and address fields before progression. |
| AUT-008 | P0 | A guest reaching checkout shall be prompted to authenticate, with cart contents preserved on success. |
| AUT-009 | P0 | Logout shall invalidate the local session and remove access to protected data. |
| AUT-010 | P1 | Customers may view and revoke active sessions after security behavior is validated. |

### 9.3 Cart and Checkout

| ID | Priority | Requirement |
| --- | --- | --- |
| CRT-001 | P0 | The cart shall support add, remove, increment, and decrement actions with quantity >=1. |
| CRT-002 | P0 | The cart may persist locally, but persisted item prices shall be treated as display hints, not authoritative prices. |
| CRT-003 | P0 | Checkout shall require an authenticated customer role. |
| CRT-004 | P0 | Checkout shall require a selected, valid, supported delivery address. |
| CRT-005 | P0 | The server shall reload item availability and price from the database at submission time. |
| CRT-006 | P0 | The server shall calculate subtotal, discounts if any, tax, fee, and total using canonical configuration. |
| CRT-007 | P0 | The system shall return a clear price-change or unavailable-item response before order acceptance. |
| CRT-008 | P0 | Order and order-item creation shall occur in one database transaction/RPC. |
| CRT-009 | P0 | Checkout shall use an idempotency key so retries cannot create duplicate orders. |
| CRT-010 | P0 | The client shall disable repeated submission while a request is pending but shall not rely on that control for idempotency. |
| CRT-011 | P0 | The cart shall clear only after durable server confirmation of order creation. |
| CRT-012 | P0 | The confirmation shall show order ID, items, total, address summary, and initial status. |
| CRT-013 | P1 | Payment selection and authorization shall be added only with an approved payment design and provider. |

### 9.4 Orders and Customer Service

| ID | Priority | Requirement |
| --- | --- | --- |
| ORD-001 | P0 | Customers shall read only their own orders and order items. |
| ORD-002 | P0 | Each order shall preserve a price snapshot and delivery-address snapshot used at purchase time. |
| ORD-003 | P0 | Order status shall use the canonical lifecycle in Section 10. |
| ORD-004 | P0 | Every status transition shall validate actor, source state, target state, and required fields. |
| ORD-005 | P0 | Current and past orders shall be classified consistently from canonical terminal states. |
| ORD-006 | P0 | Customers shall see localized labels and timestamps for their order status. |
| ORD-007 | P0 | Cancellation shall record actor, timestamp, and reason; eligibility is a TBD operating policy. |
| ORD-008 | P0 | Delivered status shall be set only through an authorized fulfillment action. |
| ORD-009 | P1 | Customers may rate a completed delivery once, with a value from 1 to 5 and abuse controls. |
| ORD-010 | P1 | Reorder shall build a new cart from currently available items and current prices; it shall not clone the prior total. |
| ORD-011 | P1 | Tracking shall show current state and approved ETA/location data, not a non-functional CTA. |

### 9.5 Delivery Applications and Couriers

| ID | Priority | Requirement |
| --- | --- | --- |
| DEL-001 | P0 | Applicants shall submit only the minimum approved identity, contact, vehicle, and consent fields. |
| DEL-002 | P0 | The system shall validate and rate-limit delivery applications. |
| DEL-003 | P0 | Tracking shall not disclose application data through guessable identifiers or broad email/phone lookup. |
| DEL-004 | P0 | Application statuses shall be `pending`, `approved`, or `rejected`. |
| DEL-005 | P0 | Only admins shall approve or reject applications. |
| DEL-006 | P0 | Approval shall create or activate a courier identity through a secure, auditable server workflow. |
| DEL-007 | P0 | Rejection shall not create courier access and shall retain data only for the approved retention period. |
| DEL-008 | P0 | Only approved couriers shall access delivery routes and data. |
| DEL-009 | P0 | Couriers shall set availability without altering role or approval state. |
| DEL-010 | P0 | Only dispatchable orders shall appear in the available-delivery queue. |
| DEL-011 | P0 | Claiming an order shall be atomic and shall fail cleanly if another courier has claimed it. |
| DEL-012 | P0 | A courier shall read customer contact/address data only for an actively assigned order and only as needed for delivery. |
| DEL-013 | P0 | Couriers shall progress only their assigned order through permitted states. |
| DEL-014 | P0 | Delivery completion shall capture timestamp and actor; proof-of-delivery policy is TBD. |
| DEL-015 | P1 | Courier dashboard metrics shall be calculated from real data with documented definitions. |

### 9.6 Administration

| ID | Priority | Requirement |
| --- | --- | --- |
| ADM-001 | P0 | Every admin page, server action, route handler, database function, and policy shall verify an authenticated admin role. |
| ADM-002 | P0 | Service-role credentials shall remain server-only and shall never be logged or returned. |
| ADM-003 | P0 | Admin user create/delete/deactivate operations shall validate input, authorize the actor, rate-limit requests, and write an audit record. |
| ADM-004 | P0 | Hard deletion of users shall follow an approved retention and referential-integrity policy; deactivation is the proposed default. |
| ADM-005 | P0 | Admins shall create and update menu categories and items with validated names, prices, images, and availability. |
| ADM-006 | P0 | Menu deletion shall not corrupt historical order-item snapshots. |
| ADM-007 | P0 | Admins shall list, search, filter, inspect, and progress orders through permitted transitions. |
| ADM-008 | P0 | Admin order views shall use the canonical currency and status vocabulary. |
| ADM-009 | P0 | Admins shall list and decide delivery applications with confirmation for irreversible actions. |
| ADM-010 | P0 | Static analytics shall be removed, connected to real data, or visibly labeled as demo data and excluded from launch operations. |
| ADM-011 | P0 | Admin actions affecting access, money, menu availability, or order state shall be auditable. |
| ADM-012 | P1 | Admin analytics shall support approved metric definitions and date ranges. |

### 9.7 Platform and PWA

| ID | Priority | Requirement |
| --- | --- | --- |
| PLT-001 | P0 | The application shall provide consistent loading, empty, error, offline-safe, and not-found states for critical routes. |
| PLT-002 | P0 | Service-worker caching shall not expose one user's protected content to another user on a shared device. |
| PLT-003 | P0 | New deployments shall prevent stale clients from submitting incompatible order payloads. |
| PLT-004 | P1 | The PWA install prompt shall be mounted only after cross-browser testing and shall be dismissible. |
| PLT-005 | P1 | Offline behavior shall clearly distinguish cached browsing from actions that require connectivity. |

## 10. Canonical Proposed Order Lifecycle

The following lifecycle is **Proposed** and requires product, kitchen operations, delivery operations, and engineering approval before implementation.

### 10.1 Canonical States

| State | Meaning | Typical actor |
| --- | --- | --- |
| `pending` | Order was transactionally created and awaits restaurant acceptance | System |
| `confirmed` | Restaurant accepted the order | Admin/restaurant operator |
| `preparing` | Kitchen preparation is in progress | Admin/restaurant operator |
| `ready_for_pickup` | Order is prepared and eligible for courier pickup/assignment | Admin/restaurant operator |
| `assigned` | Exactly one courier is assigned but pickup is not confirmed | Courier or dispatcher |
| `out_for_delivery` | Courier confirmed possession and is delivering | Assigned courier |
| `delivered` | Delivery is completed | Assigned courier; confirmation policy TBD |
| `cancelled` | Order will not be fulfilled | Authorized customer/admin/system per policy |
| `rejected` | Restaurant declined before preparation | Admin/restaurant operator |

### 10.2 Permitted Transitions

- `pending -> confirmed`
- `pending -> rejected`
- `pending -> cancelled`
- `confirmed -> preparing`
- `confirmed -> cancelled` only under approved exception policy
- `preparing -> ready_for_pickup`
- `preparing -> cancelled` only under approved exception policy
- `ready_for_pickup -> assigned`
- `assigned -> ready_for_pickup` only through an explicit unassign workflow
- `assigned -> out_for_delivery`
- `out_for_delivery -> delivered`
- Any additional recovery transition requires a documented admin override and audit event.

### 10.3 Terminal States

- `delivered`
- `cancelled`
- `rejected`

### 10.4 Migration Note

Current code and generated types use inconsistent values including `pending`, `preparing`, `ready`, `on_the_way`, and `out_for_delivery`; the generated enum does not fully match runtime writes. Before launch, existing data must be inventoried and mapped to the approved canonical states using a reviewed migration. No silent coercion should occur in the client.

## 11. Roles and Authorization Matrix

This is the **Proposed** minimum authorization model. Database RLS and server-side checks must enforce it; navigation visibility alone is insufficient.

Legend: `R` read, `C` create, `U` update, `A` approved action, `-` no access.

| Resource / action | Guest | Customer | Applicant | Approved courier | Admin |
| --- | --- | --- | --- | --- | --- |
| Public landing/menu | R | R | R | R | R |
| Own auth session | C | R/U | R/U if account-based | R/U | R/U |
| Customer profile | - | R/U own | - | - | R; U only by policy |
| Customer address | - | C/R/U own | - | - | R only for support need |
| Cart | Local | C/R/U own | - | - | - |
| Order creation | - | C own | - | - | C only if assisted-order policy exists |
| Order read | - | R own | - | R assigned minimum | R all |
| Customer cancellation | - | A own eligible | - | - | A per policy |
| Operational order transitions | - | - | - | A assigned subset | A restaurant subset |
| Delivery application | C | C if eligible | R own status | R own historical | R/U decision |
| Available delivery queue | - | - | - | R approved/available | R |
| Delivery claim | - | - | - | A atomic | A dispatch if enabled |
| Courier profile/availability | - | - | - | R/U own | R/U status |
| Menu management | - | - | - | - | C/R/U/archive |
| User administration | - | - | - | - | A |
| Analytics | - | - | - | R own approved metrics | R operational metrics |
| Audit logs | - | - | - | - | R restricted admin |
| Service-role operations | - | - | - | - | Server workflow only; never direct client access |

## 12. UX, Design, and Content Requirements

### 12.1 Experience Direction

- Preserve the established premium, refined, warm-minimal visual language.
- Treat Berlin Food as the application/brand name, not as evidence of a physical restaurant in Berlin.
- Use tonal layering and whitespace instead of decorative section borders.
- Avoid stark black/white surfaces; use approved warm neutral tokens.
- Keep component radius restrained and consistent, with the existing round-eight direction as the baseline.
- Use Plus Jakarta Sans only if formally adopted and Arabic glyph support is validated; current implementation uses Cairo in `src/app/layout.tsx`.
- **TBD:** Approve the final bilingual type system rather than changing fonts based on project context alone.

### 12.2 Interaction Requirements

- Every control shall have a working outcome, disabled explanation, or be removed from release UI.
- Destructive actions shall require confirmation and show the affected entity.
- Submission states shall prevent ambiguity: idle, validating, submitting, succeeded, failed.
- Errors shall explain the recoverable next action without exposing internal or security details.
- Order status labels shall be consistent across customer, courier, and admin surfaces.
- Currency formatting shall use one locale-aware formatter and one canonical currency configuration.
- Dates and times shall use the approved operating timezone and localized display.

### 12.3 Accessibility

- Target WCAG 2.2 AA for all P0 journeys.
- All functionality shall be operable by keyboard without traps.
- Focus order and focus indicators shall remain visible in RTL layouts.
- Form controls shall have programmatic labels, instructions, and associated errors.
- Icon-only buttons shall have accessible names.
- Status shall not rely on color alone.
- Dialogs shall manage initial focus, focus containment, Escape behavior, and focus restoration.
- Images shall have useful alternative text or be marked decorative.
- Touch targets shall be at least 44 by 44 CSS pixels where practical.
- Motion shall respect `prefers-reduced-motion`.
- Automated scans shall be supplemented by keyboard and screen-reader checks.

### 12.4 Responsive Requirements

- P0 journeys shall support 320px mobile width through large desktop without horizontal page scrolling.
- Mobile is the primary customer and courier context; desktop is the primary admin context.
- Cart totals and primary checkout actions shall remain reachable without obscuring content.
- Dense admin tables shall transform into usable responsive rows, controlled horizontal regions, or task-specific detail views.
- Maps shall have a non-map address fallback and shall not block order completion when visual map rendering fails.
- Layout shall account for safe areas when installed as a PWA.

### 12.5 Localization

- Arabic RTL is **Confirmed** as the current product language through `lang="ar"` and `dir="rtl"` in `src/app/layout.tsx`.
- All P0 customer and courier copy shall be Arabic at launch unless a different launch language is approved.
- Mixed English strings, technical statuses, and currency symbols shall be normalized.
- Logical CSS properties and directional icons shall be validated in RTL.
- User-entered email, phone, order IDs, and numeric values may use LTR isolation within RTL layouts.
- **TBD:** Launch country, supported city/zone, timezone, currency, tax regime, phone format, address schema, and whether English ships at launch.

## 13. Data Entities and Integrations

### 13.1 Current Core Entities

Repository-generated types evidence these entities:

- `profiles`: identity, role, address, courier vehicle/availability/rating fields.
- `categories`: menu grouping.
- `menu_items`: item content, price, image, availability, category.
- `orders`: customer, courier, address, status, total, delivery rating.
- `order_items`: order, menu item, quantity, and price fields.
- `delivery_requests`: applicant identity/contact and decision status.
- `reservations`: generated type exists but is outside MVP.
- `order_info` and `orders_with_profiles`: database views.
- `add_delivery_rating` and `health`: database functions.

Source: `src/types/database.types.ts`.

### 13.2 Proposed Required Data Additions or Constraints

These are requirements, not claims about the current database:

- Constrained profile role enum: `customer`, `courier`, `admin`.
- Constrained canonical order status enum.
- Currency code on order or globally immutable launch configuration.
- Integer minor-unit money representation or reviewed exact numeric strategy.
- Server-generated subtotal, fee, tax, discount, and total snapshots.
- Address snapshot with normalized fields and coordinates where applicable.
- Idempotency key unique per customer/order attempt.
- Status-history/audit entity with actor, source, target, timestamp, and reason.
- Admin audit log for privileged user/menu/application operations.
- Cancellation/rejection reason codes.
- Optional payment intent/reference only when payment enters scope.
- Created/updated timestamps and appropriate foreign keys/indexes.
- Explicit retention/deletion behavior for profiles, applications, orders, and logs.

### 13.3 Integrations

| Integration | Current evidence | MVP requirement |
| --- | --- | --- |
| Supabase Auth | Email/password, Google, reset APIs | Harden redirect rules, role assignment, session behavior, and admin operations |
| Supabase Postgres/API | Main domain persistence | Versioned migrations, constraints, RLS, transactional RPCs, backups |
| Supabase Storage | Storage helper and remote image host | Validate upload authorization, file types, size limits, and lifecycle |
| Google OAuth | Client flow in `src/api/auth.ts` | Approved credentials, consent screen, allowlisted origins/redirects |
| Maps | Google Maps and Leaflet dependencies/components | **TBD:** choose one supported provider; secure keys and define fallback |
| PWA/Workbox | `@ducanh2912/next-pwa` config | Safe cache policy and update strategy |
| Analytics | Not established | Select consent-aware product analytics and error monitoring |
| Payment | Not established | Out of MVP unless promoted; provider is TBD |
| Notifications | Not established | P1; channel/provider/consent are TBD |

## 14. Non-Functional Requirements

### 14.1 Security and Privacy

- **SEC-001 P0:** Remove service-role key logging immediately and rotate the key if it has entered any accessible log.
- **SEC-002 P0:** Protect create-user and delete/deactivate-user routes with verified admin authentication and authorization.
- **SEC-003 P0:** Inventory every privileged route, server action, function, storage bucket, and table policy.
- **SEC-004 P0:** Implement and test deny-by-default RLS for user-owned and role-scoped data.
- **SEC-005 P0:** Keep service credentials server-only and fail startup/deployment when required secrets are missing.
- **SEC-006 P0:** Validate all untrusted request data with a shared schema strategy before database or auth calls.
- **SEC-007 P0:** Rate-limit auth, password reset, delivery application tracking, checkout, and privileged mutation endpoints.
- **SEC-008 P0:** Apply CSRF-safe patterns to cookie-authenticated mutations and validate request origin where appropriate.
- **SEC-009 P0:** Return least-privilege fields; couriers shall not receive customer data outside active assignments.
- **SEC-010 P0:** Redact tokens, keys, passwords, full addresses, and unnecessary personal data from logs.
- **SEC-011 P0:** Define privacy notice, consent basis, retention periods, account deactivation/deletion handling, and data-access process for the approved jurisdiction.
- **SEC-012 P0:** Run dependency, secret, static, authorization, and abuse-case reviews before launch.
- **SEC-013 P0:** Store audit logs so application actors cannot silently alter privileged-action history.
- **SEC-014 P1:** Add MFA for admin accounts; **Proposed** as mandatory before broad admin access.

### 14.2 Data Integrity

- **DAT-001 P0:** Create an order and its items in one server-controlled database transaction.
- **DAT-002 P0:** Calculate all monetary values from canonical menu/configuration data on the server.
- **DAT-003 P0:** Enforce positive quantities, valid prices, foreign keys, and allowed statuses in the database.
- **DAT-004 P0:** Make order claim and status changes conditional/atomic to prevent races.
- **DAT-005 P0:** Introduce version-controlled, reviewed database migrations and generated-type update procedure.
- **DAT-006 P0:** Reconcile existing production-like data before enforcing new constraints.

### 14.3 Performance

- **PER-001 P0:** Proposed mobile p75 targets: LCP <=2.5s, INP <=200ms, CLS <=0.1 on supported networks/devices.
- **PER-002 P0:** Menu images shall use responsive sizing, optimized formats, stable dimensions, and approved hosts.
- **PER-003 P0:** Menu and operational list queries shall be bounded and paginated where data can grow.
- **PER-004 P0:** Database indexes shall support user order history, status queues, courier assignment, and admin filters.
- **PER-005 P0:** Loading states shall not cause major layout shift or duplicate mutations.
- **PER-006 P1:** Define cache revalidation for public menu data without serving stale availability at checkout.

### 14.4 Reliability and Recovery

- **REL-001 P0:** Critical mutations shall be idempotent or safely retryable.
- **REL-002 P0:** The system shall distinguish validation, authorization, conflict, unavailable, and server errors.
- **REL-003 P0:** Supabase backup/PITR capability and restoration procedure shall be documented and tested for the selected plan.
- **REL-004 P0:** Health checks shall validate only safe service readiness and expose no secrets.
- **REL-005 P0:** Error monitoring and alerting shall cover checkout failures, privileged endpoint failures, auth spikes, and order workflow conflicts.
- **REL-006 P0:** A rollback plan shall cover application deployment and database migrations.
- **REL-007 P1:** Proposed availability SLO is 99.9% monthly for core ordering APIs.

### 14.5 Maintainability and Quality

- TypeScript build errors shall not be ignored for production release; `ignoreBuildErrors: true` in `next.config.ts` must be removed after remediation.
- CI shall run lint, type-check, unit tests, integration tests, and critical end-to-end tests.
- Statuses, roles, money, geography, and route constants shall have one authoritative definition each.
- Database-generated types shall match the deployed schema.
- Critical business logic shall run on trusted server/database boundaries, not only in React components.

## 15. Analytics Event Plan

Analytics implementation is **Proposed** and depends on privacy/consent decisions. Events shall avoid raw email, phone, address, auth tokens, and free-text notes.

| Event | Trigger | Key properties |
| --- | --- | --- |
| `landing_viewed` | Landing route rendered | locale, device class, referrer category |
| `menu_viewed` | Menu data rendered | locale, item count, category count |
| `menu_search_used` | Debounced search committed | query length, result count; no raw query by default |
| `menu_category_selected` | Category filter changed | category_id |
| `cart_item_added` | Item added | menu_item_id, quantity, displayed currency |
| `cart_item_removed` | Item removed | menu_item_id, quantity |
| `checkout_started` | Checkout intent begins | item count, auth state |
| `checkout_auth_required` | Guest is interrupted for auth | source route |
| `checkout_validation_failed` | Local/server validation fails | reason code, field category |
| `order_submit_started` | Server request starts | item count, idempotency attempt number |
| `order_submit_succeeded` | Durable order accepted | order_id pseudonymous, total band, currency |
| `order_submit_failed` | Submission fails | reason code, retryable flag |
| `order_status_changed` | Authorized transition commits | source status, target status, actor role |
| `order_cancelled` | Cancellation commits | actor role, reason code, prior status |
| `delivery_application_submitted` | Valid application accepted | vehicle type, source channel |
| `delivery_application_decided` | Admin decision commits | outcome, decision latency band |
| `courier_availability_changed` | Courier toggles availability | availability state |
| `delivery_claim_attempted` | Courier attempts claim | order status, outcome/conflict |
| `delivery_completed` | Delivered transition commits | fulfillment duration band |
| `admin_menu_mutated` | Menu/category mutation commits | action, entity type, availability change |
| `auth_flow_completed` | Login/register/OAuth/reset succeeds | flow, role, provider |
| `auth_flow_failed` | Auth flow fails | flow, normalized reason code |

### 15.1 Analytics Governance

- Define event owners, schemas, retention, and dashboards before collection.
- Generate operational metrics from transactional data where correctness matters; do not rely solely on client analytics.
- Version breaking event-schema changes.
- Exclude test/admin traffic where appropriate.
- Provide consent controls required by the approved launch jurisdiction.

## 16. Dependencies and Assumptions

### 16.1 Confirmed Dependencies

- Next.js 16.2.1 and React 19.2.4.
- Supabase Auth, database/API, and likely Storage.
- Zustand for persisted cart state.
- Tailwind CSS 4.
- Mapping libraries/providers currently include Google Maps and Leaflet.
- PWA tooling uses `@ducanh2912/next-pwa`.

### 16.2 Assumptions Requiring Validation

- Berlin Food operates one brand/menu and one operational organization at MVP.
- Delivery is fulfilled by approved couriers managed through this product.
- Customer ordering requires authentication before final submission.
- A single currency and tax model will be selected for MVP.
- Admin users are a small trusted internal group.
- Supabase remains the system of record for MVP.
- Cash or payment-on-delivery may be the initial method if online payment remains out of scope; **TBD and not a fact**.
- The current database may exist outside repository-managed migrations; it must be inventoried before schema work.

## 17. Risks and Mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Unauthorized service-role user creation/deletion | Critical | Disable or protect routes immediately; verify admin role server-side; rotate exposed key; add tests and audit logs |
| Service key present in logs | Critical | Remove logging, rotate key, purge accessible logs where supported, scan repository/deployments |
| Client-tampered price or total | Critical | Server-authoritative pricing and transactional order RPC |
| Partial order with missing items | Critical | Single database transaction and invariant monitoring |
| Duplicate checkout retries | High | Customer-scoped idempotency key and unique constraint |
| Missing or permissive RLS | Critical | Policy inventory, deny-by-default design, automated role matrix tests |
| Courier double-claim race | High | Conditional atomic assignment in database |
| Status mismatch breaks operations | High | Approve canonical lifecycle, migrate data, constrain values, centralize labels |
| Currency/geography mismatch misleads customers | High | Decide launch market and centralize currency, tax, zone, timezone, phone/address rules |
| Dead links and inert controls erode trust | Medium | Route/link audit; implement, disable with explanation, or remove before release |
| Static analytics used as real data | High | Replace with real queries or remove/label demo modules |
| PWA caches sensitive/stale data | High | Review Workbox strategy, exclude protected/API responses, test shared-device logout/update |
| Build hides type errors | High | Remove production type-error bypass and gate CI |
| No migration history impedes recovery | High | Adopt versioned migrations, staging rehearsal, schema diff, backup/restore test |
| No test suite permits regressions | High | Add risk-based unit, integration, RLS, and end-to-end coverage |
| Unapproved personal-data handling | High | Privacy review, minimization, retention, consent, access controls, incident process |
| Design documentation gap causes inconsistency | Medium | Reconstruct and approve a compact design system from implementation/system diagram |

## 18. Release Gates and Phased Rollout

### 18.1 Gate 0: Immediate Containment

Launch remains blocked.

- Remove service-role key logging.
- Rotate the service-role key if exposure to logs cannot be ruled out.
- Disable or fully authorize privileged create/delete user routes.
- Confirm no service-role value appears in browser bundles, responses, source history, or accessible logs.
- Restrict production access to trusted internal users until containment is verified.

### 18.2 Gate 1: Security and Data Foundation

- Approved role and authorization model.
- Version-controlled schema baseline and migrations.
- Reviewed RLS/storage policies with automated cross-role tests.
- Atomic, server-authoritative, idempotent order creation.
- Atomic courier claim and constrained status transitions.
- Canonical roles/statuses/currency/geography/password configuration.
- Audit logging for privileged and order-state actions.
- Privacy and retention decisions documented.

### 18.3 Gate 2: Functional MVP Readiness

- All P0 flows meet acceptance criteria.
- Dead links and inert P0 controls resolved.
- Menu search/category controls functional.
- Checkout auth behavior explicit and tested.
- Admin, courier, and customer status views agree.
- Static operational metrics removed, labeled, or backed by real data.
- Arabic/RTL, responsive, accessibility, and error-state review complete.

### 18.4 Gate 3: Quality and Operations Readiness

- Lint, type-check, tests, and production build pass without ignored type errors.
- Critical end-to-end tests pass in a production-like environment.
- Security review and secret scan pass.
- Backup restore and rollback rehearsal pass.
- Monitoring, alerts, runbooks, support ownership, and incident contacts are active.
- Load/performance checks meet approved targets or have signed exceptions.

### 18.5 Phased Rollout

1. Internal staff smoke test with seeded/non-production orders.
2. Closed pilot with a small approved customer and courier cohort in one delivery zone.
3. Limited production launch with order-volume cap and staffed monitoring.
4. General availability only after pilot metrics and incidents are reviewed.
5. P1 capabilities released behind controlled flags or cohort rollout where practical.

### 18.6 Rollback Triggers

- Any unauthorized privileged action or cross-user data access.
- Any confirmed secret exposure.
- Material price/total mismatch.
- Duplicate, orphaned, or unfulfillable order spike.
- Order status corruption or widespread courier assignment conflict.
- Core checkout success materially below the approved threshold.

## 19. MVP Acceptance Criteria

### 19.1 Security and Authorization

- An unauthenticated caller receives `401` from every protected mutation.
- A non-admin authenticated caller receives `403` from every admin mutation, including user create/deactivate/delete.
- A customer cannot read or mutate another customer's profile, addresses, order, or order items through UI, API, or direct Supabase calls.
- A courier cannot read an unassigned customer's address/contact details.
- A courier cannot claim an ineligible or already assigned order.
- No service key or sensitive token appears in repository scans, client bundles, API responses, or application logs.
- RLS tests cover guest, customer A, customer B, approved courier, unapproved applicant, and admin.

### 19.2 Order Integrity

- Submitting a valid cart creates exactly one order and all expected line items in one committed transaction.
- If any line item fails validation, neither the order nor any item is committed.
- Modifying client-stored item prices or total cannot change the accepted server total.
- An unavailable or deleted menu item produces a clear conflict and no order.
- Repeating the same idempotency key returns the original result and does not create another order.
- Historical line-item names/prices remain intelligible after menu edits or archival according to the approved snapshot design.

### 19.3 Public and Customer Journey

- A guest can open the landing page and menu on mobile and desktop.
- Search and category filters produce correct results and accessible no-results states.
- Unavailable items cannot be added or submitted.
- A guest cart survives successful login/registration on the same supported device.
- Checkout cannot proceed without customer authentication and a supported address.
- Successful checkout shows a durable order ID and server-confirmed summary.
- Customer order history shows only the customer's orders and uses canonical localized statuses.
- All visible P0 links and CTAs resolve correctly.

### 19.4 Delivery Journey

- A valid applicant receives a safe tracking method after submission.
- An applicant cannot access courier routes before approval.
- Admin approval activates exactly one courier account through an auditable workflow.
- Two couriers attempting to claim one order result in exactly one assignment.
- The assigned courier can progress only through allowed states.
- Completing delivery updates customer, courier, and admin views consistently within the approved freshness target.

### 19.5 Admin Journey

- An admin can create/update/archive menu data and customer menu availability reflects the change under the approved cache policy.
- An admin can inspect and progress an order only through valid transitions.
- User deactivation preserves required order history and prevents future login/access as designed.
- Delivery application decisions are auditable.
- Dashboard values are real and definition-backed, or the dashboard clearly omits/unambiguously labels unavailable metrics.

### 19.6 Quality

- Production build, lint, type-check, and required automated tests pass in CI.
- Critical routes pass keyboard, screen-reader smoke, RTL, 320px mobile, tablet, and desktop checks.
- No critical or serious accessibility issues remain without an approved exception.
- Approved Core Web Vitals/performance targets are met in representative testing.
- Monitoring receives a test error and a test operational alert before launch.
- Rollback and database restore procedures have recorded rehearsal results.

## 20. Open Product Decisions

These questions block parts of final specification. They must be resolved explicitly rather than inferred from current strings or sample data.

### 20.1 Launch Market and Commerce

- **TBD:** What country, city/zone, and operating timezone launch first?
- **TBD:** What is the canonical currency? Current UI includes `$`, `EUR`, and Algerian dinar notation.
- **TBD:** Are displayed prices tax-inclusive, and what tax/fee rules apply?
- **TBD:** Is delivery fee fixed, zone-based, distance-based, or threshold-based?
- **TBD:** What payment methods ship at MVP: cash/payment-on-delivery, online payment, or both?
- **TBD:** What are minimum order, opening hours, closure, and service-area rules?

### 20.2 Order Operations

- **TBD:** Who accepts/rejects orders and what acceptance SLA is operationally realistic?
- **TBD:** When may customers cancel, and are fees/refunds involved?
- **TBD:** Is courier assignment self-claim, admin dispatch, or hybrid?
- **TBD:** What constitutes proof of pickup and proof of delivery?
- **TBD:** Can a courier hold more than one active delivery?
- **TBD:** What happens when no courier is available?
- **TBD:** Is customer delivery rating P0 or P1, and how are disputes handled?

### 20.3 Identity and Administration

- **TBD:** Must email be verified before ordering?
- **TBD:** What is the final password policy across signup, admin create-user, profile update, and reset?
- **TBD:** Is admin-created customer/courier identity operationally necessary, or can privileged create-user be removed?
- **TBD:** Should user removal mean deactivation, anonymization, or hard deletion under applicable law?
- **TBD:** Is admin MFA mandatory at MVP? This PRD proposes yes before broad admin access.
- **TBD:** What applicant checks and documents are legally/operationally required?

### 20.4 Experience and Platform

- **TBD:** Does English ship with Arabic, or is Arabic-only the MVP?
- **TBD:** Should Plus Jakarta Sans supplement Cairo, and which font owns Arabic display/body styles?
- **TBD:** Which mapping provider is canonical, and is map interaction required or optional address assistance?
- **TBD:** Should the PWA install prompt ship in MVP or P1?
- **TBD:** What notification channels are required for order changes?
- **TBD:** Is live courier location permitted and valuable enough for P1?
- **TBD:** Are table booking and newsletter concepts abandoned or retained for later validation?

### 20.5 Governance and Measurement

- **TBD:** Who owns menu accuracy, order operations, courier approvals, support, privacy, and security response?
- **TBD:** Which analytics/error-monitoring providers are approved?
- **TBD:** What consent, retention, and deletion rules apply in the launch jurisdiction?
- **TBD:** Which proposed success targets become release commitments after baseline measurement?

## 21. Product Approval Checklist

Before changing this document to `Approved`, named owners must confirm:

- Product approves MVP scope, non-goals, lifecycle, and success definitions.
- Operations approves market, hours, zones, fees, tax, cancellation, dispatch, and delivery rules.
- Engineering approves architecture, transaction boundaries, migration plan, and reliability targets.
- Security approves authorization, key rotation, RLS, audit, rate-limit, and test plans.
- Legal/privacy approves notices, consent, applicant/customer data, retention, deletion, and tracking practices.
- Design/content approves reconstructed design direction, Arabic copy, accessibility, and responsive behavior.
- Support approves customer-facing statuses, error handling, escalation paths, and launch staffing.

Until these approvals and all P0 release gates are complete, Berlin Food remains a pre-launch product and must not be represented as production-ready.
