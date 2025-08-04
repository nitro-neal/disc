# Disc Golf Web App – Technical Product Requirements Document (PRD)

**Revision 1.0 – August 4, 2025**

---

## Table of Contents

1. Vision & Goals
2. Personas & Use‐Cases
3. Scope Overview
4. Non‑Functional Requirements
5. System Architecture & Tech Stack
6. Data Model & Storage
7. Feature Requirements\
      7.1 Home Screen & Navigation\
      7.2 Disc Search\
      7.3 Brand Search\
      7.4 Flight Search\
      7.5 Bags (Bag Builder & Bag Report)
8. Component Architecture
9. Algorithms & Calculations
10. UX & Visual Design Guidelines
11. Accessibility & Internationalization
12. Quality, Testing & Analytics
13. Deployment & CI/CD
14. Milestones & Acceptance Criteria
15. Future Enhancements

---

## 1. Vision & Goals

_Offer recreational and competitive disc‑golfers a zero‑friction web tool—installable as a PWA—that helps them find discs, learn flight paths, and plan bags without logging in._

### SMART Goals

- **Search Speed:** Any search result < 200 ms (95th percentile).
- **Load Time:** First Contentful Paint < 1.0 s on fast‑3G.
- **Bag Builder Engagement:** ≥ 40 % of visitors create a bag within first session.
- **Flight Path Visualization Accuracy:** ±5 % versus UDisc reference flights for 90 % of discs.

## 2. Personas & Use‑Cases

| Persona             | Goals                           | Pain Points                    | Key Features                                      |
| ------------------- | ------------------------------- | ------------------------------ | ------------------------------------------------- |
| _New Thrower Nick_  | Choose beginner‑friendly discs. | Overwhelmed by terminology.    | Flight Search sliders, Disc details explanations. |
| _Competitive Casey_ | Optimize tournament bag.        | Hard to compare discs quickly. | Bag Report grid, Similar Disc finder.             |
| _Collector Chris_   | Track entire collection.        | No easy place to log discs.    | Multiple Bags, Brand Search images.               |

## 3. Scope Overview

_In‑scope:_ Core search flows, local‑storage bag management, flight path graphics, responsive UI, PWA installability.\
_Out‑of‑scope (v1):_ User authentication, social sharing, real‑time sync across devices, multilingual UI.

## 4. Non‑Functional Requirements

- **Performance:** Lighthouse ≥ 90 all categories.
- **Offline:** Read‑only functionality (search, flight preview) must work offline via service worker + cached JSON.
- **Security:** All external links open `rel="noopener noreferrer"`.
- **Browser Support:** Evergreen desktop & mobile (Chrome ESR, Safari 17+, Firefox 120+, Edge 120+).
- **Resilience:** Graceful error boundaries with retry logic.

## 5. System Architecture & Tech Stack

| Layer            | Technology                                                                           | Notes                                                                           |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| UI               | **React 18** (Functional Components, Hooks)                                          | Vite for bundling & dev server.                                                 |
| Routing          | `react‑router‑dom v6`                                                                | SPA routes: `/`, `/disc/:slug`, `/brand/:slug`, `/flight`, `/bags`, `/bag/:id`. |
| State            | Context + Reducer for global (bags, settings) & React Query for async data.          |                                                                                 |
| Styling          | **Plain CSS** w/ CSS Modules. Variables for theme colors.                            |                                                                                 |
| Data             | Local JSON (≈ 5 k discs) fetched at runtime & cached in IndexedDB via `localforage`. |                                                                                 |
| Charts           | SVG + custom path generator (no external chart lib to keep bundle small).            |                                                                                 |
| Storage          | `localStorage` for bag meta & disc IDs (max 5 MB). Fallback to IndexedDB if needed.  |                                                                                 |
| Build & Bundling | Vite + esbuild. Target: ECMAScript 2021.                                             |                                                                                 |
| Deployment       | GitHub Actions → Netlify (Atomic Deploy).                                            |                                                                                 |

### High‑Level Diagram

```
[Browser] —HTTP/HTTPS→ [Netlify CDN] —Static JSON→ [Service Worker Cache]
                                     ↘ LocalStorage / IndexedDB
```

## 6. Data Model & Storage

### Disc Schema (excerpt)

we have a large json file with all the discs and one element is:

