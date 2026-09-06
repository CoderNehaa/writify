# Writify V1

Writify is a full-stack publishing platform for writers and readers. Writers sign up, verify their account, and author rich-text articles — complete with cover images and category tags — that can be saved as drafts or published for everyone to read. Readers browse articles by category, read them in a clean distraction-free view, and bookmark the ones they want to come back to. Under the hood it's a fairly complete production-shaped app: JWT auth with refresh-token rotation and revocation, Google OAuth, S3-backed file uploads, Redis-backed rate limiting and session storage, centralized logging to CloudWatch, and a Dockerized backend — built as a learning/portfolio project to practice the patterns a real product would need, not just CRUD.

## Features

### Auth
- Email/password signup with OTP email verification (6-digit code, 5-minute TTL)
- Login with email/password
- Google OAuth sign-in/sign-up (auto-provisions an account with a unique username derived from the email)
- Forgot password (emails a new temporary password and revokes existing sessions)
- Logout (revokes the refresh token server-side)
- Username availability check
- Rate limiting on signup, login, verification, forgot-password, and Google auth (10 attempts / 15 min, Redis-backed)

### Articles
- Rich-text authoring (Tiptap editor) with HTML content sanitized server-side before storage
- Optional cover image upload (stored in S3)
- Draft / published status — drafts are only visible to their author
- List articles with optional filtering by category or author
- Edit and delete restricted to the article's author

### Categories
- Public listing of all categories
- Admin-only create, update, and delete (create is an upsert-by-name)
- Articles are tagged to a category and can be filtered by it

### Bookmarks
- Save, list, view, update, and remove bookmarked articles
- One bookmark per user per article, enforced by a unique compound index

### Profile & Settings
- View your own profile and other users' public profiles
- Update username, full name, bio, and avatar (uploaded to S3)
- Change password (revokes other active sessions)
- Soft-delete your account (`isDeleted` flag — email/username become reusable, no hard delete)
- Role (`user` / `admin`) is intentionally not self-editable, to prevent privilege escalation

### Contact
- Public contact form that emails the site inbox

### Platform / Developer Experience
- Interactive API docs via Swagger UI at `/api-docs`, generated from JSDoc annotations on every route
- A module generator CLI that scaffolds a new backend module (schema, type, service, controller, validator, route) from templates, following the project's consistent module shape
- Shared `BaseController`/`BaseService` classes give every module the same CRUD surface and response shape for free

> Note: the client has aspirational Membership/pricing UI (Free / Pro / Enterprise), but there's no billing integration behind it yet — see [Roadmap](#roadmap--whats-next).

## Tech Stack

### Frontend
- **React 18** + **Vite** (with `@vitejs/plugin-react-swc`), TypeScript
- **Zustand** for auth state, **TanStack React Query** for server-state/caching
- **React Router v6** for routing
- **Formik + Yup** and **React Hook Form + Zod** for forms/validation
- **Tailwind CSS** with a shadcn/ui + Radix UI component library (`class-variance-authority`, `clsx`, `tailwind-merge`)
- **Tiptap** rich-text editor for article authoring
- **Axios** for HTTP, **react-toastify** for notifications
- **@react-oauth/google** for Google sign-in

### Backend
- **Node.js** + **Express 5** + TypeScript
- **MongoDB** with **Mongoose** as the ODM
- **JWT** (`jsonwebtoken`) for access/refresh tokens, **bcrypt** for password hashing
- **Redis** for refresh-token storage/revocation and as the rate-limit store (`express-rate-limit` + `rate-limit-redis`)
- **Multer** (in-memory) for multipart uploads, streamed to S3
- **google-auth-library** for verifying Google ID tokens
- **sanitize-html** for XSS-safe article content, **Joi** for request validation
- **Nodemailer** for transactional email (OTP, forgot-password, contact form)
- **Winston** + **winston-cloudwatch** for logging
- **swagger-jsdoc** + **swagger-ui-express** for API documentation
- **Jest**, **Supertest**, and **mongodb-memory-server** for backend testing

### Infrastructure
- **AWS S3** — object storage for cover images and avatars
- **AWS CloudWatch Logs** — centralized log aggregation (log group `writify-server-logs`, stream per environment)
- **Redis** — session/token revocation store and rate-limit backing store
- **Docker** — multi-stage `Dockerfile` for the server (`node:20-alpine` build → slim runtime image), plus a root `docker-compose.yml` that orchestrates MongoDB, Redis, and the server together
- The frontend is a static Vite build, deployed separately from the containerized backend (e.g. S3/CloudFront or a static host)

## Architecture

