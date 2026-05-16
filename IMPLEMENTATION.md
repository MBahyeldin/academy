# Master Implementation Plan: Modern Islamic Academy System

## Context

This is the master implementation prompt for **Claude Opus 4.7** to autonomously scaffold and implement the Modern Islamic Academy System from scratch, using 10 Stitch-exported screens as visual references.

The project is a bilingual (English UI shell + Arabic content rendering) Quranic and Islamic Studies platform for students. It is a three-app pnpm monorepo built simultaneously. All architectural decisions have been resolved and are documented below.

**Source references:** `DESIGN.md` and screens `_1` through `_10` (each with `screen.png` + `code.html`).

---

## Resolved Architectural Decisions

| Decision | Resolution |
|---|---|
| Language strategy | English UI shell; Arabic content uses `dir="rtl"` scoped to content blocks only — NOT global |
| RTL approach | Tailwind `rtl:` variants avoided globally; scoped per Quranic/Arabic text container |
| Strapi | Included — owns auth, content, and curriculum |
| Teacher flows | Out of scope for this sprint — stub route to placeholder |
| Payment | Stubbed — "Enroll Now" routes to a placeholder page |
| Auth flow | Strapi issues JWT → Express validates with shared secret → Postgres tracks by UUID |
| Frontend API topology | Two direct clients: `strapiClient.ts` + `apiClient.ts`, both attach same JWT |
| Dashboard data source | Express API + PostgreSQL only |
| Curriculum structure | Lessons live in Strapi (Course → Module → Lesson) |
| Redis / BullMQ | Dropped from this sprint entirely |
| Seed data | Realistic Islamic content (see seed spec below) |
| Infrastructure | Local PostgreSQL — no Docker |
| Target agent | Claude Opus 4.7 (autonomous CLI execution) |

---

## Monorepo Structure

```
academy/
  apps/
    web/          # React SPA (Vite + TypeScript + Tailwind + shadcn/ui)
    api/          # Express + Prisma + PostgreSQL
    cms/          # Strapi instance (auth + content)
  packages/
    ui/           # Shared shadcn/ui component wrappers
    design-tokens/# CSS vars + Tailwind theme extension
    types/        # Shared TypeScript interfaces + Zod schemas
    utils/        # Shared utility functions
    api-client/   # strapiClient.ts + apiClient.ts
  tooling/
    eslint/
    typescript/
  pnpm-workspace.yaml
  package.json    # root scripts: dev, build, lint, typecheck
```

---

## Phase 1: Monorepo Initialization

1. Create `pnpm-workspace.yaml` declaring all `apps/*` and `packages/*`
2. Root `package.json` with scripts:
   - `dev`: runs all three apps concurrently via `pnpm --filter` + `concurrently`
   - `build`, `lint`, `typecheck`
3. Shared `tooling/typescript/base.json` with `strict: true`
4. Shared `tooling/eslint/` flat config with TypeScript + React rules

---

## Phase 2: Design Tokens Package (`packages/design-tokens`)

Extract from `DESIGN.md` frontmatter and generate:

### CSS Variables (`tokens.css`)
All colors from DESIGN.md as CSS custom properties:
```css
--color-primary: #003527;
--color-secondary: #9b4500;
--color-surface: #f9f9ff;
/* ... all tokens */
```

### Tailwind Extension (`tailwind.config.ts`)
```ts
// Extend theme with all DESIGN.md tokens
colors: { primary, secondary, surface, 'on-surface', ... }
fontFamily: { serif: ['Noto Serif'], sans: ['IBM Plex Sans'] }
borderRadius: { sm: '0.25rem', DEFAULT: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', full: '9999px' }
spacing: { xs: '8px', sm: '16px', md: '24px', lg: '40px', xl: '64px' }
```

### Google Fonts
Load `Noto Serif` (700) and `IBM Plex Sans` (400, 500, 600) in the web app's `index.html`.

---

## Phase 3: Shared Types Package (`packages/types`)

Define TypeScript interfaces and Zod schemas for all data contracts:

