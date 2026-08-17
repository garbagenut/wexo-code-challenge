# WEXO Movies

A movie catalogue web app built for the **WEXO A/S** code challenge, using
[The Movie Database (TMDB)](https://developer.themoviedb.org/) API.

Browse required genres, open full genre pages, view movie details (cast,
director, optional trailer), and save titles to a device-local wishlist.

## Tech stack

| Technology | Role |
|------------|------|
| **Next.js** (App Router) | Routing, Server Components, metadata, image optimisation |
| **React** | UI |
| **TypeScript** | Props and TMDB response types |
| **CSS Modules** | Scoped styling |
| **TMDB API v3** | Genres, discover, search, details, credits, videos |
| **`fetch`** | HTTP client |
| **`localStorage`** | Wishlist persistence |

## Architecture

```text
src/
  app/           # Routes: home, genre, movie, search, wishlist
  components/    # Shared UI
  lib/tmdb/      # Server-only TMDB client and helpers
  lib/wishlist/  # localStorage + useWishlist
  types/         # TMDB TypeScript types
```

Catalogue pages fetch TMDB on the server (Bearer token never reaches the
browser). The wishlist is client-side and updates immediately via
`localStorage`.

| Route | Description |
|-------|-------------|
| `/` | Genre previews and counts |
| `/genre/[id]` | Genre grid with `?page=` pagination |
| `/movie/[id]` | Details, credits, wishlist, optional trailer |
| `/search` | Title search (`?q=` + pagination) |
| `/wishlist` | Saved movies on this device |

## Setup

### Requirements

- Node.js 20+ recommended
- A TMDB account and **API Read Access Token**

### 1. Install

```bash
npm install
```

### 2. Configure credentials

1. Create an account at [TMDB](https://www.themoviedb.org/) and request API access.
2. Copy your **API Read Access Token** from the TMDB API settings.
3. Create a local env file:

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

- Use the Read Access Token (Bearer), not a `NEXT_PUBLIC_` variable.
- `.env.local` is gitignored — never commit it.
- `.env.example` documents the variable name only.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Features

### Core requirements

- Homepage with the required genres (Action, Comedy, Thriller, War, Romance, Drama, Crime, Documentary, Horror)
- Genre title and total movie count
- A few movies per genre (poster + title), links to detail and full genre page
- Genre page with title, count, and movie grid
- Movie detail: title, overview, release year, poster, backdrop, genres, actors, director, wishlist add/remove
- Wishlist with `localStorage`, dedicated wishlist page, immediate UI updates on remove
- Responsive layout (mobile / tablet / desktop)
- Accessibility basics: semantic HTML, focus styles, skip link, alt text, meaningful controls

### Additional features

- Genre and search pagination (`?page=`)
- Movie search from the header → `/search?q=…`
- YouTube trailer embed when TMDB provides a suitable video
- Homepage genre jump, carousels, and light browsing polish
- Loading skeletons; empty, error, and not-found handling

## Technical decisions

- **Server-only TMDB access** — token stays in `TMDB_ACCESS_TOKEN` / `.env.local`; API layer uses `server-only`.
- **`append_to_response=credits,videos`** — detail extras in one request.
- **Wishlist via `useWishlist` + `localStorage`** — shared across routes without a global state library.
- **URL-driven pagination** — shareable genre/search pages without client page state.
- **Missing media** — placeholders or omitted sections (e.g. no trailer → no empty player).

## Scope & limitations

**Out of scope (deliberate)**

- TV series (movies prioritised; same patterns could extend later)
- User accounts / server-synced wishlist
- Advanced filters and recommendations

**Limitations**

- Wishlist is per browser/device; clearing site data removes it.
- Pages depend on TMDB availability and rate limits.
- Large result sets use Previous/Next pagination, not a full page index.
- Trailers depend on YouTube embed availability.

## Possible future improvements

- Authenticated wishlist backed by an API
- Richer search/filters
- TV show support using the same client patterns

## License / attribution

Movie data and images are provided by TMDB. This product uses the TMDB API but
is not endorsed or certified by TMDB.
