# Kindred: actor and workflow audit

**Review date:** 31 October 2026  
**Scope:** Current local project, including the availability, location, and shop stock changes already present.  
**Deliverable:** Findings and proposed business behavior only. No application code, configuration, or stored business records were changed during this audit.

## 1. Assessment and limits

The project has several real workflows already. It supports program invitations, application approval, accepted-member task assignment, work-proof review, donated-stock reservation, partial resource approval, delivery acceptance, withdrawal before pickup, failed delivery, return, reassignment, and delivery verification. These should be retained and demonstrated.

The professor's criticism is still supported by the current behavior: many other journeys stop at **create a record → approve it → change a status**. They do not consistently explain the commitment, check eligibility, handle a change of mind, preserve partial work, assign responsibility for problems, or establish a trustworthy final outcome.

The most important improvement is to complete those journeys across actors, rather than add more forms or dashboard counters.

This was a read-only review of the current screens, actions, business rules, access rules, data relationships, and existing test scenarios. It was **not a fresh live end-to-end test of every branch**, a penetration test, or a production certification. “Confirmed defect” below means the defect is identifiable in the current implementation; it does not mean every scenario was reproduced in a running browser during this audit. Proposed policies are identified separately from defects. A claim of “no flaws” would require implementing agreed requirements and testing them against an explicit acceptance checklist.

### Finding labels

- **Defect:** Existing behavior is inconsistent, misleading, or can produce an incorrect outcome.
- **Gap:** A necessary continuation or decision point is absent from the reviewed workflow.
- **Policy:** The team must explicitly choose the business rule before implementing it.

### Priorities

- **P0:** Access, privacy, or trust failure that undermines all other workflows.
- **P1:** Broken journey, incorrect commitment, blocked recovery, or inconsistent business outcome.
- **P2:** Missing detail, coordination, or operational maturity.

These priorities are an assessment of this project, not a guarantee of exploitability or a formal security rating. They are not estimates of implementation effort.

## 2. The most important findings

1. **Program assignment ignores the new presence information.** Availability and current location appear in volunteer lists, but not in the program volunteer selector or delivery selector. There is no date, location, or workload compatibility check. An account being active is still treated as the relevant eligibility signal.
2. **Invitation acceptance is not sufficiently informed.** The invitation card provides the program name and role, then Accept/Decline. It does not provide a complete work brief, schedule, venue, supervisor, or commitment summary.
3. **Program withdrawal is missing.** Neither withdrawal of a pending application nor withdrawal after joining and doing partial work has a complete participant-facing flow.
4. **Cancelled membership can come back.** Loading approved applications can reactivate their membership, including a membership an administrator cancelled. Reading a list should never silently undo a cancellation.
5. **Program scheduling is incomplete.** The creation form has an end date, but its start date is assigned automatically. There are no shifts, reporting times, or invitation deadlines.
6. **Progress reporting can become blocked by completed work.** Once one subtask is at 100%, the progress dialog includes it, and saving rejects the entire draft because it contains a value of 100 or more.
7. **Emergency confirmations overstate what occurred.** The success page claims nearby organizations were notified, names three organizations, and gives a 15–30 minute response estimate; the submission flow does not establish those outcomes.
8. **Resource approval can reserve unsuitable stock.** Available stock is checked by organization and quantity, but the chosen inventory does not have to match the requested item or unit.
9. **Replacement assignment can bypass approval.** A requested replacement can move directly to volunteer assigned, with no volunteer acceptance or failed-return recovery comparable to the newer delivery flow.
10. **Some promises conflict with the actual demo.** Donation screens advertise monthly contributions and tax receipts, while the current donation flow records one-time demo contributions and explicitly does not issue tax receipts.
11. **Access protection is inconsistent.** Some user-management operations validate a real session, while many operational workflows trust caller-supplied role and identity headers. Several read and write operations also lack record ownership checks.
12. **Results and evidence are inconsistent.** Some analytics are static examples; program progress, subtask progress, completion certificates, stock summaries, and status counts do not all use the same definitions.

## 3. Coverage: actors and workflow families

This inventory covers the principal journeys exposed in the current project. “Partial” means there are useful steps already, but the journey or its exceptions are incomplete.

| Actor(s) | Workflow reviewed | Present today | Main unfinished part |
|---|---|---|---|
| Visitor | Discover organizations and programs | Public listing approval, directory, program cards | Detailed commitment information and meaningful location/date discovery |
| All registering actors | Registration and verification | Role forms, simulation verification, pending/approved accounts | Consistent alternate entry forms, durable recovery from partial registration |
| Platform admin, organization admin | Organization onboarding | Account approval, organization approval, bank setup, public listing review | One coherent onboarding checklist and rejection/resubmission journey |
| Platform admin, seller | Seller onboarding | User registration and separate seller profile, approval action | Partner selection, organization consent, synchronized approval and readiness |
| All account holders | Sign-in, recovery, profile maintenance | Sign-in and security-question recovery | Consistent self-service editing, session lifecycle and identity enforcement |
| Organization admin | Program planning | Description, location, end date, skills, volunteer goal | Selectable start date, shifts, contacts, milestones, closure |
| Organization admin, volunteer | Direct program invitation | Pending invitation and accept/decline | Presence-aware selection, full brief, expiry, withdrawal, handover |
| Community actors, organization admin | Public application | Submission and approve/reject | Application withdrawal, reapplication, decision reason, reliable membership state |
| Organization admin, volunteer | Tasks and subtasks | Accepted-member assignment, progress, proof | Task acceptance, blockers, schedules, handover, consistent progress rules |
| Volunteer, reviewer | Hours and recognition | Hours submission, proof, approve/reject, printable certificate view | Attendance linkage, duplicate/overlap checks, credible certificate eligibility |
| Organization admin, volunteer | Open volunteer requests | Slot counts and accept/reject response | Connected request creation/management and visibility after the last slot fills |
| Beneficiary, organization admin | General assistance | Submission, accept, assign, resolve | Responsible organization claim, consent, cancellation, timelines and appeals |
| Visitor, responder | Emergency assistance | Public submission and photo | Honest confirmation, triage, routing, tracking and escalation |
| Visitor, all signed-in actors, admin | Contact and feedback | Shared inbox storage | Reachable submission for appropriate actors, reply and resolution loop |
| Donor, organization admin | Monetary donation | Demo card contribution, history, appreciation certificate | Accurate promises, recurring-policy decision and utilization reporting |
| Donor, organization admin, volunteer | In-kind donation and collection | Pickup request, collection offer, proof, usable receipt | Donor changes, agreed scheduling, item quality, receipt adjustment |
| Organization admin | Inventory management | Received/reserved/distributed/available counts | Units, suitability, expiry, damage, transfers and adjustments |
| Beneficiary, organization admin | Resource request | Approve, partial approve, information request, wait for stock | Beneficiary cancellation, unmet remainder and issue resolution |
| Volunteer, seller, organization admin, recipient | Shared deliveries | Offer, accept, pickup, transit, proof, failure, return, reoffer | Pre-accept area/time details, exact pickup, expiry, notifications and disputes |
| Seller, platform admin | Product listing and moderation | Pending listing, approve/reject, edit, stock | Seller readiness, owned edits, material-change review, review reasons |
| Buyer, seller, volunteer | Shop checkout and fulfillment | Stock decrement, order, delivery tracking, out-of-stock card | Delivery promise, order cancellation, buyer history across roles, refund policy |
| Buyer, reviewer, seller, volunteer | Replacement | Photo request, approve/reject, assignment, return/in-transit/replaced | Approval bypass, acceptance, stock, duplicate claims, failure and appeal |
| Platform admin | Platform requests and governance | Request approve/reject and management tables | Approval changing the actual business object, evidence, suspension and archives |
| All actors | Notifications, audit and reporting | In-app notification polling, selected histories and counters | Complete event coverage, per-recipient read state, reliable metrics |

