# YouTube Wrapped — CLAUDE.md

## Project Overview

A "Spotify Wrapped"-style year-in-review web app for YouTube watch history. Users upload their Google Takeout watch history JSON, the app enriches it via the YouTube Data API, and generates a fun, visually stunning, animated wrap-up of their viewing habits.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Charts**: Recharts or D3.js for data visualization
- **API**: YouTube Data API v3 for video metadata enrichment
- **State**: Zustand for client-side state management
- **Package Manager**: npm

## Project Structure

```
youtube-wrapped/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing / upload page
│   │   ├── wrapped/      # The wrapped experience (slide-by-slide)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/           # Reusable UI primitives
│   │   ├── slides/       # Individual wrapped slide components
│   │   ├── charts/       # Chart/visualization components
│   │   └── upload/       # File upload & parsing components
│   ├── lib/
│   │   ├── parser.ts     # Google Takeout JSON parser
│   │   ├── enricher.ts   # YouTube Data API enrichment logic
│   │   ├── analyzer.ts   # Stats computation engine
│   │   ├── youtube-api.ts # YouTube API client
│   │   └── utils.ts
│   ├── stores/           # Zustand stores
│   ├── hooks/            # Custom React hooks (useHoloTilt, useSwipe, etc.)
│   └── types/            # TypeScript type definitions
├── public/
│   └── fonts/            # Custom fonts
├── .env.local            # YouTube API key (NEXT_PUBLIC_YOUTUBE_API_KEY)
├── CLAUDE.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Core Features & Data Flow

### 1. Upload & Parse
- User uploads `watch-history.json` from Google Takeout
- Parser extracts: video ID, title, channel, timestamp
- Deduplicate and clean entries (remove ads, deleted videos)

### 2. Enrich via YouTube Data API
- Batch video IDs (50 per request) to `videos.list`
- Fetch: `contentDetails.duration`, `snippet.categoryId`, `snippet.tags`, `statistics`
- Map `categoryId` to human-readable names
- Cache enriched data in localStorage to avoid redundant API calls
- Show progress bar during enrichment (can take a minute for heavy watchers)

### 3. Analyze
Compute the following stats:
- **Total watch time** (hours/days)
- **Total videos watched**
- **Top channels** (by watch count and estimated time)
- **Top categories** (Music, Education, Entertainment, etc.)
- **Watching patterns**: heatmap by hour-of-day × day-of-week
- **Monthly trends**: videos/time per month
- **Longest watching day**
- **Most rewatched videos**
- **Late night watching** (midnight–4am stats)
- **Binge sessions** (3+ videos from same channel in a row)
- **Genre personality** (fun label based on top categories)
- **First video of the year / Last video of the year**

### 4. Wrapped Slides (The Fun Part)
Present stats as a series of full-screen animated slides, Spotify Wrapped style:
1. **Intro** — "Your YouTube 2025, Wrapped"
2. **Total Time** — dramatic reveal of total hours with comparison ("That's X movies" or "X flights to Tokyo")
3. **Top Channel** — #1 channel with watch count, animated entrance
4. **Top 5 Channels** — ranked list with bars
5. **Top Category** — genre reveal with personality label
6. **Category Breakdown** — animated donut/pie chart
7. **Watching Clock** — radial heatmap of when you watch
8. **Monthly Journey** — area chart of watching over the year
9. **Late Night Owl** — midnight stats (if applicable)
10. **Most Rewatched** — the video you kept coming back to
11. **Fun Facts** — random delightful stats
12. **Summary Card** — shareable card with key stats

Each slide: full-screen, bold typography, smooth transitions (Framer Motion), vibrant colors.

## Design Direction

**Aesthetic**: Bold, maximalist, Spotify Wrapped energy. Dark backgrounds with vivid gradient accents. Think: deep navy/black base, neon coral, electric purple, hot pink highlights.

**Typography**: Use a bold display font (e.g., `Clash Display`, `Cabinet Grotesk`, or `Satoshi`) for headlines. Clean geometric sans for body text.

**Animations**: Staggered reveals, count-up numbers, slide transitions (swipe or fade), parallax on scroll. Every stat should feel like an *event*.

**Interactions**: Swipe or click to advance slides. Mobile-first layout. Optional: arrow keys for desktop.

## Holographic Summary Card (Critical Feature)

The final summary/shareable card MUST have a **Pokémon-card holographic effect** inspired by https://poke-holo.simey.me/ (by simeydotme). This is a signature visual feature of the app.

### Reference & Inspiration
- **Original project**: https://github.com/simeydotme/pokemon-cards-css (GPL-3.0)
- **Reusable component**: https://github.com/simeydotme/hover-tilt (`hover-tilt` on npm) — a Web Component that works with React
- **Codepen v2**: https://codepen.io/simeydotme/pen/abYWJdX

### Core Techniques (from simeydotme's approach)
The holographic effect is built with layered CSS:
1. **3D Tilt on mouse/touch move**: CSS `perspective` + `rotateX/rotateY` transforms based on pointer position
2. **Holographic shine layer**: A `::before` or overlay div with rainbow linear gradients that shift `background-position` based on pointer coordinates (tracked via CSS custom properties `--mx`, `--my`, `--posx`, `--posy`)
3. **Glare layer**: A `radial-gradient` (white center fading to transparent) positioned at the pointer location, simulating light reflection
4. **Sparkle/glitter texture**: A repeating noise or sparkle texture image overlaid with `background-blend-mode: color-dodge` for the glitter particle effect
5. **Color dodge & soft-light blend modes**: Multiple background layers blended with `color-dodge`, `soft-light`, `screen`, and `overlay` to create the shifting rainbow refraction
6. **Dynamic CSS variables**: Mouse position mapped to `--mx`, `--my` (0-100%), used to drive gradient positions, creating the illusion of light moving across the card
7. **Brightness/contrast filters**: `filter: brightness() contrast() saturate()` dynamically adjusted based on tilt angle (`--hyp` = hypotenuse distance from center)

### Implementation Strategy — Custom Build (No Libraries)
Build a `<HoloCard>` React component from scratch (~150 lines of CSS + a `useMousePosition` hook). This is the approach to use. Do NOT install `hover-tilt` or any tilt/glare package.

**React Hook: `useHoloTilt`**
- Track mouse position via `onMouseMove` / `onTouchMove` on the card wrapper
- Map pointer (x, y) to normalized values (0–1) as CSS custom properties `--mx`, `--my`
- Compute tilt angles: `--rx` and `--ry` (±15deg max)
- Compute `--hyp` (distance from center, 0–1) for brightness adjustments
- On mouse leave, spring-animate back to (0.5, 0.5) using `requestAnimationFrame`

**CSS Layers (applied to an overlay `::after` or child div):**
```
background-image:
  url("/textures/sparkle.png"),               /* sparkle noise */
  repeating-linear-gradient(0deg, rainbow),   /* holo rainbow bars */
  repeating-linear-gradient(133deg, rainbow), /* cross-hatch rainbow */
  radial-gradient(at var(--mx) var(--my), white 10%, transparent 80%); /* glare */
