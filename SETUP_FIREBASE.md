# Firebase setup — admin panel

This admin panel now shares the exact same Firebase project as the
JobsLinks.pk website (`joblinks-20464`) — same Auth users, same Firestore
database. If you've already run through the website's `SETUP_FIREBASE.md`
and `SETUP_JOBS_SCRAPER.md`, most of the underlying setup (Firestore
database, `admins` allow-list, security rules) is already done — this
panel just reads and writes more of that same data.

## 1. Environment variables
Copy `.env.example` to `.env` (or leave it — the config falls back to the
values baked into `src/firebase.js` if no `.env` is present).

## 2. You must be on the `admins` allow-list
Login here uses real Firebase Auth (email + password), but a successful
sign-in isn't enough on its own — the account also has to have a document
in Firestore's `admins` collection, keyed by its UID. This is the same
allow-list the website's own `/admin` page uses. If you haven't made
yourself an admin yet, see the "Make yourself an admin" section of the
website's `SETUP_FIREBASE.md` — the short version:

1. Sign up for an account on the website (or create one directly in the
   Firebase Console → Authentication).
2. Copy that user's UID from the Authentication tab.
3. Firestore → Data → create a collection named `admins` → add a document
   whose **Document ID** is that UID (any field inside it is fine).

Without that doc, login here will succeed and then immediately sign the
account back out with an "isn't authorized" message — that's the intended
behavior, not a bug.

## 3. Deploy the updated Firestore rules (from the website project)
The website's `firestore.rules` file now has sections for `jobs`,
`companies`, and `advertisements` that this admin panel depends on for
write access (see below for why). Redeploy it from the **website**
project folder:
```
firebase deploy --only firestore:rules,firestore:indexes
```

## 4. Password reset
"Forgot password?" on the login screen sends a real Firebase password
reset email — no extra setup needed beyond having Email/Password sign-in
enabled (already required by the website setup).

## What's real vs. still local
This pass wired up the **Job Portal** section end-to-end, since that's
the part of this admin panel that's actually specific to JobsLinks.pk:

| Page | Data source | Notes |
|---|---|---|
| Dashboard | Firestore (`jobs`, `companies`, `advertisements`) | Live counts, charts, recent activity |
| Job Portal → Overview | Same, plus `users`, `paymentRequests` | Quick links + top-level counts |
| Job Portal → Companies | Firestore `companies` | Full CRUD from this panel |
| Job Portal → Job Listings | Firestore `jobs` (**shared with the website**) | See below |
| Job Portal → Advertisements | Firestore `advertisements` | Approve/pause/end campaigns; feeds the website's homepage ad banner |
| Job Portal → Subscriptions | Firestore `paymentRequests` | Same approve/reject flow as the website's own `/admin` — use either, they hit the same data |
| Job Portal → Job Seekers | Firestore `users` (read-only) | Visibility into website signups, not a second place to edit them |
| Job Portal → Newspaper Pages | Firestore `newspaperUploads` only (no Firebase Storage — kept free) | Upload photos/scans of real newspaper job pages — shows on the website's `/newspapers` gallery. Images are compressed in-browser and stored directly in Firestore, so no Storage/Blaze plan is needed — see the website's `SETUP_NEWSPAPER_UPLOADS.md`. |

**Deliberately left on mock data / unchanged this pass:** Dashboard's
sidebar siblings — Leads, Orders, Customers — model a generic SaaS sales
pipeline (ARR, health scores, deal stages) with no real counterpart in
your product, so wiring them to real data would mean inventing numbers
that don't mean anything. Messages, Workspaces, Tasks, Calendar, Feedback,
Help, and Settings are similarly generic template pages, most already
unlinked from the sidebar nav before I touched anything. If any of these
turn out to matter for how you actually run the business (e.g. "Leads"
becoming employer sign-up inquiries), they're straightforward to wire up
the same way the Job Portal pages were — just say which one.

## The `jobs` collection is now shared — how that works
The website's newspaper scraper and this panel's "Add Job" form both write
into the same Firestore `jobs` collection, distinguished by a `source`
field (`'scraped'` vs `'employer'`). A `status` field (`Active` / `Pending`
/ `Draft` / `Closed`) controls what's visible on the public site — the
website only shows `status == 'Active'`. This means:
- Newspaper listings you scrape show up in this panel's Job Listings table
  automatically, and you can hide/close/delete them from here.
- Employer job postings you create here show up on the public website's
  job grid automatically once you set their status to Active — no
  separate sync step.
- Scraped listings are missing a lot of the employer-job fields
  (applicants, salary range, skills, etc.) — the table fills in sensible
  placeholders for those so nothing breaks, but don't read too much into
  a scraped job showing "0 applicants" or "Full-time" — those are
  defaults, not real data for that listing.

## Advertisements → website connection
Approving a campaign here (status becomes `Active`) makes it eligible to
show in a single banner slot on the website's homepage. Impressions
increment once per visitor when the banner renders; clicks increment when
they tap it — both write straight back into this panel's campaign
performance numbers (CTR, spend-adjacent metrics stay as you enter them,
since there's no real ad-billing integration here).