## 4. Detailed findings

### A. Program planning, assignment and participation

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| P01 | P1 · Gap | The program form exposes an end date but no selectable start date. Creation uses today's date; editing retains the stored start date. Future programs therefore cannot be planned accurately through this form. | Collect start/end dates, reporting time, shift duration and time zone where relevant. Validate end after start, task dates within the program, and changes to accepted commitments. |
| P02 | P1 · Gap | Programs have a general description and free-text location, but no structured role brief, supervisor, meeting point, expected hours, deliverables, equipment or training information. A description alone does not establish what a volunteer is agreeing to do. | Provide a clear program brief: organizer profile, purpose, work, role requirements, dates/shifts, venue, contact, expected output and support arrangements. Make required versus optional information explicit. |
| P03 | P1 · Gap | Program volunteer choices show name, email, organization and skills. Delivery choices show name/email. The newly added available-now flag, current location and freshness are not included in those decision points. | Put presence and location beside the selection, with update time. Separately ask whether the person can attend the proposed program location and dates. “Available now” must not be mistaken for “available next week.” Allow a reasoned override rather than automatically rejecting all people currently unavailable. |
| P04 | P2 · Gap / Policy | Availability is self-reported free text plus a toggle. A person can remain marked available indefinitely; there is no travel radius, dated commitment, recurring shift time, calendar conflict, or workload check. Collected availability days are not integrated into program assignment. | Define freshness and expiry rules, planned availability, travel willingness, and overlapping commitments. Use “location self-reported” language unless separately verified. A map or continuous GPS tracking is not required to solve this. |
| P05 | P1 · Gap | Direct invitation cards offer Accept/Decline with the program name and role. The card does not present the complete program details or a clear linked brief before commitment. This is especially problematic for private programs that cannot be discovered in the public directory. | Add a pre-accept review with organizer details, schedule, venue, work, contact and a way to ask a question. Record the version of the brief accepted and show any later material changes. |
| P06 | P1 · Gap | Applicants can submit a join request, but cannot withdraw a pending application. The permanent “already applied” check also prevents a clean reapplication after rejection. | Add withdraw-pending, decision reasons, and a documented reapplication policy. Preserve the original application and decisions. Reapplication should be a new attempt or an explicitly reopened request. |
| P07 | P1 · Gap | Accepted program members have no complete leave/withdraw flow, either before starting or after partial work. Admin cancellation of membership is not a participant withdrawal process. | Before work starts: withdraw with reason and release the slot. After work starts: request withdrawal, record completed work/hours, list open tasks/materials, arrange handover, and confirm the final departure. Keep earned credit and prior history. |
| P08 | P1 · Defect | Approved applications are used to force membership back to active when application lists are loaded. Cancelling that membership can therefore be undone by a later list read. Rejecting an already approved application also does not reconcile its active membership. | Make application decisions and membership transitions explicit and consistent. A completed approval must not repeatedly reactivate someone. Cancellation/withdrawal must remain final unless a new authorized invitation or rejoin decision occurs. |
| P09 | P1 · Gap / Policy | The volunteer goal is stored, but application approval and invitations do not enforce a capacity policy. There is no application deadline, waitlist, invitation expiry or automatic release of unanswered offers. | Decide whether the goal is a target or hard capacity. If capacity is enforced, reserve/confirm slots consistently, expire invitations, maintain a waitlist and handle two competing approvals safely. Display remaining capacity. |
| P10 | P1 · Gap | Invitation acceptance and task membership checks do not establish that a program is still active, within its dates, or supported by an active organizer. Pausing a program does not define what happens to existing work. | Define allowed actions for planned, recruiting, active, paused, cancelled, completed and archived programs. Block new starts when inappropriate; retain a safe path to hand over or close existing work. |
| P11 | P1 · Gap | An organizer can change program details and remove accepted members by changing the volunteer selection. There is no impact preview, change acknowledgement, reason, or handover of their existing work. | For location/date/role changes, show affected people and open tasks, notify them, and request reconfirmation when the commitment changes materially. Removing a working member must trigger a transfer/closure decision. |
| P12 | P2 · Gap / Policy | Donors, beneficiaries and sellers can also apply to programs, but delivery acceptance and presence controls depend on an active volunteer profile. Participation eligibility and task labels are not consistent across these routes. | Explicitly support community members volunteering, or require a volunteer enrollment step. In either case, provide the same brief, availability, task permissions, withdrawal and recognition rules to eligible participants. |
| P13 | P1 · Gap | Open volunteer requests are a separate recruitment mechanism with slot counting and reversible responses in the service, but no complete organizer-facing creation/review journey was found in the interface. The volunteer dashboard loads only open requests, so accepting the final slot makes a filled request disappear from that list; it does not remain as a clear commitment that can be reviewed or withdrawn. | Either connect this mechanism to the main program participation journey or give it a complete request lifecycle. Show open opportunities separately from My Commitments, retain filled requests for participants, expose safe withdrawal, and explain whether acceptance creates program membership or a distinct assignment. |

