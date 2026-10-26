# Grenrose Worker Portal

## Site toolbox talks

The signed-in portal includes **Toolbox Talks** for assigned sites: the site's saved Monday selection, additional PDFs uploaded by an administrator, and paginated history. Downloads use authenticated `/api/worker/` routes and recheck assignment. This requires GrenroseAdmin migration 008 and its matching API release; deploy the API first, then this worker app. Workers cannot upload talks. Downloading does not record delivery, attendance or sign-off. This release also updates Next.js to the published 16.4.1 security patch.

The separate worker website connects to the persistent API in `streettitans/GrenroseAdmin`. Workers sign in with email/password after an administrator creates their account and confirms company/site assignments. Sessions use HttpOnly cookies through this site's API proxy; no bearer token or attendance record is stored in localStorage.

## Run locally

- Node 22.23+ and pnpm 10.34.3.
- In GrenroseAdmin, start the API (default 3001), set its `WORKER_ORIGIN=http://localhost:3002`, provision the first administrator and create real site/worker records.
- Copy `.env.example` to `.env.local` and set `API_INTERNAL_URL` to that API's internal origin. This variable is server-only and must be set **before building**, because Next.js compiles rewrite destinations.
- `pnpm install --frozen-lockfile --ignore-scripts`, then `pnpm dev` (worker port 3002). For production: `pnpm build`, then `pnpm start` behind HTTPS.

## Worker journeys

`/`, `/login` and `/dashboard` open the worker portal; `/shifts` and `/timesheets` open attendance history. These show actual attendance, not fabricated scheduled shifts. `/forgot-password` requests account recovery; `/reset-password?token=...` accepts a one-use invitation/recovery token.

Scan the current site QR code at the entrance, sign in, then choose **Share location & check in**. You must be assigned to the active site. The server validates freshness and reported accuracy/coordinates; one worker cannot have two open attendance records. Check-out closes the same server record used by admin live registers and reports. An active emergency roll call pauses new site check-ins.

The portal refreshes every five seconds and flags connection failures. GPS remains reported device data and can be spoofed; it is not independently verified proof of presence. Real-device/HTTPS/location-permission testing remains a release requirement.

## Recovery and security

Email delivery runs in the shared backend. The owner supplied `streettitans2020@gmail.com` as sender; its credentials must be added securely at deployment. No email credentials or default/demo worker passwords are committed. Missing delivery returns an unavailable state rather than a fake success.

Both repositories must be released together with matching API origins. Only `/api/worker/*` and `/api/account/*` are proxied; no admin API proxy is exposed. Deploy behind a controlled HTTPS gateway with forwarding-header sanitation and edge rate limits. Read `GrenroseAdmin/docs/SITE-REGISTER-DEPLOYMENT.md` for storage, backup/restore and operational checks.


## Checks

`pnpm build` and `pnpm type-check`. GitHub CI runs both on Linux. Backend integration tests in GrenroseAdmin cover the shared contract, concurrency, QR revocation, account reset/session revocation, reports and roll call. The active portal components and request helper are mirrored from `GrenroseAdmin/src/site`; keep those copies aligned when changing the shared UI contract.

## Release package

The Dockerfile builds a standalone Next.js server with API_INTERNAL_URL set at build time. Only the HTTPS edge should be public. The unused legacy Tailwind dependency was removed; the active portal uses its shared CSS. Attendance history is paginated and action errors are separate from session-refresh warnings. Refer to GrenroseAdmin/docs/PRODUCTION-OPERATIONS.md for coordinated deployment and the real-device acceptance record.
