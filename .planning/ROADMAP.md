# Roadmap: CampusCarpool Premium Mobility Platform

## Overview

Transforming CampusCarpool into an ultra-premium, production-quality student carpooling and mobility platform. The roadmap prioritizes cohesive design tokens, a cinematic 3D hero landing page, an atomic booking experience, interactive geospatial route animation, student driver/passenger management consoles, and high-performance WebGL motion optimization.

## Phases

- [x] **Phase 1: Premium Design System & 3D Animated Landing Page** - Establish design tokens, typography, glassmorphic surfaces, and build an interactive 3D hero vehicle canvas with cinematic orbital animation.
- [x] **Phase 2: Premium Ride Discovery & Booking Experience** - SaaS-grade search filters, interactive visual seat picker, algorithm match explanations, and real-time atomic reservation feedback.
- [x] **Phase 3: Interactive 3D Maps & Animated Route Visualization** - Road-level route paths, animated vehicle travel simulation along commute corridors, and interactive waypoint inspection.
- [x] **Phase 4: Premium Student Dashboard, Profiles & Ride Management** - Host driver dispatch console, passenger booking tracker, student academic verification badges, and vehicle profiles.
- [x] **Phase 5: Advanced Motion Design, Performance Optimization & Production Deployment** - GSAP / Motion fluid page transitions, WebGL mobile performance tuning, test suite verification, and Render cloud deployment.

## Phase Details

### Phase 1: Premium Design System & 3D Animated Landing Page
**Goal**: Create a cohesive, futuristic design system (dark midnight navy `#070B14`, electric blue `#3B82F6`, neon violet `#8B5CF6`, emerald success `#10B981`) and an engaging 3D hero landing page with smooth orbital controls and responsive typography.
**Depends on**: Nothing (Preserves existing Three.js canvas in `frontend/src/components/3d/`)
**Requirements**: REQ-01, REQ-02, REQ-03
**Success Criteria** (what must be TRUE):
  1. A unified design system with reusable CSS tokens for glass cards, glowing borders, buttons, and status indicators is established.
  2. The landing page renders a responsive 3D vehicle canvas with dynamic lighting, smooth entry animations, and auto-rotation.
  3. The page is fully responsive across desktop, tablet, and mobile with zero layout shift and 60 FPS performance.
  4. Quick corridor search bar on the landing page redirects directly to live rides with search parameters preserved.
**Plans**: 3 plans

Plans:
- [x] 01-01: Midnight Cyber Design System & Tokens in `frontend/src/styles/index.css`
- [x] 01-02: Optimized 3D Futuristic Hero Car & Route Horizon Canvas (`HeroCarCanvas3D.jsx`)
- [x] 01-03: Premium Animated Landing Page Assembly & Corridor Search (`Home.jsx`, `Navbar.jsx`)

### Phase 2: Premium Ride Discovery & Booking Experience
**Goal**: Elevate `/find-rides` with SaaS-style filter tabs, dual Card/Table views, and an interactive cabin seat picker that triggers atomic seat reservations.
**Depends on**: Phase 1
**Requirements**: REQ-04, REQ-05, REQ-06
**Success Criteria**:
  1. Search results can be toggled seamlessly between responsive Grid Cards and a structured Comparison Table.
  2. Quick filter tabs allow instant filtering by Leaving Today, 2+ Seats Available, and High Match (75%+).
  3. Interactive seat picker visualizes cabin seats and confirms bookings through live atomic decrement (`$inc: { availableSeats: -n }`).
  4. Compatibility badges clearly display bigram Dice proximity scores, time differences, and waypoint matches.
**Plans**: 3 plans

Plans:
- [x] 02-01: Cyberpunk RideCard & SaaS RideComparisonTable (`RideCard.jsx`, `RideComparisonTable.jsx`, `CompatibilityBadge.jsx`)
- [x] 02-02: Next-Gen Vehicle Cabin HUD Seat Selector & Digital Boarding Pass (`InteractiveSeatPicker.jsx`)
- [x] 02-03: Cinematic FindRides Directory Assembly, KPI Ribbon & Filter Console (`FindRides.jsx`)