### B. Tasks, progress, proof, hours and completion

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| W01 | P1 · Gap | Accepting a program permits task assignment, but a specific task has no accept/decline, clarification, blocked, unable-to-complete or participant withdrawal flow. Task descriptions and dates can be sparse. | Present a task brief with output, deadline, exact area, instructions and reviewer. Distinguish assigned, accepted, started, blocked, submitted, revision requested, verified and cancelled. Provide reassignment and explain how it affects the original volunteer's credit. |
| W02 | P1 · Gap | Tasks and subtasks are separate program-level work lists rather than a clear task with children. Program task progress counts tasks, while volunteer progress combines tasks and subtasks. The same program can legitimately show incompatible completion percentages without explaining why. | Choose one work hierarchy and label every metric's scope. If keeping both, explain their relationship and prevent duplicated work being counted twice. Separate partial progress from verified completed work. |
| W03 | P1 · Defect | Saving a progress report rejects the entire draft if any subtask is 100% or more. The draft includes already completed subtasks. After one subtask is verified at 100%, updating another subtask through this dialog can be blocked. | Completed entries should be read-only or omitted from changes. Permit progress updates for unfinished entries; route newly completed entries individually to proof submission. One completed item must not block the rest. |
| W04 | P1 · Defect | Subtask updates do not enforce a complete transition model or a 0–100 range. Previously completed work can be reduced or reopened without a formal correction process. Tasks have stronger transition rules, producing inconsistent behavior. | Validate progress boundaries and transitions for every work type. Lock verified completion; use an authorized reopen/correction action with a reason and preserve the previous outcome. |
| W05 | P1 · Gap | Ordinary task, subtask and hour proof rejection can be submitted with no reason, unlike shared-delivery proof rejection. Volunteer proof cards do not consistently expose rejection guidance. An image is the main evidence format even when a narrative or attendance record would be more suitable. | Require actionable rejection feedback, show it beside resubmission, keep proof versions and define suitable evidence per work type. Define who takes over if the assigned reviewer is unavailable and how disputed decisions are escalated. |
| W06 | P1 · Gap | Membership cancellation can leave tasks and pending proof attached to someone who is no longer an active member. Later updates and proof approval require active membership and can fail. | Before ending membership, decide each open task and pending review: finish review, transfer remaining work, cancel with reason, or hand over. Preserve the original contributor and previously earned hours. |
| W07 | P1 · Gap | Hour logging allows an activity, date and amount, with only per-entry client checks. There is no attendance interval, task linkage, overlap/duplicate detection, total-per-day limit across entries, or complete server-side membership/date validation. Directory hours and approved-hour totals are not maintained as one derived measure. | Log hours against a real assignment or an explicit approved organization activity. Validate dates and total/overlapping time on the server, require a reviewer, explain rejections, and derive all hour totals from the same approved records. |
| W08 | P1 · Gap | Certificate visibility is based on completed subtasks, so main tasks can still be unfinished. Certificate generation is a printable view without a durable participant certificate record, issue/verification identifier or formal organizer issuance decision. | Define eligibility across the intended scope of work and hours. Issue a stored certificate for the correct participant/program with an identifier and date. Keep completion, appreciation and attendance certificates distinct and allow verification/correction. |

### C. Registration, approval and account maintenance

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| A01 | P1 · Gap | Organization and seller registration each creates an account and a separate related record. Retry support exists while the form remains mounted, but its progress is not a durable resumable onboarding record. Leaving after the account step can strand the user behind duplicate-email errors. Volunteer profile creation is also a second step performed by the approval interface. | Treat onboarding as one tracked journey with a reference and checklist. Resume incomplete related steps after reload/sign-in; make retries safe and make approval create all required actor records consistently. |
| A02 | P1 · Gap | Organization-admin account approval, organization registration approval, bank setup and public listing approval are separate decisions. Approving one does not necessarily complete the others, and rejection has no structured correction path. | Show all prerequisites and the current blocking step to both applicant and reviewer. Separate access approval from public visibility, require reasons, and let the applicant correct and resubmit the relevant item. |
| A03 | P1 · Gap | New seller registration does not collect a partner organization, but seller approval requires an organization ID and name. The current seller review cards offer approve/reject without a complete partner-selection and consent flow. User approval and seller-profile approval are also separate. | Provide a partner request, organization consent, platform decision and seller readiness checklist. Avoid an approval action that is guaranteed to fail for a normal new registration. Keep account and business eligibility consistent. |
| A04 | P1 · Defect / Gap | The pending page reads a stored submission snapshot, does not provide a live review-status journey, and promises an approval email without an implemented email dispatch flow. There is no clear rejected → correction → resubmission route. | Show live review state through an appropriate restricted status view. Display reviewer reason, next action and realistic contact route. Claim email delivery only after an actual delivery integration exists. |
| A05 | P1 · Defect | Volunteers are sent to Edit Profile/Edit Skills, but self-service profile and skill saving reject non-admin roles. Donors, beneficiaries and sellers also cannot use the general password-change action. Presence editing does not solve these other account-maintenance needs. | Allow each person to maintain their permitted profile, skills and availability and change their own password with proper verification. Keep identity-sensitive changes subject to appropriate confirmation rather than disabling all editing. |
| A06 | P1 · Defect | The separate Join as a Volunteer page uses the shared registration process, which requires location, date of birth, addresses, availability days, consent and verification fields that the alternate form does not fully provide. | Use a consistent registration journey from every entry point, or retire/redirect the older entry. Every required item must be visible and collectable before submission. |
| A07 | P2 · Gap / Policy | Verification is explicitly a development simulation in parts of the application, while other “verified” labels and readiness decisions do not consistently explain that limit. Password/session handling also lacks a complete revoke-after-reset/logout lifecycle; ordinary user passwords are stored as entered rather than as password hashes. | Keep simulation claims explicit across the journey. For a professional deployment, store password hashes, revoke sessions appropriately, and define whether identity verification, contact verification and organization approval are separate assurances. No external identity integration is required merely to demonstrate a clearly labelled simulation. |