background-blend-mode: color-dodge, color-dodge, soft-light, overlay;
background-position: calculated from --mx, --my;
```

**Card wrapper transform:**
```css
transform: perspective(600px) rotateX(var(--rx)) rotateY(var(--ry));
transition: transform 0.15s ease-out;
```

**Brightness/contrast filter on overlay:**
```css
filter: brightness(calc((var(--hyp) + 0.7) * 0.7)) contrast(2.5) saturate(0.65);
```

### Where to Apply the Holo Effect
1. **Summary Card (Slide 12)** — The shareable end card MUST be a holo card. This is the hero moment.
2. **Top Channel Card** — The #1 channel reveal can optionally use a subtle holo treatment
3. **Achievement badges** — If we add badges (e.g., "Night Owl", "Binge Watcher"), these can be small holo cards

### Sparkle Texture
- Generate or source a tileable sparkle/noise texture (PNG, ~200x200px)
- Can use CSS-only noise with `background-image: repeating-conic-gradient(...)` as a fallback
- The sparkle layer needs `mix-blend-mode: color-dodge` and should shift with pointer position
- Store in `/public/textures/sparkle.png`

### Mobile Support
- Use `onTouchMove` for tilt tracking on mobile
- Consider device gyroscope (`DeviceOrientationEvent`) for tilt on mobile — rotate the phone to see the holo shift
- Fallback: gentle CSS animation loop if no interaction detected

## Permissions & Conventions

### Claude Code Permissions
- **Auto-commit**: YES — commit after meaningful changes with descriptive messages
- **Auto-push**: YES — push to remote after commits
- **File creation**: YES — create any files needed
- **File deletion**: YES — remove files freely
- **Package installation**: YES — install any npm packages needed (`npm install`)
- **Run dev server**: YES — `npm run dev`
- **Run build**: YES — `npm run build` to verify
- **Run linter/formatter**: YES — auto-fix lint issues
- **Shell commands**: YES — run any shell commands needed
- **Environment variables**: Do NOT commit `.env.local`

### Git Conventions
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`
- Commit frequently — after each feature or meaningful change
- Keep commits atomic and focused