### Phase 3: Interactive 3D Maps & Animated Route Visualization
**Goal**: Upgrade `/route-explorer` to render realistic road route geometry and animated vehicle markers traveling between pickup points and campus destinations.
**Depends on**: Phase 1, Phase 2
**Requirements**: REQ-07, REQ-08, REQ-09
**Success Criteria**:
  1. Geospatial map visualizes road trajectories and intermediate waypoints with custom glowing Electric Blue & Neon Violet lines.
  2. Animated 3D vehicle marker simulates travel progression along real road geometry with realistic heading angle (bearing) turns.
  3. Clicking on intermediate waypoints displays pickup location details and estimated arrival times based on real OSRM driving duration.
  4. Interactive camera modes (Overview, Chase Cam / Follow, Waypoint Tour) provide cinematic perspectives.
  5. Responsive layout with mobile drawer/tab switching and fallback handling.
**Plans**: 3 plans

Plans:
- [x] 03-01: Real Road Geometry Service & OSRM Engine Integration (`routeGeometryService.js`)
- [x] 03-02: Next-Gen 3D Map Component with Glowing Shaders & Camera Modes (`RouteMap3D.jsx`)
- [x] 03-03: Cinematic Route Explorer Flight Control Room Assembly (`RouteExplorer.jsx`)

### Phase 4: Premium Student Dashboard, Profiles & Ride Management
**Goal**: Refine the student console suite (`/dashboard`, `/my-rides`, `/my-requests`, `/received-requests`, `/post-ride`, `/profile`) with SaaS polish and one-click actions.
**Depends on**: Phase 1, Phase 2, Phase 3
**Requirements**: REQ-09, REQ-10, REQ-11
**Success Criteria**:
  1. Host drivers can manage published rides, view seat occupancies, and approve/reject passenger requests with one click.
  2. Passengers can track active booking statuses, view confirmed driver contact coordinates, and cancel pending requests.
  3. Post Ride form provides a clean multi-step experience with dynamic waypoint additions and shared fuel offset calculations.
  4. Student profile displays verified college credentials, peer ratings, and vehicle registration info.
**Plans**: 3 plans

Plans:
- [x] 04-01: Mobility Command Deck & Student Profile Dossier (`Dashboard.jsx`, `Profile.jsx`, `StudentVerificationBadge.jsx`)
- [x] 04-02: Driver Dispatch Console & Passenger Booking Hub (`MyRides.jsx`, `ReceivedRequests.jsx`, `MyRequests.jsx`)
- [x] 04-03: Futuristic Multi-Step Corridor Dispatcher (`PostRide.jsx`)

### Phase 5: Advanced Motion Design, Performance Optimization & Production Deployment
**Goal**: Implement smooth page transitions with GSAP/Motion, optimize WebGL rendering for low-powered mobile devices, run full regression tests, and deploy to Render.
**Depends on**: Phases 1, 2, 3, 4
**Requirements**: REQ-12, REQ-13, REQ-14
**Success Criteria**:
  1. GSAP / Motion animations provide fluid page transitions and micro-interactions without performance overhead.
  2. WebGL contexts are virtualized and throttled gracefully on mobile devices.
  3. All 12 backend integration tests pass cleanly with zero regressions.
  4. Production build passes Vite compilation with optimized bundle chunking and deploys cleanly to Render.
**Plans**: 3 plans

Plans:
- [x] 05-01: Advanced Motion Design, Polished Page Transitions & Accessibility/Reduced-Motion (`PageTransition.jsx`, `App.jsx`, `index.css`)
- [x] 05-02: Mobile WebGL/3D Performance Optimization, Code-Splitting & Dependency/Security Audit (`vite.config.js`, `HeroCarCanvas3D.jsx`)
- [x] 05-03: End-to-End Regression Suite, Render Deployment Config & Final Visual QA (`test-e2e-mobility.js`, `render.yaml`)
