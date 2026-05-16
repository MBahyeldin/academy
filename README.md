# Modern Islamic Academy

A bilingual (English UI shell + Arabic content rendering) Quranic and Islamic Studies learning platform. Three-app pnpm monorepo: **React/Vite frontend**, **Express/Prisma API**, and **Strapi CMS**.

## Architecture at a glance

```
academy/
  apps/
    web/    # Vite + React 18 + Tailwind + shadcn-style UI
    api/    # Express 4 + Prisma + PostgreSQL (transactional)
    cms/    # Strapi v5 + PostgreSQL (content + auth)
  packages/
    design-tokens/  # CSS vars + Tailwind theme extracted from DESIGN.md
    types/          # Shared TS interfaces + Zod schemas
    api-client/     # strapiClient + apiClient (both share JWT)
    ui/             # Button, Card, Badge, Progress, Skeleton, Input, EmptyState
    utils/          # formatDate, formatDuration, relativeTime, isArabic
  tooling/
    typescript/     # shared base.json / node.json / react.json
    eslint/         # flat config
```

### Data ownership

| Owner       | Entities                                                              |
| ----------- | --------------------------------------------------------------------- |
| **Strapi**  | Category, Instructor, Course, Module, Lesson, Review + Users          |
| **Express** | User (UUID + strapiId), Enrollment, Progress, StudySession, Achievement, Notification |

### Auth flow

1. User logs into Strapi (`POST /api/auth/local`) → receives **JWT signed with `JWT_SECRET`**
2. Frontend stores JWT in zustand (persisted to localStorage)
3. Both `strapiClient` and `apiClient` attach `Authorization: Bearer <jwt>` to every request
4. Express validates the JWT with **the same `JWT_SECRET`** → trusts the strapiId in the payload
5. Express upserts a local `User { id: uuid, strapiId }` so its tables can foreign-key to a stable UUID

`JWT_SECRET` MUST be identical in `apps/cms/.env` and `apps/api/.env`.

## Prerequisites

- **Node 20+** and **pnpm 9+**
- **PostgreSQL 14+** running locally (two databases: `academy_strapi`, `academy_api`)

Quick setup on macOS:

```bash
brew install postgresql@16
brew services start postgresql@16
createdb academy_strapi
createdb academy_api
```

## First-time setup

```bash
# From the repo root
pnpm install

# Env files
cp apps/cms/.env.example apps/cms/.env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Generate Strapi secrets (paste into apps/cms/.env)
node -e "for (let i = 0; i < 5; i++) console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Make sure `JWT_SECRET` is identical in `apps/cms/.env` and `apps/api/.env`.

### Prisma

```bash
pnpm --filter @academy/api exec prisma generate
pnpm --filter @academy/api exec prisma migrate dev --name init
```

## Running

### Option A — all three concurrently

```bash
pnpm dev
```

This starts CMS (1337), API (3001), and web (5173) in one terminal. Logs are prefixed.

### Option B — separately (recommended on first boot)

```bash
# Terminal 1 — Strapi
pnpm --filter @academy/cms dev
# Visit http://localhost:1337/admin and create your admin account on first boot.
# Then seed content (idempotent):
pnpm --filter @academy/cms seed

# Terminal 2 — Express API
pnpm --filter @academy/api dev
# Seed user state (depends on Strapi student user existing; strapiId=1):
pnpm --filter @academy/api seed

# Terminal 3 — Web
pnpm --filter @academy/web dev
# → http://localhost:5173
```

## The seed data

After running both seed commands you'll have:

- **6 courses** across 4 categories (Quran, Hadith, Fiqh, Arabic), each with 3 modules × 4 lessons + 3 reviews
- **3 instructors**: Sheikh Abdullah Al-Mahmoud, Dr. Fatima Al-Zahrawi, Ustadh Yusuf Karimi
- **Demo student**: `student@academy.com` / `Academy123!`
  - 75% complete on Tajweed (course 1), 30% complete on Usool Al-Fiqh (course 2)
  - 11 study sessions over the last 4 weeks
  - 2 achievements, 5 notifications

## The 5 pages

| Route             | Page                  | Auth     |
| ----------------- | --------------------- | -------- |
| `/`               | Homepage              | public   |
| `/login`          | Auth                  | public   |
| `/courses`        | Courses Catalog       | public   |
| `/courses/:id`    | Course Detail         | public   |
| `/dashboard`      | Student Dashboard     | required |
| `/enroll/:id`     | Enroll stub           | public   |
| `/teacher`        | Teacher coming-soon   | public   |

## Verification checklist

After everything is running:

1. ✅ Homepage loads 6 featured courses from Strapi
2. ✅ Log in as `student@academy.com` / `Academy123!` → JWT persisted → redirect to /dashboard
3. ✅ Dashboard shows 75% Tajweed, 30% Usool Al-Fiqh + 5 notifications
4. ✅ Catalog: filter by Quran category → only Tajweed shows
5. ✅ Course detail: full syllabus (3 modules × 4 lessons) + reviews tab
6. ✅ "Enroll Now" → `/enroll/:id` stub page
7. ✅ Teacher tab on auth page shows "Coming Soon" toast
8. ✅ Log out clears JWT, redirects home
9. ✅ Mobile 375px: bottom nav visible, no horizontal overflow
10. ✅ Arabic Quran verses render RTL via scoped `dir="rtl" lang="ar"`

## Design system

All visual tokens are defined in [`DESIGN.md`](./DESIGN.md) (source of truth) and consumed in two ways:

- **CSS custom properties** — `packages/design-tokens/src/tokens.css` (imported once in `apps/web/src/index.css`)
- **Tailwind theme** — `packages/design-tokens/src/tailwind.ts` (re-exported from `apps/web/tailwind.config.ts`)

Update tokens once in `DESIGN.md` → propagate by hand to both files. The Tailwind theme references the CSS variables so a build-time token change costs one edit per file.

## Stitch references

The 10 Stitch screen exports live in `_1/` through `_10/` at the repo root. They are also copied into `apps/web/src/generated/stitch/{raw,references}/` so the web app can ship them as inert reference material.

| Page              | Mobile  | Desktop |
| ----------------- | ------- | ------- |
| Homepage          | `_1`    | `_7`    |
| Auth              | `_2`    | `_6`    |
| Courses Catalog   | `_3`    | `_8`    |
| Course Detail     | `_5`    | `_10`   |
| Student Dashboard | `_4`    | `_9`    |

Pages are responsive (mobile-first), not two separate components.

## Out of scope (sprint 1)

- Real payment / enrollment flow — `/enroll/:id` is a stub
- Teacher flows — `/teacher` is a placeholder
- Video player and lesson runtime
- Redis / BullMQ background jobs

## License

UNLICENSED — internal project scaffold.