### D. Beneficiary assistance, emergency help, contact and feedback

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| B01 | P1 · Gap | General assistance, emergencies, contact messages and feedback enter the same broad incoming list. An accepted assistance request does not gain a responsible organization owner. Different admins can act without a defined claim/transfer process. | Triage by submission type. For assistance, claim responsibility once, record the organization and coordinator, and provide transfer/escalation when that organization cannot help. Contact and feedback need support workflows, not volunteer dispatch by default. |
| B02 | P1 · Gap / Defect | General assistance assignment directly sets a volunteer and an assigned status. It lacks the program invitation/shared-delivery acceptance step, availability/location checking and safe reassignment. Accept, decline and resolve methods do not enforce a complete state transition sequence. | Offer the work with a brief, obtain volunteer acceptance, and show the beneficiary a real owner and next action. Define allowed transitions and reasons, and prevent arbitrary reopening/declining of resolved or already claimed work. |
| B03 | P1 · Gap | Beneficiaries can see assistance records but cannot cancel an unneeded request, correct its core details, appeal a decline, or report incomplete assistance through a formal outcome process. Resource requests likewise lack beneficiary-initiated cancellation. | Support stage-aware correction/cancellation, explaining when dispatch means a human handover is needed. Add decline reasons, appeal/escalation and a received/not received/partially helped outcome. |
| B04 | P1 · Defect | Emergency success claims three named organizations were notified and a 15–30 minute response estimate. General assistance success claims a broadcast and a future response notification. The incoming submission/acceptance flow does not perform the claimed matching, notification or ETA calculation. The reference numbers on these pages are static examples. | Show the real saved reference and the real state: submitted, awaiting review, organization contacted, accepted, assigned, etc. Display actual notification/claim outcomes and use an ETA only if supported by a real process. Remove unsupported service promises from the demo. |
| B05 | P1 · Gap | Public emergency submissions do not establish a secure follow-up identity or tracking token. Their request record is not automatically linked to a beneficiary account, and there is no public tracking continuation. Old phone/OTP screens contain unavailable-action paths. | Return a tracking mechanism appropriate to a public request, preserve continuity if the requester later signs in, and provide a working contact/verification alternative. Define no-response escalation and duplicate-report handling. |
| B06 | P1 · Defect / Gap | Public Contact and Feedback pages are present, but their current submission action requires a beneficiary/admin/platform account, despite the incoming submission service allowing public requests. Volunteers, donors and sellers can be blocked from sending ordinary feedback. No clear staff-reply and requester-confirmed resolution loop exists. | Let intended users submit these forms, provide a ticket reference, assign support ownership, record replies and closure, and let the submitter follow up. Distinguish feedback about a real program/order from general comments. |

### E. In-kind donations, stock and resource requests

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| R01 | P1 · Gap | A donor submits a pickup date/slot and items but has no complete self-service edit, reschedule or cancel journey. There is no explicit organization acceptance of the donation or the proposed collection slot before arranging collection. | Acknowledge suitability and confirm a pickup window. Allow safe changes before collection, notify affected volunteers, and require coordination after pickup. Preserve cancellation reasons and the donor's history. |
| R02 | P1 · Gap | Item names, counts and conditions are largely free text. There is no consistent unit, size/specification, expiry, accepted-category policy or transport requirement. One non-dashboard resource entry route turns the description into a single item with quantity one. | Use structured item lines and units consistently across entry routes. Collect the details needed to decide whether the organization can accept, store and transport the goods. Explicitly allow partial acceptance or rejection with a reason. |
| R03 | P1 · Defect | Stock reservation checks available quantities within the organization, but does not require a stock item to match the requested resource or measurement unit. An unrelated item can satisfy the requested number and move the request toward approval. | Match requested item/specification and compatible unit to the allocation. Allow a substitution only with a recorded explanation and recipient consent. Count units of a meaningful kind, rather than treating all stock as interchangeable. |
| R04 | P1 · Gap | Partial approval is supported, but delivering the approved quantity closes the request as delivered without a separate disposition for the unfulfilled remainder. A later “waiting for stock” decision also does not define a persistent partially committed remainder. | Track requested, approved, delivered and outstanding quantities separately. Ask whether the recipient accepts a reduced outcome or wants the remainder kept open. Preserve already reserved/dispatched stock while managing the remainder. |
| R05 | P1 · Gap | A usable warehouse receipt is a single irreversible entry. There is no reason/evidence for shortages or unusable units, receipt correction procedure, batch expiry/damage adjustment, stock count correction or transfer flow. | Record actual usable, damaged, missing and rejected quantities with reasons. Permit controlled adjustments through a ledger, not silent edits. Protect reservations and deliveries from later stock corrections. |
| R06 | P1 · Gap | Beneficiary “Confirm Receipt / Report Issue” stores a message and notifies the organization, but does not establish an issue type, responsible resolver, corrective delivery, dispute status or closure decision. | Distinguish confirmed receipt, partial receipt, damaged/wrong item and not received. Open an issue with evidence, stock consequences, reviewer and next action. Close it only with an explicit resolution. |