```
┌─────────────┐        HTTPS / cookies         ┌───────────────────┐
│   Client    │ ───────────────────────────────▶│   Express Server   │
│ (React+Vite)│◀─────────────────────────────── │  (/api/* routes)   │
└─────────────┘        JSON responses           └─────────┬─────────┘
                                                            │
                          ┌─────────────────────────────────┼─────────────────────────────┐
                          │                                 │                             │
                    ┌─────▼─────┐                    ┌──────▼──────┐              ┌───────▼───────┐
                    │  MongoDB  │                    │    Redis     │              │    AWS S3     │
                    │ (Mongoose)│                    │ refresh-token │              │ cover images /│
                    │  articles,│                    │  revocation & │              │    avatars    │
                    │  users,   │                    │  rate limits  │              └───────────────┘
                    │  etc.     │                    └──────────────┘
                    └───────────┘
                                                            │
                                                    ┌───────▼───────┐
                                                    │  CloudWatch    │
                                                    │  Logs (Winston)│
                                                    └───────────────┘
```

- The client talks to the server exclusively through `/api/*` REST endpoints, authenticating via httpOnly cookies (`access_token`, `refresh_token`) rather than tokens in local storage.
- `TokenService` validates the access token first and transparently falls back to the refresh token if it's expired, checking it against the value held in Redis (so logout or a password change can revoke a session before it naturally expires) and rotating both tokens on success.
- File uploads (avatars, cover images) are parsed in memory by Multer, streamed straight to S3, and the resulting public URL is what's persisted on the Mongo document — the server itself never writes files to disk.
- A manual dependency-injection container (`modules/container.ts`) constructs each service once and injects it into the corresponding controllers and middleware, so route files just wire `router.method(path, validator, controller.handler)`.
- Every module (auth, user, article, category, bookmark, contact) follows the same file shape — `schema` → `type` → `service` → `controller` → `validator` → `route` — which is also what the built-in module generator scaffolds for new modules.

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or hosted) and Redis — or just use Docker Compose, which provides both
- An AWS account with an S3 bucket (for uploads) and CloudWatch access (for logging)
- A Google Cloud OAuth client ID (for Google sign-in)
- An email account for sending transactional mail (e.g. a Gmail app password)

### Option A: Docker Compose (backend + its dependencies)

```bash
cp server/.env.example server/.env   # fill in real values
docker compose up --build            # starts mongo, redis, and the server
```

The API is then available at `http://localhost:8088`, MongoDB at `27017`, and Redis at `6379`. See `DOCKER.md` for more detail. Data persists in the `mongo_data` volume across restarts.

### Option B: Run client and server locally

**Server**
```bash
cd server
cp .env.example .env   # fill in real values, see below
npm install
npm run dev             # hot-reload dev server on PORT (default 8088)
```

**Client**
```bash
cd client
cp .env.example .env   # set VITE_API_BASE_URL and VITE_GOOGLE_CLIENT_ID
npm install
npm run dev             # Vite dev server
```

### Environment variables

**Server (`server/.env`)**

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` / `production` / `test` |
| `DB_CONNECTION_URL` | MongoDB connection string |
| `PORT` | Server port (defaults to `8088`) |
| `ACCESS_TOKEN_SECRET_KEY` | JWT signing secret for access tokens |
| `REFRESH_TOKEN_SECRET_KEY` | JWT signing secret for refresh tokens |
| `EMAIL_SENDER_NAME` | Display name used on outgoing emails |
| `EMAIL_SENDER_MAIL` | Sending mailbox address (also receives contact-form submissions) |
| `EMAIL_SENDER_PASSWORD` | App password for the sending mailbox (Gmail) |
| `CORS_ORIGIN` | Comma-separated list of allowed origins |
| `AWS_REGION` | AWS region for S3/CloudWatch |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_S3_BUCKET_NAME` | S3 bucket for cover images and avatars |
| `GOOGLE_CLIENT_ID` | Verifies Google ID tokens server-side |
| `REDIS_URL` | Redis connection string (defaults to `redis://localhost:6379`) |