```json
{
  "id": "uuid",
  "name": "Heat",
  "brand": "Discraft",
  "category": "Control Driver",
  "speed": 9,
  "glide": 6,
  "turn": -3,
  "fade": 1,
  "stability": "Very Understable",
  "link": "https://www.marshallstreetdiscgolf.com/?s=heat&post_type=product",
  "pic": "https://.../heat.webp",
  "color": "#FF3737",
  "background_color": "#000000",
  "approved": "2014-02-24",
  "diameter_mm": 212.0,
  "height_mm": 1.8,
  "rim_depth_mm": 1.2,
  "rim_width_mm": 1.9,
  "rim_config": 26.0,
  "max_weight_g": 174.3,
  "flexibility_kG": 11.0
}
```

### Local Storage Key Map

| Key                  | Value                       | TTL        |
| -------------------- | --------------------------- | ---------- |
| `dg‑bags`            | JSON array of `Bag` objects | Persistent |
| `dg‑lastVisitedDisc` | `discId`                    | 24 h       |

### Bag Schema

```ts
interface Bag {
  id: string; // uuid v4
  name: string;
  description?: string;
  discs: Disc[]; // embedded for offline
  updatedAt: string; // ISO8601
}
```

## 7. Feature Requirements

### 7.1 Home Screen & Navigation

- Four large buttons laid out in 2×2 grid on ≥ 768 px, stacked on mobile: **Disc Search**, **Brand Search**, **Flight Search**, **Bags**.
- App header with title, install PWA icon, settings (theme toggle, data clear).
- Route prefetching using `vite-plugin‑router‑prefetch`.

### 7.2 Disc Search