### F. Shared delivery and collection coordination

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| D01 | P1 · Gap | Unaccepted delivery offers hide both addresses and contact details. That protects private information, but no non-sensitive pickup/destination areas, travel distance, time window, load or vehicle requirement are provided instead. Volunteers must accept before knowing whether the trip is feasible. | Before acceptance show general areas, approximate journey, item/load, required transport, time window and organization contact route. Reveal exact private addresses only at the appropriate stage. Informed acceptance does not require publicly exposing addresses. |
| D02 | P1 · Gap | Order pickup uses the seller's business name instead of a confirmed full pickup address. Organization collection points can be placeholder text. Shared offers do not carry a complete agreed pickup/drop-off schedule, recipient availability or delivery instructions. | Require a real pickup point/contact, collection window, recipient window, expected load and handling instructions. Confirm readiness before the volunteer travels, and support rescheduling. |
| D03 | P1 · Defect / Gap | Delivery acceptance sends the recipient to the beneficiary dashboard even for a donor collection or shop order. Withdrawals, failures and direct declines do not consistently notify the responsible manager and recipient, despite changing their next action. | Use actor-correct destinations and notify every party that must act. A withdrawn delivery should alert the manager to reassign; a failure should alert the recipient; updates should link to the exact record where practical. |
| D04 | P2 · Gap | Broadcast acceptance correctly prevents two winners, and before-pickup withdrawal/failed-return recovery already exist. However, offers have no expiry, no response deadline, no all-declined resolution and no overdue pickup/delivery escalation. | Add timeouts and an operational queue for unanswered/late work. Preserve reasons and give coordinators clear options: reoffer, reschedule, contact, transfer, or cancel. Keep the existing first-accept and return safeguards. |
| D05 | P2 · Gap | Delivery history is stored but is not presented as a full tracking timeline in the main card. Completion is based on manager-reviewed volunteer proof; recipient disagreement is not connected to a delivery dispute lifecycle. | Show offered, accepted, collected, in transit, proof pending, verified and exception times. Provide recipient acknowledgement or an issue route with review ownership. Do not force recipients to accept an outcome solely because proof was approved. |

### G. Shop, sellers, orders and replacements

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| S01 | P1 · Gap | The shop permits multiple signed-in actor roles to buy, but buyer-order loading, buyer actions and replacement entry points center on the donor role. Other actors' dashboards load orders as volunteer/seller work rather than as their own purchases. | Give every eligible buyer a My Purchases route with the same order details, tracking, cancellation/issue rules and replacement eligibility. Actor role should not make a purchase disappear from the buyer's journey. |
| S02 | P1 · Gap | Checkout records an order and a paid status, decrements stock and credits seller balance. It does not represent a settled payment transaction. Donation areas label the simulation more clearly than every order/balance context. | Keep demo payment states and balances explicitly labelled throughout checkout, history and reporting. If real payment is later required, define verified payment success/failure, pending/held funds, reconciliation and settlement as a separate workflow. |
| S03 | P1 · Gap | There is no complete order cancellation, seller unable-to-fulfill, refund, address correction or recipient-unavailable outcome. Cancelling a delivery releases the order for another assignment; it does not cancel the purchase or reverse stock/balance. | Separate delivery cancellation from order cancellation. Define who can cancel at each stage, what happens to goods and payment/balance, how the buyer is informed, and what happens when fulfillment is impossible. |
| S04 | P1 · Gap | Stock checks at purchase and the new out-of-stock card are useful. However, retries do not identify a previous checkout/donation attempt, and checkout can retain the product price/quantity snapshot from when it opened. A repeated request after a lost response can create another order or contribution. | Give each submission attempt a durable identity so retrying returns the same outcome. Reconfirm material price/stock changes before final commitment. An out-of-stock indicator alone does not address duplicate orders or a changed final price. |
| S05 | P1 · Gap / Defect | Product creation/sale does not require a currently approved, ready seller/partner as a business prerequisite. Approved product descriptions/photos can be edited without a fresh review of material changes. Public product retrieval can also expose unapproved listings if callers omit the status filter. | Check seller and partner readiness at listing and purchase. Restrict public visibility by default. Define which changes require moderation again and preserve what earlier customers actually ordered. |
| S06 | P1 · Defect | Replacement assignment allows a requested replacement to become volunteer assigned, bypassing the separate approval decision. The assigned volunteer has no acceptance/decline, withdrawal, failure, return-to-sender or safe handover path comparable to shared deliveries. | Require a review outcome before fulfillment, then use an offer/accept process. Handle pickup failure, unavailable buyer, damaged return, volunteer departure and reassignment explicitly. |
| S07 | P1 · Gap | Replacement requests do not prevent multiple open claims for the same order, specify claim quantity for a multi-item purchase, enforce an agreed claim window, or reserve replacement stock. They can progress without establishing that a replacement exists. | Define eligibility, quantity and duplicate-claim rules. Reserve the replacement item before promising it. Define what happens if stock is unavailable and how the returned item is inspected and accounted for. The claim window itself is a policy decision. |
| S08 | P1 · Gap | Seller-facing replacement cards allow assignment, but approve/reject is exposed to admins. Replacement proof is reviewed by the responsible organization admin, while ordinary shop delivery proof is reviewed by the seller. Review responsibility and appeal are unclear and seller account records may have no organization. | Establish one documented responsibility model for buyer claim review, return inspection, replacement dispatch, final proof and disputes. Supply every reviewer with the case context and give the buyer a reason and appeal route. |
| S09 | P2 · Gap / Policy | Seller sales balance increases at order creation. It does not distinguish pending fulfillment, verified delivery, cancelled/returned sales or paid-out money, and no payout workflow was found. Buyers also lack a clear delivery/serviceability promise before ordering. | If financial settlement is in project scope, define a ledger with held/earned/reversed/paid-out states and payout review. If not, call it a demo gross-sales total. In either case show the delivery area, realistic scheduling expectation and issue policy before purchase. |

### H. Monetary donations and donor confidence

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| M01 | P1 · Defect | Donation screens advertise monthly contributions, recurring management and tax receipts/benefits. The service stores contributions as one-time demo donations and marks them ineligible for a tax receipt. Appreciation certificates correctly state that they are not tax receipts. | Align all screens with the implemented scope. Remove unsupported recurring/tax promises, or define and implement those separate workflows before advertising them. This is a product-truthfulness finding, not a tax-law assessment. |
| M02 | P2 · Gap | Donation recording and organizer appreciation certificates exist, but there is no meaningful organization expenditure/utilization story tying contributions to approved expenses, delivered outputs or program outcomes. A balance or “raised” counter does not establish impact. | Show how recorded contributions support a program, what has been allocated/spent, approved supporting updates and what outcomes were verified. Keep unspent, committed and spent funds distinct if financial tracking is in scope. |
| M03 | P2 · Gap / Policy | There is no donor-facing correction, cancellation/refund-policy or complaint-resolution journey for a contribution. Certificate issuance is an organizer action, without a clear pending-request or disputed-details process for the donor. | Decide the supported policies for mistaken contributions and corrections; provide a case with reference, owner and outcome. Give the donor a receipt/history, certificate eligibility and a way to correct the recipient/name/details without rewriting history silently. |

