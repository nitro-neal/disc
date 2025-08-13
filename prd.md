### DiscBagPro – Functional PRD (feature-by-feature, tech-agnostic)

This document specifies the complete, user-visible functionality of the DiscBagPro app so it can be reproduced without referencing implementation details or styling. It covers pages, links, inputs, outputs, state changes, and behaviors.

### Scope and goals
- Help users discover discs by brand and by flight characteristics.
- Let users view details for any disc, visualize its flight, and find similar discs.
- Let users create and manage multiple disc bags, add/remove discs, and view a bag report with analysis and a combined flight chart.
- Provide curated professional bags for inspiration and one-click import.

### Global layout and navigation
- **Header**
  - **Logo**: Clicking the app logo navigates to `/` (Home).
  - **Search bar** (global):
    - User types a query to search discs by name, brand, or category.
    - While typing, a dropdown opens showing up to 8 matching discs.
    - Each result shows disc name, brand, flight numbers, and a colored initial.
    - Keyboard support: Up/Down to move selection; Enter opens the selected disc detail; Escape closes the dropdown.
    - Clicking a result navigates to `/disc/:slug` for that disc.
    - Clear (✕) button empties the search field and closes the dropdown.
  - **Desktop nav** links: `Brands` → `/brand`, `Flight Search` → `/flight`, `Get Good` → `/get-good`, `Pro Bags` → `/pro-bags`, `My Bags` → `/bags`.
  - **Mobile**
    - A menu button toggles the mobile nav listing the same links. Selecting a link closes the menu and navigates.
    - A `🎒` shortcut opens `My Bags` (`/bags`).
  - **Theme toggle**: Switching the toggle immediately changes the dark / light theme and persists the choice. The toggle is also present in the mobile menu.
- **Footer**
  - Shows static text and two external links: `About`, `Contact` (placeholders).

### Data and persistence (functional)
- **Disc database**: Automatically loads on app start. If loading fails, show a generic error message on affected pages.
- **Bags**: Stored locally. Creating, updating (name, description, contents), and deleting bags persist across sessions.
- **Settings**: dark / light Theme preference persists across sessions.

### Pages

#### Home (`/`)
- **Hero**: Title and subtitle introducing the app.
- **Loading indicator**: If the disc database is still loading, show a loading message.
- **Main menu grid (cards with links)**
  - `Brand Search` → `/brand`.
  - `Flight Search` → `/flight`.
  - `Get Good` → `/get-good`.
  - `Pro Bags` → `/pro-bags`.
  - `My Bags` → `/bags`.
- **Recent Bags** (only if user has bags):
  - Shows up to 3 most recently updated bags with name and disc count.
  - Clicking a bag navigates to `/bag/:id`.
- **Getting Started** (only if there are no bags and not loading):
  - Static guidance cards describing how to search, compare flights, and build a bag.

#### Brand Search (`/brand`)
- Shows a count of manufacturers and a grid of brands.
- Each brand card shows brand name and disc count; clicking navigates to `/brand/:slug`.
- Brands may be featured (e.g., "Sponsored") and are still navigable the same way.
- If discs are still loading, show a loading message.

#### Brand Detail (`/brand/:slug`)
- **Header**: Brand name and number of available discs for that brand.
- **Controls**
  - Sort by: `Name`, `Speed` (descending), `Category`.
  - Filter by speed buckets: `All`, `1–3`, `4–6`, `7–9`, `10–15`.
  - Results counter: shows filtered count vs. total.
- **Disc list**
  - Each disc row shows brand, category, stability, and flight numbers.
  - Clicking a disc navigates to `/disc/:slug`.
- **Empty state**: When filters result in zero matches, a `Clear Filters` action resets sort and filter.
- **Loading**: While loading, show a loading message.
- **Error**: If brand has no discs, show `Brand Not Found` with a link back to `/brand`.

#### Flight Search (`/flight`)
- **Controls** (all are two-ended ranges):
  - `Speed` (1–15), `Glide` (1–7), `Turn` (-5 to +1), `Fade` (0–5).
  - Changing any control updates the URL query parameters (e.g., `speed_min`, `speed_max`, etc.) after a short delay.
  - A `Reset Filters` action restores Speed 1–15, Glide 1–7, Turn -5–+1, Fade 0–5.
- **Results**
  - Shows total result count, and when needed, which slice is currently visible.
  - Pagination: Page size is 100. `Previous`/`Next` navigate pages; controls disable at ends.
  - Each result is a disc row; clicking it navigates to `/disc/:slug`.
- **Empty/initial states**
  - If no discs match active filters, show a guidance message and a button to reset filters.
  - With no active filters, show a prompt to use the sliders.
- **Loading**: While loading, show a loading message.

