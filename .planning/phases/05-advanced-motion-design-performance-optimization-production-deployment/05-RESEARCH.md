# Phase 5: Research & Technical Architecture
## Advanced Motion Design, Performance Optimization & Production Deployment

## 1. Domain & Scope
CampusCarpool has achieved complete feature implementation across Phases 1 through 4:
- Phase 1: Cyber design system, 3D hero vehicle canvas, animated road horizon.
- Phase 2: Find Rides SaaS directory, comparison table, cabin HUD seat picker, and atomic bookings.
- Phase 3: Interactive 3D map flight deck, OSRM real road network geometry, heading rotation, and telemetry.
- Phase 4: Student mobility command deck, digital student ID, driver dispatch workstation, passenger boarding passes, and multi-step corridor publisher.

Phase 5 represents the final production polish, performance tuning, accessibility hardening, end-to-end verification, and deployment readiness review.

---

## 2. Motion Design & Page Transitions
- **Framework:** `framer-motion` (v11.15.0) is already installed in `frontend/package.json`.
- **Implementation:**
  - Wrap top-level route switcher in `frontend/src/App.jsx` with `<AnimatePresence mode="wait">`.
  - Provide a reusable `<PageTransition>` wrapper component applying subtle opacity (`0 -> 1`), slight vertical translation (`8px -> 0px`), and micro-blur easing (`blur(4px) -> blur(0px)`) over 220ms.
  - Zero layout jumping: Use `mode="wait"` to cleanly unmount the previous view before rendering the next view.
- **Reduced-Motion Support:**
  - Support `@media (prefers-reduced-motion: reduce)` in `frontend/src/styles/index.css`.
  - When reduced motion is preferred by the operating system, disable page translations, infinite pulses, and camera tour rotations, falling back to instant opacity fades.

---

## 3. WebGL & Mobile 3D Performance Optimization
- **Vite Bundle Optimization (Code Splitting):**
  - Currently, Vite produces a single large bundle chunk: `dist/assets/index-*.js ~2,260 kB`.
  - By wrapping heavy pages (`Home`, `FindRides`, `RouteExplorer`, `Dashboard`, `MyRides`, `PostRide`, `Profile`, `Garage`) in `React.lazy()` with a sleek cyber fallback spinner, the initial page load bundle drops dramatically.
  - Configure `vite.config.js` with `build.rollupOptions.output.manualChunks` to split `three`, `@react-three/fiber`, and `maplibre-gl` into separate asynchronous vendor chunks.
- **Three.js & MapLibre Mobile Tuning:**
  - Cap canvas `dpr` at `Math.min(window.devicePixelRatio, 1.5)` to prevent mobile GPUs from choking on 3x retina displays.
  - Pause `requestAnimationFrame` loops when tab visibility changes (`document.hidden`).

---

## 4. Security & Dependency Audit Analysis
- **Audit Findings:**
  - Prior audit reported 2 moderate, 1 critical vulnerability.
  - We must run `npm audit` to identify the exact package advisory and determine whether it resides in dev dependencies (e.g. Vite or build tools) or runtime dependencies.
  - Never run `npm audit fix --force` blindly, as it introduces breaking major version upgrades. Apply non-breaking patches only.

---

## 5. OSRM & CARTO Production Readiness Review
- **OSRM:**
  - OpenStreetMap's public OSRM demo server is intended for testing and moderate traffic.
  - In Phase 3, we successfully placed OSRM behind `routeGeometryService.js` with:
    1. Client-side memory caching (1-hour TTL keyed by coordinate hash).
    2. 4,000ms timeout guard (`AbortController`).
    3. Resilient fallback to direct landmark coordinates if OSRM is slow.
  - For enterprise production scaling, self-hosting OSRM or using OpenRouteService / Mapbox with API keys is documented in deployment notes.
- **CARTO Tiles:**
  - Free raster tile service from CARTO / OpenStreetMap requires standard attribution.
  - Verified: Attribution is embedded directly in `RouteMap3D.jsx` MapLibre attribution controls.

---

## 6. End-to-End Regression & Render Deployment
- **E2E Simulation:** Create `backend/test-e2e-mobility.js` exercising the complete multi-user lifecycle.
- **Render Configuration:** Review `render.yaml` to ensure Node environment, static site proxy routing, and secrets are cleanly declared without hardcoded credentials.