### I. Governance, access, records, notifications and reporting

| ID | Priority / type | Current behavior and consequence | Professional behavior needed |
|---|---|---|---|
| G01 | P0 · Defect | A real bearer session is validated for selected user-management operations, but the common role check for many business workflows trusts the role header supplied by the caller. Email/organization headers are likewise treated as identity in many places. A role label is not proof of sign-in. | Derive actor identity, approved status, role and organization from a validated server session for every protected operation. Recheck current account eligibility rather than relying on a browser session snapshot. |
| G02 | P0 · Defect | Several operations check actor role but not whether the specific record belongs to that actor/organization. Examples include product and seller updates, program-assignment changes, application approval, several task/hour reads/writes and incoming request decisions. Interface filtering does not provide ownership enforcement. | Enforce record ownership, organization scope, participant identity and action permission on every business decision. Test a second user of the same role and a second organization, not just an incorrect role. |
| G03 | P0 · Defect | Buyer-order/replacement lookup routes are public and can return personal details by email/ID. Public organization responses include their stored bank information. Seller collection responses contain banking details for other sellers. Notification lookup/read also lacks recipient-bound access. | Return only the information needed by that actor at that stage, require identity/ownership for private records, and mask sensitive fields. Use public profiles with an intentionally limited field set. Keep evidence and contact details private to the appropriate case participants. |
| G04 | P1 · Gap | Organization, program, volunteer, seller and user deletion generally lacks an end-to-end dependency/handover policy. Programs can be removed while assignments/tasks/proofs refer to them. Organization names and volunteer emails are used as relationships, making later renames/email edits inconsistent. | Archive records with history; block or coordinate deletion while obligations remain. Use stable relationships and an explicit identity-change process. Show affected work before a destructive action. Existing protection of already-received donated inventory should be retained. |
| G05 | P1 · Gap | Account rejection, volunteer inactive status, organization suspension, seller rejection, public unlisting and program pausing do not form one coordinated stop-and-handover process. Existing approved products and active tasks do not consistently honor those changes. | Define consequences for every restriction: block new commitments, identify open obligations, appoint a replacement reviewer/manager, notify participants and preserve historical records. Unlisting from discovery should not silently abandon people already committed. |
| G06 | P1 · Defect / Gap | General platform requests include organization registration, budget increase and account reinstatement. Approving one changes the request status but does not perform the corresponding organization/budget/account decision. Review reasons and resubmission context are sparse. | Either connect each request type to its actual business outcome with reviewer evidence, or present it as a support ticket awaiting a separate action. “Approved” must not imply that an account was reinstated or a budget changed when neither occurred. |
| G07 | P1 · Defect | Analytics contains fixed sample totals and growth figures. Other counters use different status names than the records actually produced, such as pending versus submitted, or completed versus received. Volunteer active-task labels can reflect active memberships. Seeded hours/ratings/impact are not all derived from verified work. | Define each metric, date window, actor scope and source. Compute it from actual workflow events, handle every current status consistently, and label any demonstration/sample data. Report meaningful outcomes such as overdue reviews, unfilled commitments and fulfilled quantities. |
| G08 | P1 · Defect / Gap | Notifications are created for some important events but not consistently for program invitation/decision/task/proof flows. Group/global notification records share one read flag, so one person's read can affect others. Several histories/review decisions omit actor/reason detail. | Define the event-to-recipient matrix, store read state per recipient, and retain actor/time/reason for decisions. Ensure each event tells the recipient what changed, what they need to do and where to do it. Polling is acceptable for a demo if it is described honestly. |

**Finding count:** 65 grouped findings: 3 P0, 54 P1 and 8 P2. Several findings cover related symptoms of one business problem. This count is not a count of independently reproduced bugs, and it should not be used as a project score.

## 5. A complete program participation journey

This is the recommended business design for the example in the request. It is a proposal, not implemented behavior.

1. **Plan the program.** Organizer defines purpose, organizer profile/contact, dates, shifts, venue, role brief, capacity, required skills, expected work and review criteria. Save a draft before recruiting.
2. **Check readiness.** Confirm organizer approval and program prerequisites. Public listing review is separate from whether private invitations are permitted.
3. **Choose candidates.** Show skills, self-reported current area, availability freshness, planned availability, existing commitments and willingness to travel. Confirm availability for this program's dates and place.
4. **Invite or receive an application.** A direct invitation and a public application are different entry paths. Both lead to an informed commitment. Applying should not erase the right to withdraw before review.
5. **Review the full brief.** Volunteer sees organizer details, work, schedule, location, support and contact. They can accept, decline or ask a question. Organizer sees the response and remaining capacity.
6. **Confirm participation.** Record the agreed role/shift and brief version. A change in date, venue or scope triggers an update and, if material, reconfirmation.
7. **Assign specific work.** Task has clear output, deadline, location and reviewer. Volunteer can accept, clarify, start or report that they cannot perform it.
8. **Work and report.** Record progress, blockers, attendance/hours and evidence. Changes are attributed to a person and date.
9. **Withdraw safely when needed.** Pending application: withdraw immediately. Accepted but not started: release slot and notify. In progress: preserve finished work, reconcile materials, transfer outstanding work, decide pending reviews and confirm handover. Do not erase the volunteer's contribution.
10. **Review and correct.** Reviewer approves or requests revision with a reason. Disputes have an escalation owner. Completed work cannot be silently changed back.
11. **Close the participation and program.** Confirm verified work/hours and any outstanding obligations, issue the appropriate stored certificate, record actual outcomes and archive the program.

### Minimum information at the decision points

