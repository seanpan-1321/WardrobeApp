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

- App Router lives in `src/app`, now split into multiple routes: `/` (Home — saved outfits view), `/clothes` (My Clothes — wardrobe grid + add/edit), `/create-outfit` (full-page outfit builder). `src/app/layout.tsx` is the root layout (Geist fonts, page metadata) and wraps every route in `WardrobeProvider` + renders `NavBar` above `children`.
- `src/lib/wardrobe-context.tsx` holds the shared `items`/`outfits` state and CRUD handlers (`saveItem`, `deleteItem`, `saveOutfit`, `deleteOutfit`) behind a `useWardrobe()` hook, seeded from `mockItems`/`mockOutfits`. This is what lets state survive client-side navigation between routes since there's no backend yet.
- `src/components/NavBar.tsx` is the top nav (Home / My Clothes / Create Outfit), active-route highlighted via `usePathname`.
- `src/components/ClothingCard.tsx` and `src/components/WardrobeGrid.tsx` render a single item / the item grid respectively; `src/components/AddClothingForm.tsx` is the controlled form (its own `useState` for form fields) that calls an `onAdd` callback prop with a new `ClothingItem` on submit (also reused for editing via an `initialItem` prop).
- `src/components/CreateOutfitForm.tsx` and `src/components/OutfitCard.tsx` are the outfit equivalents — the form takes `initialOutfit` for editing and is used both full-page (`/create-outfit`) and inside `Modal` (editing from Home).
- `src/lib/mock-items.ts` defines the `ClothingItem` type and the hardcoded `mockItems` array used to seed the UI — this is the type/shape that will eventually map to a Supabase table. `ClothingItem.photoUrl` is optional: the 4 seeded mock items have none and `ClothingCard` falls back to a "No photo" placeholder. `src/lib/outfits.ts` defines `Outfit` (`id`, `name`, `itemIds`) similarly.
- Supabase access goes through `src/lib/supabase/`:
  - `client.ts` — `createBrowserClient`, for use in Client Components.
  - `server.ts` — `createServerClient`, for use in Server Components/Route Handlers; reads/writes auth cookies via `next/headers`.
  - Always create a fresh client per request/component via these helpers rather than sharing a module-level client instance (this is the pattern `@supabase/ssr` expects for correct cookie handling).
- Environment variables: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings. No Supabase project/schema exists yet — tables for clothing items and outfits still need to be designed and created (e.g. via the Supabase SQL editor or migrations) before the upload/list features can be built.
- No image storage bucket, auth flow, or data model has been built yet — this scaffold only wires up the Supabase client helpers and Tailwind/Next.js base. The next step per the MVP order above is the clothing item upload feature.

## Current Progress (2026-06-24)

Completed:
- Next.js + Tailwind project setup
- Git repository initialized
- GitHub repository connected
- Supabase helper files created
- ClothingCard, WardrobeGrid, Modal, AddClothingForm components created
- Mock clothing data created; `ClothingItem` type expanded with category, clothingType, color, season, style, occasion, material, favorite, optional photoUrl
- Add Clothing Item form (`AddClothingForm.tsx`), opened via modal, with photo upload preview (`URL.createObjectURL`) — items without a photo show a "No photo" placeholder
- MVP step 4 done: outfit creation (`CreateOutfitForm.tsx`, `OutfitCard.tsx`, `src/lib/outfits.ts`)
- Edit and delete added for both clothing items and outfits (reusing the same forms via an `initial*` prop, plus `window.confirm` before delete)
- Search bar + category filter added for the wardrobe grid; search added for outfits (matches outfit name or any item inside it)
- Multi-page navigation added: state lifted into `WardrobeProvider`/`useWardrobe()` (`src/lib/wardrobe-context.tsx`) so it survives client-side route changes; routes split into `/` (outfits/home), `/clothes` (wardrobe management), `/create-outfit` (outfit builder); `NavBar.tsx` added to root layout

Current Status:
- UI is fully working across all three routes: browse/search/edit/delete outfits on Home, manage clothing items on `/clothes`, build new outfits on `/create-outfit`
- Data is still mock/in-memory state only (in the context provider) — nothing persists across a full page reload
- No database integration yet
- No real image upload/storage yet — photos are local blob URLs in browser memory only, not saved anywhere
- No authentication yet

Next Planned Milestone:
- Per the Development Priorities below: UI/UX polish on the new multi-page layout, then start Supabase persistence (replace `WardrobeProvider`'s in-memory state with real reads/writes)
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

1. Improve wardrobe management
2. Improve outfit creation workflow
3. Add multi-page navigation
4. Improve UI/UX
5. Integrate Supabase persistence
6. Implement image storage
7. Add AI-assisted clothing classification
8. Add AI outfit recommendation features

Development rule:

Do not implement advanced AI features until the non-AI wardrobe and outfit management experience is functional and enjoyable to use.
