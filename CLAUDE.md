# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wardrobe App — a personal project (first GitHub project for this user) where users upload photos of clothing items, tag them (category, color, season, style), and assemble outfits from items they own.

MVP scope, in order:
1. Upload a clothing item (photo + metadata)
2. Add category, color, season, and style to an item
3. View all clothing items
4. Create and save outfits from existing items
5. Simple, clean UI

**Development rule (explicit user instruction): build step by step. Do not implement multiple MVP features in one pass — land one working feature before starting the next. Prioritize simple working features over advanced/AI features; AI features are explicitly out of scope until the MVP above is solid.**

## Tech stack

- Next.js (App Router, TypeScript, `src/` directory)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Supabase (`@supabase/supabase-js` + `@supabase/ssr`) for auth, Postgres data, and image storage
- Deployed/hosted via GitHub (repo not yet pushed)

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is no test runner configured yet.

## Architecture

- App Router lives in `src/app`. `src/app/layout.tsx` is the root layout (Geist fonts), `src/app/page.tsx` is the home page — both still the unmodified create-next-app scaffold.
- Supabase access goes through `src/lib/supabase/`:
  - `client.ts` — `createBrowserClient`, for use in Client Components.
  - `server.ts` — `createServerClient`, for use in Server Components/Route Handlers; reads/writes auth cookies via `next/headers`.
  - Always create a fresh client per request/component via these helpers rather than sharing a module-level client instance (this is the pattern `@supabase/ssr` expects for correct cookie handling).
- Environment variables: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings. No Supabase project/schema exists yet — tables for clothing items and outfits still need to be designed and created (e.g. via the Supabase SQL editor or migrations) before the upload/list features can be built.
- No image storage bucket, auth flow, or data model has been built yet — this scaffold only wires up the Supabase client helpers and Tailwind/Next.js base. The next step per the MVP order above is the clothing item upload feature.