| Decision | Information the actor needs |
|---|---|
| Organizer selects a volunteer | Skills, role eligibility, current area and its freshness, dates/shifts available, conflicting commitments, travel willingness, relevant verified work history |
| Volunteer accepts a program | Organizer identity/profile, contact person, purpose, role, actual work, location, dates/times, expected hours, support, requirements, withdrawal process |
| Volunteer accepts a delivery | General pickup/drop-off areas, actual time window, item/load, vehicle requirement, travel expectation, manager contact and failure procedure |
| Reviewer approves work | Original assignment, agreed criteria, contributor, progress/history, evidence, claimed hours and any previous rejection or handover |
| Beneficiary accepts partial help | Requested quantity, offered suitable quantity, substitution details, remaining need, delivery plan and option to decline or keep remainder open |
| Buyer confirms checkout | Seller and product, actual current price/quantity, delivery area/timing expectation, address, payment-demo scope and cancellation/issue policy |

## 6. Workflow rules to agree before any implementation

These are decisions for the project team; the current review cannot choose them on behalf of all stakeholders.

| Policy question | Practical starting proposal |
|---|---|
| Who may volunteer? | Support one explicit participation enrollment usable by eligible account roles, or require a volunteer role. Avoid partially supporting both. |
| What does available now mean? | Self-reported present willingness to receive work; never an automatic commitment to a future shift. Show freshness and define when it expires. |
| Is volunteer goal capacity? | Keep target and maximum capacity separate if both are needed. Define whether pending offers reserve slots. |
| Can volunteers withdraw after starting? | Yes, through a reasoned handover; preserve completed work, evidence and approved hours. Urgent departure must have a coordinator escalation route. |
| What completes a program? | An organizer closure decision based on verified deliverables, reconciled resources and outstanding issues, rather than a single progress percentage. |
| Who approves buyer replacements? | Name a primary reviewer and dispute reviewer. Use the same rule in every screen and backend decision. |
| What happens to partially approved resource requests? | Track outstanding quantity explicitly; recipient chooses reduced fulfillment or continuation of the remainder. |
| What is payment scope? | For the current academic demo, consistently label simulated contributions/orders and avoid claims of real settlement, subscription management or tax receipts. |
| What does suspension do? | Block new commitments while assigning responsibility for existing ones; preserve read-only history and case follow-up where appropriate. |

## 7. Prioritized improvement sequence

### First: make existing actions trustworthy

Address G01–G03 access/privacy, P08 membership resurrection, W03 progress blocking, B04 misleading confirmation/reference numbers, M01 unsupported promises, and the replacement approval bypass in S06. These are existing-behavior defects, not requests for extra decoration.

### Second: finish one convincing program story

Complete scheduling and work briefs, availability-aware candidate selection, full invitation review, application withdrawal, accepted-member withdrawal with handover, task decisions, proof feedback, hours and certificate eligibility. Demonstrate the same story from organizer and volunteer accounts with one failed/recovery branch.

### Third: finish assistance and resource fulfillment

Add responsibility/claiming for general assistance, truthful emergency tracking, beneficiary cancellation, stock suitability/units, remaining quantities, agreed pickup details and issue resolution. Reuse the existing shared delivery acceptance/failure/return mechanics.

### Fourth: complete the purchase and replacement story

Provide purchases for all buyer roles, delivery readiness, seller eligibility, cancellation/accounting rules, replacement review, stock reservation, acceptance and exception handling. Keep demo payment scope explicit.

### Fifth: make outcomes reviewable

Finish onboarding resumption, rejection/resubmission, consistent event notifications, per-recipient read state, archive/dependency rules, stored certificates and live metrics. Show genuine workflow outcomes rather than fixed growth claims.

This sequence is a dependency-based proposal, not a promise that all work fits in a specific number of days.

## 8. Acceptance scenarios for the next review

These scenarios are **proposed tests**, not claims that the project currently passes them.

| Scenario | Expected result |
|---|---|
| 1. Create a program starting next month | Dates, shift, venue and brief are selectable; public display does not imply it has started today. |
| 2. Invite a volunteer currently in another city | Organizer sees location/freshness and planned availability, asks about attendance/travel, and does not confuse active account with onsite availability. |
| 3. Accept a private program invitation | Volunteer sees the full organizer/work/schedule brief without requiring the private program to appear publicly. |
| 4. Withdraw before application review | Application becomes withdrawn; organizer sees the change; a later approve attempt cannot create membership. |
| 5. Withdraw after completing one task | Completed task and approved hours remain credited; remaining work/materials transfer; membership does not reactivate on page refresh. |
| 6. Change venue after acceptance | Affected volunteers are notified and can reconfirm or decline; old commitment is visible. |
| 7. Fill the final volunteer slot | Competing approvals follow the chosen capacity rule; unsuccessful candidates receive a clear outcome or waitlist position. |
| 8. Update progress after another subtask reached 100% | Finished work stays locked; remaining work can still be updated and individually submitted for proof. |
| 9. Reject task evidence | Reviewer must supply a reason; participant sees it and can submit a new version with history retained. |
| 10. Submit two overlapping hour entries | Duplicate/overlapping or impossible totals are flagged; approved totals stay consistent across the profile and dashboards. |
| 11. Submit a public emergency request | Confirmation shows its actual reference and actual routing state, not fixed organizations or an unsupported ETA. |
| 12. Two organizations attempt to accept one help request | Exactly one becomes responsible; the other receives a clear conflict/transfer option; beneficiary sees the real coordinator. |
| 13. Request rice when only blankets are in stock | Blanket quantity cannot fulfill rice; any substitution requires an explicit appropriate proposal and consent. |
| 14. Request ten units but receive four | Four are tracked as fulfilled; six remain explicitly open or are closed only through a recorded recipient decision. |
| 15. Volunteer withdraws before pickup, then another delivery fails after pickup | First releases assignment; second requires return/incident handling. Managers and recipients receive the right updates. |
| 16. Buy the last shop item, then retry after a lost confirmation | Exactly one purchase exists for that submission; stock and balance are correct; the card reflects stock exhaustion. |
| 17. A seller cannot fulfill a purchase | Order and delivery states remain distinct; buyer receives the chosen cancellation/refund or rescheduling outcome; goods and accounting reconcile. |
| 18. Request a replacement when replacement stock is zero | No unfulfillable replacement promise; reviewer chooses the defined alternate outcome; duplicate claims are prevented. |
| 19. Approve a new seller or organization after a partial onboarding failure | Applicant can resume; reviewer sees prerequisites; account/business/listing state cannot silently diverge. |
| 20. Suspend an actor with open work | New commitments stop; existing cases are handed over; people retain a way to follow up and history remains intact. |
| 21. Access another user's order or another organization's task | Access is rejected based on validated identity and record ownership, even when both users have the same role. |
| 22. Two recipients read one announcement | Each has independent unread state. Program invitations, decisions, failures and review outcomes reach the correct actors. |
| 23. Compare dashboard totals with underlying records | Counts, hours, stock, program progress and certificates follow documented definitions and reconcile with verified records. |

