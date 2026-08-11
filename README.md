# WEXO Movies

Movie browsing app for the **WEXO A/S** recruitment code challenge, powered by [The Movie Database (TMDB)](https://developer.themoviedb.org/) API.

> Full architecture documentation will be completed in a later increment. This README currently covers setup for local development.

## Stack

- Next.js (App Router)
- React
- TypeScript
- CSS Modules
- TMDB API v3 (server-side Bearer token)
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure TMDB credentials

1. Create a TMDB developer account and generate an **API Read Access Token**.
2. Copy the example env file:

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

3. Edit `.env.local` and set your token:

```env
TMDB_ACCESS_TOKEN=your_token_here
```

Never commit `.env.local` or put the real token in source code / README.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run production build
npm run lint    # ESLint
```

## Project status

**Increment 4 complete:** homepage genre sections loaded from TMDB (title, count, preview grid, see-all links).

Next: genre detail page.