#### Disc Detail (`/disc/:slug`)
- **Header**: Disc name, brand, and the four flight numbers (Speed, Glide, Turn, Fade) with short descriptions.
- **Stability**: Displayed as descriptive text (e.g., Stable/Understable/Overstable/etc.).
- **Actions**
  - `Show Flight Path`: opens a modal (see Flight Path Modal below) visualizing the disc’s flight and showing an estimated distance based on selected skill level.
  - `Find Similar`: navigates to `/flight` with the disc’s flight numbers prefilled in the query string. This shows similar candidates via the flight filters.
  - `Add to Bag ▼` (only if the user has at least one bag): opens a dropdown listing all bags with current disc counts.
    - Selecting a bag adds the disc to that bag if it’s not already present, updates the bag’s last updated time, and shows a success alert.
    - If already present, shows an alert that the disc is already in the bag.
    - A `+ Create New Bag` link navigates to `/bags`.
  - `Buy Online ↗`: external link to the disc’s product page (opens in a new tab/window).
- **Description**: Static, category-based guidance text about how the disc type is typically used.
- **Similar Discs**
  - Shows up to 6 similar discs by comparing flight numbers; clicking any navigates to that disc’s detail.
- **Loading/Error/Not Found**
  - If data load fails, show a generic error with a link back to home.
  - If the `:slug` doesn’t exist, show `Disc Not Found` with a button back to home.

#### Pro Bags (`/pro-bags`)
- Grid of professional players with a short title/description and an approximate disc count.
- Clicking a pro navigates to `/pro-bag/:slug`.
- Includes an informational section explaining what you can do with pro bags (e.g., add individual discs or entire bags to your own).
- Shows a loading state while data is loading.

#### Pro Bag Detail (`/pro-bag/:slug`)
- **Breadcrumb**: `Pro Bags` → current pro name; clicking `Pro Bags` goes back.
- **Header**: Pro name, short title/description, and stats (disc count, number of brands).
- **Actions**
  - `← Back to Pro Bags`: returns to `/pro-bags`.
  - `Add All to Bag ▼` (only if the user has at least one bag): opens a dropdown of user bags.
    - Selecting a bag adds all discs from the pro’s bag that are not already present in the selected user bag; updates the bag’s last updated time and shows an alert indicating how many were added.
- **Disc categories**
  - Lists discs grouped by category (Distance Driver, Control Driver, Hybrid Driver, Midrange, Approach Discs, Putter) in that order.
  - Each card shows the disc’s name, brand, and flight numbers.
  - Clicking a disc navigates to `/disc/:slug` for that disc.
- **Loading/Not Found**
  - While the pro’s disc data is resolving, show a loading message.
  - If an invalid `:slug` is used, show `Pro Not Found` with a link back to `/pro-bags`.

#### My Bags – Dashboard (`/bags`)
- **Header**: Title and a `+ New Bag` button.
- **Empty state** (no bags yet): Encourages creating the first bag with a button that opens the Create Bag modal.
- **Bags grid** (when bags exist): Each bag card shows:
  - Bag name (link to `/bag/:id`).
  - Actions: `📊` opens `/bag/:id/report`; `➕` opens `/bag/:id` (editor) to add discs; `🗑️` opens the delete confirmation modal.
  - Optional description (if present).
  - Stats: disc count; category count (unique categories across discs); min–max speed range (computed from the bag’s discs).
  - Footer: last updated date; `Edit →` link to `/bag/:id`.
- **Card click**: Clicking the card background navigates to `/bag/:id`, except when clicking the name, action buttons, or `Edit →` link.
- **Create Bag modal**
  - Fields: Name (required), Description (optional).
  - Actions: `Create Bag` submits and adds the new bag; `Cancel` closes.
  - On create, the new bag appears in the grid and is persisted.
- **Delete confirmation modal**
  - Shows the bag name and a warning; `Delete Bag` removes it permanently; `Cancel` closes.

#### Bag Editor (`/bag/:id`)
- **Header**: Back link to `/bags`, bag name, optional description, and stats (disc count, number of categories).
- **Action**: `📊 View Report` navigates to `/bag/:id/report`.
- **Contents**
  - Discs grouped by category; for each disc, show a disc row plus a `Remove` control to remove it from the bag.
  - If the bag is empty, show an Empty Bag prompt with a button to add the first disc.
- **Add Disc**
  - Desktop button and a mobile floating action both open the Add Disc modal.
  - Add Disc modal:
    - Search input for discs by name/brand/category, returning up to 20 results.
    - Category filter (All or a single category) further narrows results.
    - Each result shows: `Details` link to `/disc/:slug` and an `Add` button that adds the disc to the bag.
  - Adding/removing discs updates the bag immediately in the UI and saves changes shortly after.
- **Loading/Not Found**
  - While loading, show a loading message.
  - If no bag exists for `:id`, show `Bag Not Found` with a link back to `/bags`.