## 9. Evidence index

This appendix identifies where the reviewed behavior was found, without proposing code changes. Paths are relative to this project. UI routes and component behavior were checked against the corresponding business services, rather than assuming a visible button meant a complete process existed.

| Finding family | Principal evidence reviewed |
|---|---|
| P01–P05, P09–P12 | `front-end/src/pages/content/CreateProgramPage.jsx`; `front-end/src/pages/actions/managementActions.js` (program save, selection and invitation actions); `front-end/src/components/pages/PageRegions.jsx` (program selector and invitation cards); `front-end/src/components/pages/PublicRegions.jsx`; `front-end/src/components/pages/VolunteerPresence.jsx`; `back-end/src/modules/programs/`; `back-end/src/modules/volunteers/`; `back-end/src/modules/fulfillment/service.ts` |
| P06–P08 | `back-end/src/modules/program-applications/service.ts` and `controller.ts`; `back-end/src/modules/program-assignments/service.ts` and `controller.ts`; `front-end/src/services/workflow.js`; `front-end/src/pages/actions/managementActions.js` |
| P13 | `back-end/src/modules/volunteer-requests/`; `front-end/src/services/pageData.js`; `front-end/src/components/pages/PageExtras.jsx`; volunteer-request actions in `front-end/src/pages/actions/managementActions.js` |
| W01–W08 | `back-end/src/modules/tasks/`; `back-end/src/modules/subtasks/`; `back-end/src/modules/hour-logs/`; `back-end/src/modules/proofs/`; `front-end/src/components/pages/WorkflowPanels.jsx`; `PageExtras.jsx` (progress and certificates); `PageRegions.jsx`; `front-end/src/pages/actions/managementActions.js` |
| A01–A07 | `front-end/src/pages/actions/authActions.js`; `front-end/src/pages/content/JoinVolunteerPage.jsx`, `SignupPage.jsx`, `ProfilePage.jsx`, `RegistrationPendingPage.jsx`; `front-end/src/contexts/AuthProvider.jsx`; `back-end/src/modules/users/`; `back-end/src/modules/sellers/`; `back-end/src/modules/organizations/`; `front-end/src/services/workflow.js` |
| B01–B06 | `back-end/src/modules/incoming/`; `front-end/src/pages/actions/contributionActions.js`; `front-end/src/pages/actions/authActions.js`; `front-end/src/pages/content/EmergencySuccessPage.jsx`, `Page4BroadcastSentPage.jsx`; `front-end/src/components/pages/PageRegions.jsx`; `back-end/src/modules/fulfillment/service.ts` |
| R01–R06, D01–D05 | `back-end/src/modules/resource-donations/`; `back-end/src/modules/fulfillment/service.ts`, `dto.ts`, `controller.ts`; `front-end/src/components/pages/FulfillmentPanel.jsx`; `front-end/src/pages/actions/contributionActions.js` |
| S01–S09 | `back-end/src/modules/products/`, `orders/`, `sellers/`, `replacements/`; `front-end/src/services/pageData.js`; `front-end/src/components/pages/PageExtras.jsx`; `front-end/src/components/pages/FulfillmentPanel.jsx`; `front-end/src/pages/actions/contributionActions.js`, `managementActions.js`; `front-end/src/pages/content/ShopPage.jsx` |
| M01–M03 | `back-end/src/modules/donations/`; `front-end/src/pages/content/DonatePage.jsx`; `front-end/src/components/pages/WorkflowPanels.jsx`; `front-end/src/pages/actions/contributionActions.js` |
| G01–G06 | `back-end/src/common/guards/roles.guard.ts`; `back-end/src/app.module.ts`; relevant operational controllers above; `back-end/src/modules/users/service.ts`, `controller.ts`; `back-end/src/modules/requests/service.ts`; `back-end/src/common/local-state.ts` |
| G07–G08 | `front-end/src/pages/content/AnalyticsPage.jsx`; `front-end/src/pages/runtime/usePageModel.js`; `front-end/src/components/pages/PageRegions.jsx`; `back-end/src/modules/notifications/`; `front-end/src/components/notifications/NotificationDock.jsx`; notification creation in the reviewed services |
| Existing verification coverage | `front-end/tests/e2e/participation-workflows.spec.js`, `fulfillment-workflows.spec.js`, `requested-workflows.spec.js`, `auth-errors-workflows.spec.js`, `public-listing-workflows.spec.js`, `presence-stock.spec.js`; frontend unit scenarios; backend user, presence and response tests. Many UI scenarios use mocked responses and cannot establish cross-actor consistency against the real services on their own. |

## 10. What a professional demonstration should prove

Use a small set of connected records across actual actor accounts. Show an organizer planning a future program, selecting an appropriate volunteer, sending a complete brief, and receiving acceptance. Show the volunteer doing work, having one proof rejected with useful feedback, resubmitting, and withdrawing from the remainder through handover. Show a beneficiary receiving suitable partially available resources through an accepted delivery, with the remainder tracked. Show a shop purchase and a replacement exception with stock and responsibilities reconciled. Finally, show notifications, histories and metrics agreeing with those outcomes.

That demonstrates planning, consent, coordination, exceptions, accountability and evidence—the business behavior that makes this project more than a collection of CRUD screens.
