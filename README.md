# WEXO Movies

A movie browsing web app built for the **WEXO A/S** code challenge, using [The Movie Database (TMDB)](https://developer.themoviedb.org/) API.

Browse curated genres, open genre grids with pagination, search by title, view movie details (including cast, director, and trailers when available), and save titles to a device-local wishlist.

## Tech stack

| Technology | Role |
|------------|------|
| **Next.js** (App Router) | Routing, Server Components, metadata, image optimisation |
| **React** | UI components |
| **TypeScript** | Typed props and TMDB response shapes |
| **CSS Modules** | Scoped styling without a utility framework |
| **TMDB API v3** | Genres, discover, search, movie details, credits, videos |
| **native `fetch`** | HTTP client (no axios / SDK) |
| **`localStorage`** | Wishlist persistence (no backend) |
| **npm** | Package management |

### Why these choices

- **Next.js App Router** — multi-page catalogue with server-side data fetching so the TMDB access token never reaches the browser.
- **TypeScript** — safer refactors and clearer contracts around API data.
- **CSS Modules** — enough structure for this app size without Tailwind or CSS-in-JS.
- **Server Components by default** — `"use client"` only where interactivity is required (wishlist, header search, carousels, genre jump).
- **`localStorage` wishlist** — matches the brief (permanent persistence not required) and stays easy to explain.

## Architecture

```text
src/
  app/                 # Routes: home, genre, movie, search, wishlist
  components/          # Shared UI (cards, grids, header search, trailer, wishlist, states)
  lib/tmdb/            # Server-only TMDB client, helpers, image URLs
  lib/wishlist/        # localStorage + useWishlist hook
  types/               # Focused TMDB TypeScript types
```

**Data flow (catalogue pages):** browser → Next.js Server Component → TMDB (`Authorization: Bearer …`) → HTML.

**Search flow:** header expands an inline field → navigate to `/search?q=…` → Server Component calls TMDB search → results + pagination.

**Wishlist flow:** Client Components call `useWishlist` → React state + `localStorage` (immediate UI updates; no full page refresh).

Important routes:

| Route | Description |
|-------|-------------|
| `/` | Homepage genre sections (preview + counts) |
| `/genre/[id]` | Full genre grid + `?page=` pagination |
| `/movie/[id]` | Detail, credits, wishlist toggle, optional trailer |
| `/search` | Search results (`?q=` + pagination); entry via header field |
| `/wishlist` | Saved movies for this device |

## Setup

### Requirements

- Node.js 20+ recommended
- A TMDB developer account and **API Read Access Token**

### 1. Install dependencies

```bash
npm install
```

### 2. Configure TMDB credentials

1. Create an account at [TMDB](https://www.themoviedb.org/) and request API access.
2. Copy your **API Read Access Token** from the TMDB API settings page.
3. Create a local env file from the example:

```bash
# Windows (PowerShell)
copy .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

4. Edit `.env.local`:

```env
TMDB_ACCESS_TOKEN=your_token_here
```

Notes:

- Use the Read Access Token (Bearer), not a public `NEXT_PUBLIC_` variable.
- `.env.local` is gitignored — never commit it.
- `.env.example` documents the variable name only (no secret).

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Implemented requirements

- Homepage showcasing required genres (Action, Comedy, Thriller, War, Romance, Drama, Crime, Documentary, Horror)
- Genre title and total movie count (`total_results`)
- Few movies per genre (poster + title), link to detail, link to full genre page
- Genre page with title, count, and movie grid
- Movie detail: title, overview, release year, poster, backdrop, genres, actors, director, wishlist add/remove
- Wishlist with `localStorage`, wishlist page, immediate UI updates on remove
- Responsive layout (mobile / tablet / desktop)
- Accessible basics: semantic HTML, focus styles, skip link, alt text, meaningful controls

## Optional features implemented

- Genre page pagination (`?page=`)
- Genre page grid uses **5 columns** on large screens so TMDB’s 20 results fill four even rows
- Homepage genre jump dropdown
- Homepage genre carousels (prev/next through the fetched preview set)
- Poster overview overlay on homepage hover/focus
- Movie search: header icon expands an inline field → `/search?q=…` (TMDB search + pagination)
- YouTube trailer embed when TMDB provides a suitable video
- Loading skeletons for TMDB-backed routes
- Empty / error / not-found handling

## Intentionally omitted

- TV series (architecture does not block adding them later; movies were prioritised)
- User accounts / server-side wishlist sync
- Advanced filters and recommendations
- State libraries (Redux/Zustand) — unnecessary for this wishlist
- Third-party TMDB SDK or video player libraries

## Design & technical decisions

- **Server-side TMDB calls** keep the Bearer token off the client (`server-only` on the API layer).
- **`append_to_response=credits,videos`** loads detail extras in one request.
- **Wishlist = `useWishlist` + `useSyncExternalStore`**, not Context — `localStorage` is the shared source of truth across routes.
- **URL-driven pagination** keeps genre and search pages shareable without client page state.
- **Hybrid search** — icon expands a header field for quick entry; results live on `/search?q=…` so the query is bookmarkable and paginated. Explicit submit (no typeahead) keeps API load and accessibility simple.
- **Missing media** uses placeholders or omitted sections (e.g. no trailer → no empty player).

## Known limitations

- Wishlist is per-browser / per-device; clearing site data removes it.
- Homepage, genre, movie, and search pages are dynamically rendered and depend on TMDB availability and rate limits.
- TMDB discover/search `total_results` / `total_pages` can be very large; pagination uses Previous/Next rather than a full page list.
- Poster CDN failures after a valid `poster_path` are not specially handled beyond Next/Image defaults.
- Trailer playback depends on YouTube embed availability and network.

## Possible future improvements

- Authenticated wishlist backed by an API
- Search typeahead / richer filters (year, rating, multi-genre)
- TV show support reusing the same API/client patterns
- Automated a11y checks in CI
- Image `onError` fallbacks for broken CDN assets
- Optional numbered pagination for power users

## License / attribution

Movie data and images are provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