### Strapi Entities
```ts
interface StrapiCourse {
  id: number
  title: string
  description: string
  category: StrapiCategory
  level: 'beginner' | 'intermediate' | 'advanced'
  instructor: StrapiInstructor
  thumbnail: string
  price: number // stubbed, not used in payment flow
  modules: StrapiModule[]
  reviews: StrapiReview[]
}
interface StrapiModule { id: number; title: string; order: number; lessons: StrapiLesson[] }
interface StrapiLesson { id: number; title: string; order: number; videoUrl: string; durationMinutes: number; type: 'video' | 'reading' | 'quiz' }
interface StrapiInstructor { id: number; name: string; bio: string; avatar: string; rating: number; expertise: string[] }
interface StrapiCategory { id: number; name: string; slug: string; icon: string }
interface StrapiReview { id: number; rating: number; content: string; studentName: string; createdAt: string }
```

### API Entities (Express/Postgres)
```ts
interface UserProgress { userId: string; courseId: number; percentage: number; lastLessonId: number; lastStudiedAt: string }
interface StudySession { id: string; userId: string; courseId: number; durationMinutes: number; date: string }
interface Achievement { id: string; userId: string; type: AchievementType; awardedAt: string }
interface Notification { id: string; userId: string; message: string; type: 'info' | 'success' | 'warning'; read: boolean; createdAt: string }
interface DashboardData { progress: UserProgress[]; studyHours: StudySession[]; achievements: Achievement[]; notifications: Notification[] }
```

---

## Phase 4: API Client Package (`packages/api-client`)

### `strapiClient.ts`
```ts
// Base URL from VITE_STRAPI_URL env var
// Attaches Authorization: Bearer <jwt> from auth store
// Methods: getCourses(), getCourse(id), getCategories(), getInstructors()
// fetchFromStrapi<T>(endpoint: string): Promise<T>
```

### `apiClient.ts`
```ts
// Base URL from VITE_API_URL env var
// Attaches same JWT
// Methods: getDashboard(), getProgress(), getNotifications(), syncUser(), stubEnroll()
// fetchFromApi<T>(endpoint: string): Promise<T>
```

Both clients throw typed errors and handle 401 by clearing auth store + redirecting to /login.

---

## Phase 5: Strapi CMS (`apps/cms`)

### Bootstrap
```bash
npx create-strapi-app@latest cms --no-run
cd apps/cms
```

### Content Types to Create
Via Strapi schema files (`src/api/*/content-types/*/schema.json`):

1. **category**: `name` (string, required), `slug` (uid, from name), `icon` (string)
2. **instructor**: `name`, `bio` (text), `avatar` (media), `rating` (decimal), `expertise` (json array)
3. **course**: `title`, `description` (richtext), `level` (enum), `price` (decimal), `thumbnail` (media), relations to category (manyToOne), instructor (manyToOne), modules (oneToMany), reviews (oneToMany)
4. **module**: `title`, `order` (integer), relation to course (manyToOne), lessons (oneToMany)
5. **lesson**: `title`, `order` (integer), `videoUrl` (string), `durationMinutes` (integer), `type` (enum: video/reading/quiz), relation to module (manyToOne)
6. **review**: `rating` (integer 1-5), `content` (text), `studentName` (string), relation to course (manyToOne)

### Auth Configuration
- Enable Users & Permissions plugin (built-in)
- Set `JWT_SECRET` in `.env` — **must match** `apps/api/.env` `JWT_SECRET`
- Enable public read access for: courses, categories, instructors, reviews
- Enable authenticated access for: course enrollment check

### Strapi `.env`
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generate>
API_TOKEN_SALT=<generate>
ADMIN_JWT_SECRET=<generate>
TRANSFER_TOKEN_SALT=<generate>
JWT_SECRET=academy-shared-jwt-secret-change-in-prod
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=academy_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

---

## Phase 6: Express API (`apps/api`)

### Bootstrap
```bash
mkdir -p apps/api/src/{routes,services,repositories,middlewares,domain}
```

### Prisma Schema (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String         @id @default(uuid())
  strapiId      Int            @unique
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  enrollments   Enrollment[]
  progress      Progress[]
  sessions      StudySession[]
  achievements  Achievement[]
  notifications Notification[]
}

model Enrollment {
  id         String   @id @default(uuid())
  userId     String
  courseId   Int
  enrolledAt DateTime @default(now())
  status     String   @default("active")
  user       User     @relation(fields: [userId], references: [id])
}

