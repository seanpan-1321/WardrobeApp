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
- Deployed/hosted via GitHub (repo pushed to origin/main)

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is no test runner configured yet.

## Architecture

- App Router lives in `src/app`, now split into multiple routes: `/` (Home — saved outfits view), `/clothes` (My Clothes — wardrobe grid + add/edit), `/create-outfit` (full-page outfit builder). `src/app/layout.tsx` is the root layout (Geist fonts, page metadata) and wraps every route in `WardrobeProvider` + renders `NavBar` above `children`.
- `src/lib/wardrobe-context.tsx` holds the shared `items`/`outfits` state and CRUD handlers (`saveItem`, `deleteItem`, `saveOutfit`, `deleteOutfit`) behind a `useWardrobe()` hook. On mount it loads data from Supabase (`clothing_items` and `outfits` tables); all writes optimistically update local state and fire async Supabase upserts/deletes. Also manages `user` state and `signOut`. Error logging uses `error.message`/`error.code` for readability.
- `src/components/NavBar.tsx` is the top nav (Home / My Clothes / Create Outfit), active-route highlighted via `usePathname`.
- `src/components/ClothingCard.tsx` and `src/components/WardrobeGrid.tsx` render a single item / the item grid respectively; `src/components/AddClothingForm.tsx` is the controlled form (its own `useState` for form fields) that calls an `onAdd` callback prop with a new `ClothingItem` on submit (also reused for editing via an `initialItem` prop).
- `src/components/CreateOutfitForm.tsx` and `src/components/OutfitCard.tsx` are the outfit equivalents — the form takes `initialOutfit` for editing and is used both full-page (`/create-outfit`) and inside `Modal` (editing from Home).
- `src/lib/mock-items.ts` defines the `ClothingItem` type (`id`, `name`, `category`, `clothingType`, `color`, `season`, `style`, `occasion`, `material`, `favorite`, optional `photoUrl`). The `mockItems` array is no longer used to seed state — data comes from Supabase. `src/lib/outfits.ts` defines `Outfit` (`id`, `name`, `itemIds`) similarly.
- Supabase access goes through `src/lib/supabase/`:
  - `client.ts` — `createBrowserClient`, for use in Client Components.
  - `server.ts` — `createServerClient`, for use in Server Components/Route Handlers; reads/writes auth cookies via `next/headers`.
  - Always create a fresh client per request/component via these helpers rather than sharing a module-level client instance (this is the pattern `@supabase/ssr` expects for correct cookie handling).
- Environment variables: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings.
- Supabase schema: `public.clothing_items` (id, user_id, name, category, clothing_type, color, season, style, occasion, material, favorite, photo_url, created_at) and `public.outfits` (id, user_id, name, item_ids, created_at). Both have RLS enabled with a `for all` policy scoped to `auth.uid() = user_id`. The `authenticated` role has been granted SELECT/INSERT/UPDATE/DELETE on both tables.
- Storage: `clothing-photos` bucket (public). Photos uploaded to `user_id/itemId.ext`. One permissive RLS policy (`for all to authenticated with check (true)`). Public URL stored in `photo_url` column.

## Current Progress (2026-06-28)

Completed:
- Next.js + Tailwind project setup
- Git repository initialized and pushed to GitHub (origin/main)
- Supabase project connected; client helpers created (`src/lib/supabase/client.ts`, `server.ts`)
- ClothingCard, WardrobeGrid, Modal, AddClothingForm components created
- `ClothingItem` type with category, clothingType, color, season, style, occasion, material, favorite, optional photoUrl
- Add Clothing Item form with photo preview (`URL.createObjectURL`); "No photo" placeholder fallback
- MVP step 4: outfit creation (`CreateOutfitForm.tsx`, `OutfitCard.tsx`, `src/lib/outfits.ts`)
- Edit and delete for both clothing items and outfits
- Search bar + category filter for wardrobe grid; search for outfits
- Multi-page navigation: `/` (outfits), `/clothes` (wardrobe), `/create-outfit`; state in `WardrobeProvider`
- Supabase authentication live (email/password); user shown in NavBar with Sign Out
- Supabase persistence: `clothing_items` and `outfits` tables created with RLS; `WardrobeProvider` loads/saves real data
- Photo upload to Supabase Storage (`clothing-photos` bucket); public URL stored in `photo_url` column
- Fixed React duplicate key warning in `ClothingCard` tag list

