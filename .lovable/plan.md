# Smooth View-to-Book Experience — 3-Batch Rollout

Skipping on-page pricing per your call. Each batch ends in a working, shippable state — you approve before I start the next.

---

## Batch 1 — Form & Discovery UX (no backend changes)

**Navbar (`Navbar.tsx`)**
- Add a persistent "Start a project" CTA button (desktop + mobile) that scrolls to `#categories` on home or jumps to `/services/<last>#enquire`.

**Category cards (`CategoriesSection.tsx`)**
- Each card gets a primary "Enquire" link (jumps to `#enquire`) plus a secondary "View reels" link to the top of the page.

**Category page (`CategoryPage.tsx`)**
- Insert a 3-step "How it works" strip above the form: Enquire → Quote in 24h → Shoot day.
- Add a brand-logo + short-quote social-proof block under the reels (reuse `BrandsSection` data).
- Lazy-mount videos with `IntersectionObserver` + `preload="metadata"`; pause when offscreen. Stops 3 videos autoplaying on load.

**Booking form (`BookingForm.tsx`) — rebuilt as a 3-step wizard**
- Step 1 Project: project_type, deliverables, budget range (select: <$2k / $2–5k / $5–10k / $10k+ / Not sure).
- Step 2 Logistics: preferred date (shadcn Calendar + "flexible" toggle), hours_required, num_shooters, additional_requirements, optional file upload (mood board / brief — Lovable Cloud Storage bucket `booking-attachments`, attached URLs stored on the enquiry row).
- Step 3 Contact: name, email, phone (with country code), T&Cs checkbox, summary review, submit.
- Progress bar across the top, Back/Next buttons, autosave to `localStorage` per category, focus first invalid field on submit, `aria-describedby` wired to error messages.

**DB change for batch 1**
- Add `budget_range text` and `attachment_urls text[]` columns to `booking_enquiries`. Create public `booking-attachments` storage bucket with size/type limits and an RLS policy allowing inserts only.

Deliverable: clients land on a category, see proof, understand the process, fill a friendlier form, and can attach references.

---

## Batch 2 — Confirmation Emails & Booking Status

**Reference numbers**
- Add `reference_code text unique` to `booking_enquiries`, generated server-side as `SMG-YYYY-####` via a trigger.

**Email infrastructure (Lovable Emails)**
- Set up sender domain + app email infra (one-time; you'll be prompted for the domain).
- Create app email templates:
  - `booking-received` — sent to client on insert. Includes reference number and a magic link to `/booking-status?token=...` pre-filled.
  - `booking-status-update` — sent when admin changes status to confirmed/declined, with the admin note.
- Trigger sends via a DB trigger → edge function `send-transactional-email`.

**Booking status page (`BookingStatus.tsx`)**
- If logged in, auto-load the user's bookings (match by `auth.users.email`); skip the email form.
- If not logged in, accept either an email *or* a one-time `?token=...` link from the confirmation email (new table `booking_status_tokens`, single-use, 30-day TTL). Removes the "anyone can type any email" gap.
- Per-booking timeline: Submitted → In review → Confirmed → Shoot day → Delivered.
- "Add to calendar" `.ics` download once status = confirmed.
- "Cancel booking" button for in-review bookings (writes status `cancelled_by_client`, emails admin).

**Confirmation screen**
- Show reference number and a "Check status" button linking to `/booking-status`.

Deliverable: clients get a branded confirmation email, can return to a secure status page, and get notified when the status flips.

---

## Batch 3 — Admin, Performance & SEO

**Admin dashboard (`Dashboard.tsx`)**
- Confirm / Decline buttons open a small dialog with an optional note that goes into the status-update email.
- Filters: status, category, date range, free-text search (name/email/project_type).
- Calendar view of confirmed shoots (shadcn Calendar + day-grouping) to avoid double-booking.
- CSV export of the current filtered list.
- New `booking_messages` table for the client cancel-note thread; surfaced inline on each booking.

**Performance**
- Convert hero/reel sources to WebM with MP4 fallback via `<source>` tags.
- Preload LCP hero asset in `index.html`.
- Confirm reel lazy-mount from batch 1 is hitting metrics (manual smoke test).

**SEO & trust**
- Per-page `<title>`, meta description, OG image, and JSON-LD `Service` schema for each category page (server-rendered via react-helmet-async or static `<head>` tags — react-helmet is fine for a client SPA).
- Sitemap + robots check.
- Privacy line + T&Cs checkbox copy finalized.

Deliverable: ops side is usable end-to-end, site is faster and properly indexed.

---

## What I need from you

- Batch 2 will pause for the email-domain setup dialog — have the domain you want to send from ready (e.g. `notify.soulsmedia.com`).
- T&Cs / privacy URL (or I'll stub `/terms` and `/privacy` placeholder pages).
- Confirm batch 1 is good to start.
