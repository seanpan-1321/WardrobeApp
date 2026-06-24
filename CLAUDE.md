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

- App Router lives in `src/app`. `src/app/layout.tsx` is the root layout (Geist fonts, page metadata). `src/app/page.tsx` is the home page — a Client Component (`"use client"`) that holds the live wardrobe list in `useState`, seeded from `mockItems`, and renders `WardrobeGrid` + the `AddClothingForm` toggle.
- `src/components/ClothingCard.tsx` and `src/components/WardrobeGrid.tsx` render a single item / the item grid respectively; `src/components/AddClothingForm.tsx` is the controlled form (its own `useState` for form fields) that calls an `onAdd` callback prop with a new `ClothingItem` on submit.
- `src/lib/mock-items.ts` defines the `ClothingItem` type and the hardcoded `mockItems` array used to seed the UI — this is the type/shape that will eventually map to a Supabase table. `ClothingItem.photoUrl` is optional: the 4 seeded mock items have none and `ClothingCard` falls back to a "No photo" placeholder.
- Supabase access goes through `src/lib/supabase/`:
  - `client.ts` — `createBrowserClient`, for use in Client Components.
  - `server.ts` — `createServerClient`, for use in Server Components/Route Handlers; reads/writes auth cookies via `next/headers`.
  - Always create a fresh client per request/component via these helpers rather than sharing a module-level client instance (this is the pattern `@supabase/ssr` expects for correct cookie handling).
- Environment variables: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings. No Supabase project/schema exists yet — tables for clothing items and outfits still need to be designed and created (e.g. via the Supabase SQL editor or migrations) before the upload/list features can be built.
- No image storage bucket, auth flow, or data model has been built yet — this scaffold only wires up the Supabase client helpers and Tailwind/Next.js base. The next step per the MVP order above is the clothing item upload feature.

## Current Progress (2026-06-23)

Completed:
- Next.js + Tailwind project setup
- Git repository initialized
- GitHub repository connected
- Supabase helper files created
- Homepage UI created
- ClothingCard component created
- WardrobeGrid component created
- Mock clothing data created
- ClothingItem TypeScript type expanded with:
  - category
  - clothingType
  - color
  - season
  - style
  - occasion
  - material
  - favorite
- Add Clothing Item form created (`AddClothingForm.tsx`), using React state only — users can add a clothing item from the UI and see it appear in the wardrobe grid immediately
- Add Clothing Item form turned into a popup/modal (`Modal.tsx`) opened via the "+ Add clothing item" button
- Photo upload added to the form: a file input lets the user pick an image, previewed immediately via `URL.createObjectURL`; the resulting object URL is stored on the new item as `photoUrl` and rendered on its `ClothingCard`. Items without a photo (including the 4 seeded mock items) show a "No photo" placeholder.

Current Status:
- UI is working, including adding new items via the modal form, with an optional photo
- Data is mock/in-memory state only — new items (and their photo object URLs) do not persist across page reloads
- No database integration yet
- No real image upload/storage yet — photos are local blob URLs in browser memory only, not saved anywhere
- No authentication yet

Next Planned Milestone:
- Start MVP step 4: create and save outfits from existing wardrobe items
- Still React state only — no Supabase, no AI yet

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
