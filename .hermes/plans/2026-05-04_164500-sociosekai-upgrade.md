# SOCIOSEKAI Major Upgrade Plan

**Date:** May 4, 2026  
**Goal:** Ubah sociosekai-clone dari frontend-only jadi platform forum multimodal terbaik, melampaui freesekai.vercel.app

---

## Current State

| Layer | Status | Detail |
|-------|--------|--------|
| UI | ✅ | shadcn/ui v4, dark mode, responsive |
| DB Schema | ✅ | SQLite — users, posts, likes, comments, rooms |
| Auth | ⚠️ | next-auth routes ready, fallback in-memory on Vercel |
| Posts API | ⚠️ | CRUD ready, fallback static JSON on Vercel |
| AI | ✅ | DeepSeek composer, suggester, chat |
| Music | ✅ | iTunes search + embed |
| Persistence | ❌ | better-sqlite3 CANNOT run on Vercel serverless |

**Root Cause:** All backend falls back to memory/static JSON on Vercel because SQLite needs writable filesystem.

---

## Upgrade Plan: 3 Phase

### 🔥 Phase 1: Database to Turso (persistent backend)

**Why Turso:** Distributed SQLite that runs on Vercel Edge. Same SQL syntax, zero migration pain.

Steps:
1. Install `@libsql/client` + remove `better-sqlite3`
2. Create Turso database `sociosekai` via Turso CLI
3. Rewrite `src/lib/db.ts` — replace `better-sqlite3` with `@libsql/client`
4. Update all API routes to use Turso client:
   - `src/app/api/auth/register/route.ts`
   - `src/app/api/auth/login/route.ts`
   - `src/app/api/auth/me/route.ts`
   - `src/app/api/posts/route.ts`
   - `src/app/api/posts/[id]/like/route.ts`
   - `src/app/api/posts/[id]/comments/route.ts`
5. Remove all `try/catch` in-memory fallbacks
6. Add `.env` with `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
7. Add env vars to Vercel project

**Files:** 
- `src/lib/db.ts` (full rewrite)
- `src/app/api/**/*.ts` (6 files — remove fallback, use Turso)
- `.env.local` (new)
- `package.json` (swap deps)

**Verification:** POST a post → refresh → still there. Register user → login → persists.

---

### ⚡ Phase 2: Full Auth System

Steps:
1. Wire next-auth properly with Turso adapter
2. Add login/signup pages (`src/app/login/page.tsx`, `src/app/signup/page.tsx`)
3. Add protected routes (create post requires login)
4. Add user profile page (`src/app/profile/page.tsx`)
5. Show real usernames on posts (not "Unknown")
6. Session persistence via JWT/next-auth

**Files:**
- `src/app/login/page.tsx` (new)
- `src/app/signup/page.tsx` (new)
- `src/app/profile/page.tsx` (new)
- `src/app/create/page.tsx` (add auth guard)
- `src/lib/auth.ts` (new)
- `src/components/layout/Header.tsx` (add login/signup/profile links)

---

### 🎨 Phase 3: Feature Expansion

Steps:
1. **Rooms system** — real-time chat rooms with key access
   - `src/app/room/page.tsx` (full rewrite — list rooms, create, join)
   - `src/app/room/[id]/page.tsx` (new — room chat)
   - `src/app/api/rooms/route.ts` (new)
   - `src/app/api/rooms/[id]/messages/route.ts` (new)
2. **Music Rooms** — dedicated music sharing rooms
3. **Notifications** — sonner toasts for likes/comments
4. **Markdown support** — render post body as markdown
5. **Image upload** — replace placeholder with real upload (UploadThing/Cloudinary)
6. **Polish UI** — animations, loading states, empty states

**Files:**
- `src/app/room/page.tsx`
- `src/app/room/[id]/page.tsx` (new)
- `src/app/api/rooms/route.ts` (new)
- `src/app/api/rooms/[id]/messages/route.ts` (new)
- `src/components/room/*` (new)
- `src/components/post/PostCard.tsx` (add markdown)
- `src/components/layout/*` (polish)

---

## Comparison After Upgrade

| Feature | freesekai | SOCIOSEKAI (after) |
|---------|-----------|-------------------|
| Create Post | ✅ | ✅ |
| Post Persistence | ✅ | ✅ (Turso) |
| Auth/Login | ❌ | ✅ (next-auth) |
| Likes/Comments | ✅ | ✅ |
| AI Composer | ❌ | ✅ (DeepSeek) |
| Music Embed | ✅ (Apple Music) | ✅ (iTunes) |
| Rooms | ❌ | ✅ |
| Real-time | ❌ | ⚠️ Phase 3 |
| Mobile UI | ⚠️ | ✅ |
| Dark Mode | ✅ | ✅ |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Turso free tier limits | 9GB storage, 1B rows read — more than enough |
| better-sqlite3 syntax differences | Turso uses libsql, 99% compatible. Test each route |
| next-auth v5 beta instability | v5 beta is stable enough; fallback to v4 if issues |
| Cold starts on Vercel | Turso edge = low latency |

## Execution Order

1. **Phase 1** dulu — tanpa persistence, sisanya gak ada artinya
2. **Phase 2** — auth bikin semuanya terasa "real platform"
3. **Phase 3** — fitur yang bikin kita LEBIH dari freesekai

## Open Questions

- Turso token: udah punya? Atau perlu bikin akun?
- Mau deploy preview dulu atau langsung production?
- Image upload: UploadThing (free) atau Cloudinary?