#### Bag Report (`/bag/:id/report`)
- **Header**: Back link to `/bag/:id`, report title (bag name), and optional description.
- **Summary**
  - Total discs.
  - Number of categories.
  - Speed range (min–max) and any missing speeds within the range.
  - Number of brands represented.
- **Flight Chart** (combined)
  - Overlays the estimated flight paths for all discs in the bag in one interactive chart with distance markers.
  - Clicking any path or landing marker selects that disc and opens the Flight Path modal for it.
- **Category breakdown**
  - For each category: name, disc count, and a short list of discs (with a "+X more" indicator when applicable).
- **Coverage analysis**
  - Speed coverage: identifies missing speeds across the min–max range.
  - Stability balance: bar(s) representing distribution across stability types.
- **Loading/Not Found**
  - While loading, show a loading message.
  - If no bag exists for `:id`, show `Bag Not Found` with a link back to `/bags`.

#### Get Good (`/get-good`)
- Educational content explaining:
  - Flight numbers and what each number means.
  - Throwing form basics and common errors.
  - Release angles and their effects.
  - Stability types and when to use them.
  - Beginner/intermediate/advanced disc selection guidance and example recommendations.
  - General improvement tips (film form, field work, practice putting, etc.).

#### Not Found (`*`)
- 404 page with:
  - Animated/fun disc element the user can click to trigger a short throw animation.
  - Message, helpful tips, and quick links.
  - Action buttons: `🏠 Back to Home` → `/`, `🔍 Browse Discs` → `/brand`, `🏆 Pro Bags` → `/pro-bags`.
  - Quick links section: `Flight Search` → `/flight`, `My Bags` → `/bags`, `Get Good` → `/get-good`.

### Components and cross-cutting behaviors

#### Disc Row
- Used in lists. Clicking a row navigates to the corresponding disc detail page.
- Shows disc name, brand, category, stability, and flight numbers.

#### Flight Path Modal (opened from Disc Detail and Bag Report)
- Shows selected disc name, brand, and flight numbers.
- Skill level dropdown: `Beginner`, `Intermediate`, `Advanced`, `Professional`.
  - Changing it updates the estimated distance immediately.
- Displays a flight path visualization with release and landing markers and distance labels.
- Includes static explanations for each flight number and a stability indicator.
- Close behaviors: `Escape` key, close button, or clicking the backdrop.

#### Combined Flight Chart (used in Bag Report)
- Overlays all disc flight paths with a grid and distance markers.
- Legend lists each disc with a color chip; clicking a legend item or a path/marker selects the disc (opening the Flight Path Modal via the page callback).

#### Range Sliders (used in Flight Search)
- Two-thumb sliders set min and max values for Speed, Glide, Turn, Fade.
- Clicking the track moves the nearest thumb. Values snap to integers.

#### Modals (Create Bag, Delete Bag, Add Disc, Flight Path)
- Open as overlays, disable background scrolling while open.
- Close by: close button, `Escape`, or clicking outside (backdrop).

### URL structure and parameters
- `/` Home
- `/brand` Brand Search
- `/brand/:slug` Brand Detail (brand slug)
- `/flight` Flight Search (supports `speed_min`, `speed_max`, `glide_min`, `glide_max`, `turn_min`, `turn_max`, `fade_min`, `fade_max`; also supports single-value `speed`, `glide`, `turn`, `fade` inputs for “Find Similar” deep-links)
- `/disc/:slug` Disc Detail (disc slug)
- `/pro-bags` Pro Bags
- `/pro-bag/:slug` Pro Bag Detail (pro slug)
- `/bags` My Bags – Dashboard
- `/bag/:id` Bag Editor (bag id)
- `/bag/:id/report` Bag Report (bag id)
- `*` 404 Not Found

### Domain objects (functional fields referenced by the UI)
- **Disc** (fields used): `id`, `name`, `name_slug`, `brand`, `brand_slug`, `category`, `category_slug`, `speed`, `glide`, `turn`, `fade`, `stability`, `color`, `background_color`, `link`.
- **Bag**: `id`, `name`, `description?`, `discs[]` (array of Disc), `updatedAt`.
- **Settings**: `theme` (`dark` or `light`).

### Alerts and validations
- Adding a disc that already exists in a bag shows an alert and does not duplicate it.
- Adding all pro discs to a bag only adds discs not already present and shows how many were added.
- Creating a bag requires a non-empty name.
- Deleting a bag requires confirmation.

### Loading and error behaviors
- When the disc database is loading, applicable pages show a loading message and defer interactive results.
- If a looked-up entity does not exist (disc, brand, bag, or pro), show a friendly error screen with a navigational CTA to a relevant page.

### Accessibility and input behavior (functional)
- Search and sliders are keyboard-accessible (Arrow keys and Enter/Escape as described above).
- All modal dialogs are dismissible via `Escape` and backdrop click.