Current Status:
- All three routes fully working: Home (outfits), My Clothes (wardrobe grid + add/edit/delete), Create Outfit
- Data persists across page reloads — stored in Supabase, scoped per authenticated user
- Photos upload to Supabase Storage and display correctly
- No mock/in-memory data — everything reads from and writes to Supabase

Next Planned Milestone:
- Verify outfits persist end-to-end (create outfit → refresh → still there)
- UI/UX polish
- Still no AI features

Learning Goals:
- Understand React state
- Understand form handling
- Understand data flow between components
- Understand modal/popup UI patterns in React
- Understand file inputs and object URLs (`URL.createObjectURL`) in React

## Future Product Vision & Roadmap

### Product Direction

The goal of this app is not just to store clothing items, but to help users manage outfits and make clothing decisions.

Long-term, the app should feel like a digital wardrobe rather than a clothing database.

### UX Philosophy

Minimize manual user input whenever possible.

Current forms require users to enter many clothing attributes manually (color, style, material, season, occasion, etc.). This creates friction and makes adding clothes tedious.

Future versions should prioritize:

* Uploading or taking a photo of a clothing item
* Minimal required fields from the user
* Automatic categorization when possible

### Planned AI Features (Future, NOT current MVP)

Future AI functionality may include:

* Automatic clothing category detection
* Automatic color detection
* Automatic season/style classification
* Automatic material estimation
* Outfit recommendations
* Color matching suggestions
* Seasonal outfit suggestions

These features are explicitly out of scope until the core wardrobe and outfit management system is complete.

### Navigation Vision

Future versions should support multiple pages rather than a single-page wardrobe view.

Potential navigation structure:

* Home / Closet
* My Clothes
* Create Outfit
* Saved Outfits
* Settings

Navigation may be accessible through a hamburger menu (☰) or mobile-friendly sidebar.

### Home Page Vision

The home page should eventually focus on outfits rather than individual clothing items.

Instead of displaying a list of clothes, the home page should act as a virtual closet showing saved outfits.

Example:

* Outfit cards displayed like clothes hanging in a wardrobe
* More outfits appear as users create them
* Clicking an outfit opens the outfit details

### Future Camera Integration

Future versions may support:

* Taking photos directly from a mobile device camera
* Capturing clothing items in real time
* Adding items directly to the wardrobe without first saving photos elsewhere

Camera integration is a lower priority than outfit management and wardrobe organization.

### Development Priorities

Current priority order:

1. ~~Improve wardrobe management~~ ✓
2. ~~Improve outfit creation workflow~~ ✓
3. ~~Add multi-page navigation~~ ✓
4. Improve UI/UX
5. ~~Integrate Supabase persistence~~ ✓
6. ~~Implement image storage~~ ✓
7. Add AI-assisted clothing classification
8. Add AI outfit recommendation features

Development rule:

Do not implement advanced AI features until the non-AI wardrobe and outfit management experience is functional and enjoyable to use.

### Image Storage: MVP Decision

The `clothing-photos` Supabase Storage bucket is set to **public** for MVP simplicity. Photos are uploaded to `user_id/itemId.ext` and stored as a `getPublicUrl` result in the database. This means photo URLs are technically accessible without authentication.

**Future improvement:** Switch to a private bucket with authenticated reads. This requires storing the storage path (not the URL) in the database and calling `createSignedUrl` at display time to generate time-limited URLs. Deferred until after core features are stable.