model Progress {
  id            String   @id @default(uuid())
  userId        String
  courseId      Int
  percentage    Int      @default(0)
  lastLessonId  Int?
  lastStudiedAt DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id])

  @@unique([userId, courseId])
}

model StudySession {
  id              String   @id @default(uuid())
  userId          String
  courseId        Int
  durationMinutes Int
  date            DateTime @default(now())
  user            User     @relation(fields: [userId], references: [id])
}

model Achievement {
  id        String   @id @default(uuid())
  userId    String
  type      String
  awardedAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  message   String
  type      String   @default("info")
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

### JWT Middleware (`middlewares/auth.ts`)
```ts
// Verify JWT using same JWT_SECRET as Strapi
// Attach decoded payload (id = strapiId) to req.user
// Return 401 if missing or invalid
```

### API Endpoints
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/sync` | Create/find User by strapiId from JWT payload |
| GET | `/api/dashboard` | Aggregated: progress + study hours + achievements + notifications |
| GET | `/api/progress` | All Progress records for authenticated user |
| GET | `/api/progress/:courseId` | Progress for specific Strapi course ID |
| GET | `/api/notifications` | User notifications, newest first |
| GET | `/api/achievements` | User achievements |
| POST | `/api/enrollments` | Stub: returns `{ status: "coming_soon", message: "Enrollment launching soon" }` |

### Express `.env`
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academy_api
JWT_SECRET=academy-shared-jwt-secret-change-in-prod
STRAPI_URL=http://localhost:1337
```

---

## Phase 7: React Frontend (`apps/web`)

### Bootstrap
```bash
pnpm create vite apps/web --template react-ts
```

### Dependencies
```
react-router-dom@7  @tanstack/react-query  zustand  react-hook-form  @hookform/resolvers
zod  framer-motion  lucide-react  clsx  tailwind-merge  class-variance-authority
@radix-ui/react-* (via shadcn/ui init)
```

### Vite `.env`
```env
VITE_STRAPI_URL=http://localhost:1337
VITE_API_URL=http://localhost:3001
```

### Feature-Driven Structure
```
src/
  app/
    router/         # React Router v7 routes
    providers/      # QueryClientProvider, AuthProvider, ThemeProvider
    layouts/        # RootLayout, AuthLayout, DashboardLayout

  features/
    auth/           # Login, Register, role selection
    home/           # Homepage (screens _1 + _7)
    courses/        # Catalog + Detail (screens _3+_8, _5+_10)
    dashboard/      # Student dashboard (screens _4 + _9)

  entities/
    user/           # User type, useCurrentUser hook
    course/         # useCourses, useCourse hooks → strapiClient
    progress/       # useProgress, useDashboard hooks → apiClient

  shared/
    components/     # Button, Card, Badge, ProgressBar, Skeleton, EmptyState
    hooks/          # useMediaQuery, useRTLContent, useAuth
    lib/            # cn(), formatDate(), formatDuration()
    api/            # re-exports from packages/api-client

  generated/
    stitch/
      raw/          # original code.html files copied here for reference
      references/   # screenshots for visual reference
```

### Auth Store (`features/auth/auth.store.ts`)
```ts
// Zustand store
interface AuthState {
  jwt: string | null
  user: { id: number; email: string; username: string } | null
  role: 'student' | 'teacher' | null
  setAuth: (jwt: string, user: StrapiUser) => void
  clearAuth: () => void
}
// Persist to localStorage
```

### Route Structure
```
/                   → HomePage (public)
/login              → AuthPage (public, redirects if authed)
/courses            → CourseCatalogPage (public)
/courses/:id        → CourseDetailPage (public)
/dashboard          → StudentDashboardPage (protected, student only)
/enroll/:courseId   → EnrollStubPage ("Coming soon" placeholder)
/teacher            → TeacherComingSoonPage (placeholder, out of scope)
*                   → NotFoundPage
```

---

## Phase 8: The 5 Pages

Use BOTH the mobile screen AND desktop screen from Stitch as visual references for each page. Build responsive — mobile-first — not two separate components.

### Screen Mapping
| Page | Mobile Reference | Desktop Reference |
|---|---|---|
| Homepage | `_1/screen.png` + `_1/code.html` | `_7/screen.png` + `_7/code.html` |
| Auth | `_2/screen.png` + `_2/code.html` | `_6/screen.png` + `_6/code.html` |
| Courses Catalog | `_3/screen.png` + `_3/code.html` | `_8/screen.png` + `_8/code.html` |
| Course Detail | `_5/screen.png` + `_5/code.html` | `_10/screen.png` + `_10/code.html` |
| Student Dashboard | `_4/screen.png` + `_4/code.html` | `_9/screen.png` + `_9/code.html` |

### Implementation Rules
- **DO NOT** copy Stitch HTML directly into React components
- **DO** use Stitch as visual reference: extract layout intent, spacing, color usage, component hierarchy
- Rebuild every section as semantic, accessible React + Tailwind
- Apply `dir="rtl"` only to Arabic text content containers (Quran verses, Arabic course titles)
- All components must be typed — no `any`
- Loading states: use `<Skeleton>` components
- Empty states: use `<EmptyState>` with meaningful message
- Error states: use error boundary + inline error UI

### Homepage (`features/home/HomePage.tsx`)
Sections in order: StickyHeader → HeroSection → WhyChooseUs → FeaturedCourses (grid) → Testimonials → StatsBar → Footer
- HeroSection: headline + subtext + two CTAs (Browse Courses, Start Free)
- FeaturedCourses: TanStack Query → `strapiClient.getCourses({ limit: 6 })`
- StatsBar: "15,000+ Students", "50+ Scholars", "120+ Courses" (static)

### Auth (`features/auth/AuthPage.tsx`)
- Mobile: single card with role toggle (Teacher tab shows "Coming Soon" tooltip)
- Desktop: split-screen — left branding panel, right form
- Form: email + password via React Hook Form + Zod
- On submit: POST to Strapi `/api/auth/local` → JWT → `auth.store.setAuth()` → POST `/api/auth/sync` → redirect `/dashboard`
- Social login buttons (Google, Facebook): render but show "Coming soon" toast on click
- Register tab: POST to Strapi `/api/auth/local/register`

### Courses Catalog (`features/courses/CourseCatalogPage.tsx`)
- Sticky search bar (client-side filter)
- Category filter chips → query param `?category=fiqh`
- Level filter (desktop sidebar): query param `?level=beginner`
- Course grid: TanStack Query → `strapiClient.getCourses({ category, level, search })`
- CourseCard: thumbnail, title, instructor name + avatar, rating stars, category chip, price (display only)
- Pagination: simple prev/next

### Course Detail (`features/courses/CourseDetailPage.tsx`)
- Hero banner with course thumbnail + overlay
- Breadcrumb: Home > Courses > [Course Name]
- Tabs: About | Curriculum | Instructor | Reviews
- Curriculum: accordion of Modules → Lessons
- Sticky sidebar: price display + "Enroll Now" → `/enroll/:courseId` (stub)

### Student Dashboard (`features/dashboard/StudentDashboardPage.tsx`) — protected route
- NextLessonBanner: lowest-percentage enrolled course → next lesson + scheduled time
- Stats row: total courses, completion %, total study hours
- StudyHoursChart: weekly bar chart from `StudySession` data
- EnrolledCourses: Progress from API + Course metadata from Strapi (parallel queries, merge by courseId)
- AchievementBadges + NotificationsSidebar

---

## Phase 9: Seed Data

### Strapi Seed

**Categories (4):**
| Name | Icon |
|---|---|
| Quran | `book-open` |
| Hadith | `scroll` |
| Fiqh | `scale` |
| Arabic | `languages` |

**Instructors (3):**
| Name | Specialty | Rating |
|---|---|---|
| Sheikh Abdullah Al-Mahmoud | Quran & Tajweed | 4.9 |
| Dr. Fatima Al-Zahrawi | Fiqh & Usool | 4.8 |
| Ustadh Yusuf Karimi | Arabic grammar | 4.7 |

**Courses (6):**
| # | Title | Category | Level | Instructor | Price |
|---|---|---|---|---|---|
| 1 | Tajweed Al-Quran: The Art of Quranic Recitation | Quran | beginner | Sheikh Abdullah | $49 |
| 2 | Usool Al-Fiqh: Foundations of Islamic Jurisprudence | Fiqh | intermediate | Dr. Fatima | $79 |
| 3 | Aqeedah 101: Islamic Creed & Theology | Hadith | beginner | Sheikh Abdullah | $39 |
| 4 | Introduction to Hadith Sciences | Hadith | intermediate | Dr. Fatima | $59 |
| 5 | Arabic Grammar (Nahw): From Zero to Fluency | Arabic | beginner | Ustadh Yusuf | $49 |
| 6 | Seerah: Life of the Prophet ﷺ | Hadith | beginner | Sheikh Abdullah | $29 |

Each course: 3 modules × 4 lessons = 12 lessons + 3 reviews.

### PostgreSQL Seed (`apps/api/prisma/seed.ts`)

**Demo student:** `student@academy.com` / `Academy123!` (create in Strapi first, strapiId: 1)

**Progress:**
- Course 1 (Tajweed): 75% complete, lastLessonId: 9, 8 study sessions over 4 weeks
- Course 2 (Usool Al-Fiqh): 30% complete, lastLessonId: 4, 3 study sessions

**Achievements:** `first_lesson` (day 1), `7_day_streak` (1 week ago)

**Notifications (5, all unread):**
1. "Your next Tajweed lesson starts Sunday at 8:00 PM"
2. "New lesson added to Usool Al-Fiqh"
3. "You've completed Module 2 of Tajweed!"
4. "Sheikh Abdullah posted a new Q&A session"
5. "Reminder: You haven't studied in 3 days"

---

## Phase 10: Responsive & Accessibility Checklist

For each page verify:
- [ ] Renders correctly at 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] No horizontal scroll on any breakpoint
- [ ] Keyboard navigable (Tab through all interactive elements)
- [ ] Focus rings visible (`focus-visible:` Tailwind utilities)
- [ ] Arabic content blocks use `dir="rtl"` and `lang="ar"`
- [ ] All images have `alt` text
- [ ] Color contrast meets WCAG AA
- [ ] Loading skeletons shown during TanStack Query fetch
- [ ] Empty states shown when arrays are empty