**Client (`client/.env`)**

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the API (default `http://localhost:8088/api/`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for the sign-in button |

### Running tests

```bash
cd server
npm test   # Jest + Supertest against an in-memory MongoDB instance
```

## API Overview

Full interactive documentation is served at `GET /api-docs` (Swagger UI) once the server is running. Summary of the surface, all mounted under `/api`:

| Module | Endpoints |
|---|---|
| **Auth** | `POST /auth/signup`, `POST /auth/login`, `POST /auth/google`, `POST /auth/verify-account`, `POST /auth/forgot-password`, `POST /auth/logout`, `POST /auth/check-username` |
| **User** | `GET /user/me`, `GET /user/data/:userId`, `PUT /user/`, `DELETE /user/`, `PATCH /user/password` |
| **Category** | `GET /category/all` (public), `GET /category/data/:id`, `POST /category/new` (admin), `PUT /category/:id` (admin), `DELETE /category/:id` (admin) |
| **Article** | `POST /article/new`, `GET /article/all`, `GET /article/data/:id`, `PUT /article/:id`, `DELETE /article/:id` |
| **Bookmark** | `POST /bookmark/new`, `GET /bookmark/all`, `GET /bookmark/data/:id`, `PUT /bookmark/:id`, `DELETE /bookmark/:id` |
| **Contact** | `POST /contact` (public) |

Unless marked public/admin, all endpoints require an authenticated session (httpOnly `access_token`/`refresh_token` cookies).

## Roadmap

Writify is being built incrementally, one coherent version at a time — each version below adds new product surface *and* only the new infrastructure that surface actually requires, rather than front-loading tooling before there's a reason for it.

| Version | Status | Features | Core Skills & Tech | Deployment & Infra |
|---|---|---|---|---|
| **V1** | ✅ Shipped | Auth (email/password + OTP + Google OAuth), Article CRUD (draft/publish), Categories, Bookmarks, Profile/Settings, Contact | React, Vite, Zustand, TanStack Query, Tailwind, TypeScript, debouncing (username availability check, header search), Node/Express, MongoDB/Mongoose, Redis, JWT, **AWS S3** (file storage), **AWS CloudWatch** (Winston log transport), sanitize-html, Joi | Docker (multi-stage build), Docker Compose (Mongo + Redis + server), client built via Vite and deployed as static assets |
| **V2** | 🚧 Planned | Like, Comment (flat), Follow (direct), in-app Notifications (REST-polled) | Compound unique indexes, atomic `$inc` counters, Mixpanel (product analytics: signups, views, likes, comments, follows) | GitHub Actions CI — lint + Jest on every PR (no new runtime infra needed) |
| **V3** | 🚧 Planned | 1:1 Chat (text-only, mutual-follow gated), Notifications upgraded from polling to real-time push | Socket.io, WebSocket auth via existing JWT cookie, **Redis Pub/Sub** (fans out real-time events across server instances) | Load balancer with WebSocket-upgrade support (e.g. AWS ALB) |
| **V4** | 🚧 Planned | Real subscription billing (Free / Pro / Enterprise made functional): checkout, plan-gating middleware | Stripe (or Razorpay) Subscriptions API, webhook signature verification, idempotent event handling, subscription state machine, **AWS Secrets Manager / SSM Parameter Store** (secrets management) | Public HTTPS endpoint for payment webhooks via Route 53 (DNS) + ACM (TLS) |
| **V5** | 🚧 Planned | AI-generated title/tag suggestions (gated to paid tiers via V4's billing state), trending algorithm blending organic engagement with a bounded promotion boost | OpenAI API, BullMQ + Redis (background job queue for the AI generation call — the first queue introduced in the system, added because this specific call is slow/external) | Job-queue worker runs as its own container/service, deployed and scaled independently from the API service |

**Design principle behind the sequencing:** each version's new infrastructure is introduced exactly where a concrete requirement demands it — CI once the module count justifies it (V2), the Redis Pub/Sub adapter once real-time fan-out exists (V3), secrets management and a stable public endpoint once real payment webhooks exist (V4), and a background job queue only once there's an actual slow/external call to run outside the request cycle (V5) — rather than adopting any of them speculatively.

**Other planned improvements (not tied to a specific version):**
- Full-text search across articles
- Move the presigned-upload path in `S3Service` from its current hardcoded-for-video state to a general-purpose direct-upload flow
- Author-facing analytics (views, read time) using the `recharts` dependency already in the client

## Challenges & Learnings

- **Token revocation with stateless JWTs**: access/refresh tokens are great for statelessness but bad for "log this session out right now." Backing refresh tokens with Redis (`refresh_token:{userId}`) turned an unrevokable JWT into one that can be invalidated on logout or password change, while still avoiding a DB hit on every request for the common case.
- **Keeping every module consistent by construction**: rather than relying on code review to keep new modules structurally consistent, a small module generator scaffolds the schema/type/service/controller/validator/route files from templates, so `BaseController`/`BaseService` conventions aren't something you have to remember to follow.
- **Uploads without touching disk**: parsing multipart uploads in memory with Multer and streaming straight to S3 avoided the class of bugs (orphaned temp files, disk pressure) that come with disk-based upload handling — at the cost of the 5MB in-memory limit currently enforced per upload.
- **Defense against mass assignment**: request validation is section-scoped (body/query/params) and rejects unrecognized keys outright rather than silently stripping them, which surfaced a few places (like the role field on user updates) where an endpoint needed to explicitly say what it does *not* accept.