### Code Conventions
- Functional components only, no classes
- Use `"use client"` directive only where needed
- Prefer named exports for components
- Keep components under 150 lines — split if larger
- All TypeScript, strict mode — no `any` types
- Use absolute imports (`@/`)
- Tailwind for all styling — no CSS modules or styled-components
- Extract magic numbers into constants
- Error boundaries around API-dependent components

### API Key Handling
- YouTube API key goes in `.env.local` as `NEXT_PUBLIC_YOUTUBE_API_KEY`
- Never commit API keys
- Add `.env.local` to `.gitignore`
- Provide clear setup instructions in README

## Getting Started

```bash
npm install
cp .env.example .env.local  # Add your YouTube API key
npm run dev
```

## Dependency Policy

**Philosophy: Minimize third-party libraries.** Only use packages that are industry-standard, well-maintained (>10k GitHub stars, active development), and genuinely hard to replicate. If something can be built in <100 lines, build it — don't install a package.

### Approved Dependencies
```
# Core (non-negotiable)
next
react
react-dom
typescript
@types/react
@types/node

# Styling (industry standard)
tailwindcss
postcss
autoprefixer

# Animation (Framer Motion is the React animation standard)
framer-motion

# Date handling (date math is notoriously error-prone)
date-fns

# State management
zustand

# Charts / Data visualization (pick one based on needs)
recharts          # For standard chart types (bar, line, area, pie)
# d3              # Use instead of / alongside recharts if custom viz needed (heatmaps, radial charts)
# chart.js        # Alternative to recharts if preferred

# HTTP client
axios
```

### NOT Approved — Build Instead
- **hover-tilt / any tilt library**: Build the holographic card effect from scratch. It's ~150 lines of CSS + a React hook for mouse tracking. Custom implementation gives full control over the holo aesthetic.
- **CSS-in-JS** (no styled-components, Emotion): Tailwind only.
- **Utility libraries** (no Lodash): Use native JS methods.
- **UUID generators**: Use `crypto.randomUUID()`.
- **Form libraries**: No forms complex enough to justify one.
- **Toast/notification libraries**: Build a simple one if needed.

### Decision Rule
Before adding ANY dependency, ask:
1. Can this be built in <100 lines of clean code? → Build it.
2. Is this a solved problem where bugs would be catastrophic (dates, crypto)? → Use a library.
3. Does this have >10k GitHub stars and weekly npm downloads >100k? → Acceptable IF #1 fails.
4. Is it a niche package with <1k stars? → Never.

## Notes

- All processing happens client-side — no backend needed
- The YouTube API key is used client-side (restrict it to your domain in Google Cloud Console)
- Google Takeout export path: Google Takeout → YouTube → Watch History → JSON format
- For users with massive histories (10k+ videos), implement pagination and progress feedback during enrichment
- Consider a "demo mode" with sample data so people can see the experience without uploading