---

## Verification Steps

```bash
# 1. Start Strapi
cd apps/cms && pnpm develop
# Visit http://localhost:1337/admin — complete setup, then run seed

# 2. Start Express API
cd apps/api && pnpm prisma migrate dev && pnpm prisma db seed && pnpm dev
# API on http://localhost:3001

# 3. Start web
cd apps/web && pnpm dev
# Visit http://localhost:5173
```

### Critical paths to verify:
1. Homepage loads 6 courses from Strapi (not mock data)
2. Login with `student@academy.com` / `Academy123!` → JWT stored → redirect to dashboard
3. Dashboard shows 75% Tajweed, 30% Fiqh progress + 5 notifications
4. Courses Catalog: filter by Quran category shows correct subset
5. Course Detail: full syllabus with modules + lessons from Strapi
6. "Enroll Now" → `/enroll/:id` stub page (no crash, no payment form)
7. Teacher role selection shows "Coming Soon" tooltip (no crash)
8. Logout clears JWT, redirects to homepage
9. Mobile 375px: bottom nav visible, no overflow
10. Arabic content blocks render RTL

---

## Critical Files Reference

| File | Purpose |
|---|---|
| `DESIGN.md` | Design tokens, typography, color system — source of truth |
| `_1/` – `_10/` | Stitch screen references (code.html + screen.png per screen) |
| `packages/design-tokens/tokens.css` | Generated CSS custom properties |
| `packages/design-tokens/tailwind.config.ts` | Tailwind theme extension |
| `packages/types/index.ts` | All shared TypeScript interfaces + Zod schemas |
| `packages/api-client/strapiClient.ts` | Strapi API client |
| `packages/api-client/apiClient.ts` | Express API client |
| `apps/cms/src/api/*/schema.json` | Strapi content type schemas |
| `apps/api/prisma/schema.prisma` | PostgreSQL data model |
| `apps/api/src/middlewares/auth.ts` | Shared JWT verification middleware |
| `apps/api/prisma/seed.ts` | PostgreSQL seed with demo data |
| `apps/web/src/features/auth/auth.store.ts` | Zustand auth store (JWT persistence) |
| `apps/web/src/app/router/index.tsx` | All routes including protected routes |
