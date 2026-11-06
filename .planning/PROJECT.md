# CampusCarpool: 3D Smart University Mobility Platform

## What This Is

CampusCarpool is a verified peer-to-peer university carpooling and bike-sharing web platform designed specifically for college students and faculty. It enables commuters to discover shared rides along university transit corridors through intelligent approximate route matching, reserve seats atomically, share fuel contributions, and interact with futuristic 3D vehicle visualizations.

## Core Value

Connecting university students along shared daily commute corridors with intelligent approximate route matching, atomic seat reservations, and immersive, responsive 3D mobility experiences.

## Requirements

### Validated (Production Ready & Preserved)

- [x] Secure JWT-based student authentication and academic credential verification
- [x] Ride creation with intermediate stops/waypoints, departure times, and seat pricing
- [x] Concurrency-safe atomic seat decrement (`$inc`) and overbooking prevention
- [x] Intelligent approximate route matching using location bigram dice coefficient and waypoint proximity
- [x] Host driver dispatch console to approve, reject, and manage inbound seat bookings
- [x] Passenger commuter console to track booking status and view verified driver contact coordinates
- [x] Procedural 3D vehicle canvas (CyberCar, CyberBike, CyberScooter) using React Three Fiber and Three.js
- [x] Geospatial route preview map with waypoint coordinates
- [x] 12-step automated backend integration test suite (`backend/test-api.js`)
- [x] Dual-service cloud deployment on Render with MongoDB Atlas integration

### Active Scope (Refined 5-Phase Premium Product Roadmap)

- [ ] **Phase 1: Premium Design System & 3D Animated Landing Page**
  - Establish a cohesive futuristic dark-navy/emerald design token system, typography, and micro-interactions.
  - Deliver an interactive 3D hero vehicle canvas with cinematic lighting, orbital controls, and smooth landing animations (using GSAP/Motion).
  - Responsive mobile-first layout with zero layout shifts.

- [ ] **Phase 2: Premium Ride Discovery & Booking Experience**
  - High-polish search and filtering interface inspired by modern SaaS comparison consoles.
  - Interactive seat selector with visual cabin layout, atomic booking dispatch, and instant real-time feedback.
  - Clear compatibility badges with algorithm match explanations (proximity, time delta, waypoint stops).

- [ ] **Phase 3: Interactive 3D Maps & Animated Route Visualization**
  - Turn-by-turn road geometries and corridor visualizations on geospatial maps.
  - Animated vehicle markers simulating commuter progress along the transit route.
  - Interactive intermediate stop/waypoint exploration with visual pin indicators.

- [ ] **Phase 4: Premium Student Dashboard, Profiles & Ride Management**
  - Unified student commuter console: dynamic greeting, KPI summary cards, and quick actions.
  - Streamlined "My Hosted Rides" and "Received Requests" dispatch tables with one-click approvals.
  - Modern student profile with verified academic roll badge, commuter rating, and vehicle registry.

- [ ] **Phase 5: Advanced Motion Design, Performance Optimization & Production Deployment**
  - Smooth page transitions and hover micro-interactions with GSAP / Motion.
  - WebGL context virtualization, mobile LODs, and bundle chunking optimizations.
  - Comprehensive end-to-end regression audit and Render cloud deployment verification.

### Out of Scope

- Commercial taxi / rideshare billing (Strictly non-profit student cost-sharing)
- Fake functionality, mock data, or dummy booking flows (Every action must bind to live APIs)
- Unverified external accounts (Restricted to verified university students and campus faculty)

## Context

- **Frontend:** React 18, Vite 6, Three.js, React Three Fiber, React Router v6, GSAP / Motion, custom CSS glassmorphism
- **Backend:** Node.js, Express, Mongoose, MongoDB Atlas
- **Current Branch:** `feature/futuristic-3d-mobility`
- **Live Deployment:** Backend on Render (`campuscarpool-backend-qzd0.onrender.com`), Frontend on Render (`campuscarpool-frontend-qzd0.onrender.com`)