| #   | Requirement                                                                      | Priority |      |       |     |
| --- | -------------------------------------------------------------------------------- | -------- | ---- | ----- | --- |
| 1   | Global type‑ahead search bar in header on all pages.                             | P0       |      |       |     |
| 2   | Search uses fuzzy matching on `name` and `name_slug`. Highlight matches.         | P0       |      |       |     |
| 3   | Results list shows disc pic (48 px), name, brand, and numbers \`9                |  6       |  -3  |  1\`. | P0  |
| 4   | Selecting a result navigates to `/disc/:slug`.                                   | P0       |      |       |     |
| 5   | If no results: show friendly "No disc found" with suggestion list of top brands. | P1       |      |       |     |

#### Disc Detail Page

- **Header:** Disc name + brand badge.
- **Primary Card:** Big image (responsive), numbers overlay.
- **Spec Table:** Fields: _Disc Type, Speed, Stability, Diameter, Height, Rim Depth, Rim Width, Inside Rim Diameter, Rim Depth/Diameter Ratio, Rim Configuration, Max Weight, Flexibility, Date Approved._
- **Actions:** `Show Flight Path`, `Find Similar`, `Buy`.
- **Show Flight Path:** Opens modal overlay containing SVG curve (see §9).
- **Find Similar:** Navigates to `/flight?speed=±1&glide=±1&turn=±1&fade=±1` prefilled.
- **Buy:** External link (open new tab) to `link`.

### 7.3 Brand Search

- `/brand` grid of brand logos (auto‑loaded from `/assets/brands/*.svg`). Mouse‑over brand name.
- Clicking brand navigates to `/brand/:slug` where:
  - All discs list ‑ virtualized list for ≥ 100 discs.
  - Each row: numbers, disc name, category badge color‑coded by stability.
  - Filter & sort controls: by speed, release year.

### 7.4 Flight Search

- `/flight` page with 4 × range sliders (1‑15, 1‑7, -5–+1, 0‑5). Display current value pill above thumb.
- Results list updates debounce 150 ms.
- `#result‑count` > 40 triggers virtual scroll.
- URL query string sync for deep‑linking.

### 7.5 Bags

#### 7.5.1 Bag Dashboard (`/bags`)

- Card list of existing bags (name, disc count).
- `New Bag` FAB opens modal: name (required), description (optional).
- Delete via long‑press or trash icon (confirm dialog).

#### 7.5.2 Bag Editor (`/bag/:id`)

- **Add Disc** button → search modal identical to global search; `Add` duplicates allowed (e.g., multiple Destroyers).
- Discs listed in collapsible groups by _category_.
- Drag‑to‑reorder within category.
- Local storage autosave every 1 s.

#### 7.5.3 Bag Report

- Button in editor opens full screen report.
- 15 × 7 grid rendered with CSS grid: rows = speed 1–15; cols = _Turn + Fade_ range -7…+7 mapped to -3…+3 (7 bins).
- Disc icon (24 px colored circle) plotted at `(speedRow, tfCol)`. Tooltip on hover/tap shows name.
- Legend bottom‑right mapping color to stability.

## 8. Component Architecture

```
AppShell
 ├─ NavBar (SearchBar, Logo, Menu)
 ├─ RouterOutlet
 └─ Footer
Pages/
 ├─ Home
 ├─ DiscDetail
 ├─ BrandGrid / BrandDetail
 ├─ FlightSearch
 ├─ BagsDashboard / BagEditor / BagReport
Components/
 ├─ DiscCard, DiscRow, DiscNumberBadge
 ├─ Slider (wrapped native <input type="range">)
 ├─ Modal, Drawer, Tooltip
 └─ FlightPathCanvas (SVG)
Hooks/
 ├─ useDiscSearch, useBrandDiscs, useBagStorage
Utilities/
 ├─ fuzzySearch.ts, flightPath.ts, similarDisc.ts
```

## 9. Algorithms & Calculations

### 9.1 Fuzzy Search

- Fuse.js (3 kB) configured with threshold 0.3, keys: `name`, `brand`, `category`.

### 9.2 Similar Disc Finder

- Mahalanobis distance on vector `[speed, glide, turn, fade]` with diag covariance.
- Candidates filtered where absolute difference ≤ 1 on each attribute.

### 9.3 Flight Path Generator

- Map attributes to Bézier control points:
  - **Initial angle** = `turn × ‑5°`.
  - **Fade arc** starts at 60 % of path length, curve right (RHBH) by `fade × 6°`.
- Distance scalar = `speed × 30 ft`.
- Render SVG width 100 %, polyline smoothed with cubic Bézier.

### 9.4 Bag Report Grid Mapping

- **Row** = `speed` (1‑15).
- **Column index** = clamp(`turn + fade`, ‑3, 3) + 3 (0‑6).
- Coordinates converted to CSS grid row/column.

## 10. UX & Visual Design Guidelines

- Flat design, color derived from `disc.color` for brand consistency.
- Spacing scale: 4 / 8 / 16 / 24 / 32 px.
- Mobile first; grid switches at 640 px.
- Hover states only on devices with `@media (hover: hover)`.
- Focus rings (`outline: 2px dashed #444`) for keyboard navigation.

## 11. Accessibility & I18n

- WCAG 2.1 AA.
- All images include descriptive `alt` text.
- Announce search result counts via ARIA live region.
- Text scale 100 %–200 % preserved.

## 12. Quality, Testing & Analytics

- **Unit Tests:** Vitest ≥ 80 % coverage on utils & hooks.
- **E2E:** Playwright for core flows (search, add disc, bag report).
- **Analytics:** Plausible self‑hosted; events: `search`, `view_disc`, `create_bag`, `plot_bag_report`.
- **Error Tracking:** Sentry (browser bundle).

## 13. Deployment & CI/CD

- GitHub Actions: lint, test, build.
- Preview deploy on PR to Netlify branch subdomain.
- Production deploy on main branch tag `v*`.

## 14. Milestones & Acceptance Criteria

| Milestone                     | Deliverables                         | ETA            |
| ----------------------------- | ------------------------------------ | -------------- |
| M1 – Scaffold                 | Vite app, routing, JSON fetch        | **Aug 18 ’25** |
| M2 – Search MVP               | Disc search & detail, brand grid     | Sep 1 ’25      |
| M3 – Flight Search            | Slider UI, similar disc algorithm    | Sep 15 ’25     |
| M4 – Bag Builder              | Local storage bags, add/remove discs | Oct 1 ’25      |
| M5 – Bag Report & Flight Path | SVG graphics, grid plotting          | Oct 15 ’25     |
| M6 – QA & Launch              | PWAs, analytics, docs                | Oct 30 ’25     |

Acceptance criteria listed inline with features (P0 must pass). Regression tests green.

## 15. Future Enhancements

- **Auth & Cloud Sync** via Firebase.
- **Social Bag Sharing** (public links).
- **Throw Tracker** to record actual throws.
- **Dark Mode** auto theme.
- **Multilingual Support** (ES, DE, FR).
- **3‑D Flight Visualizations** using WebGL.

---

**End of PRD**
