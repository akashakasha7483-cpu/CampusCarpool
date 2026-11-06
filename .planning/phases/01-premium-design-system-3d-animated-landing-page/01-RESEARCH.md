# Phase 1: Technical Research & Architectural Strategy
**Phase:** 01-premium-design-system-3d-animated-landing-page  
**Date:** 2026-11-06  
**Status:** Complete

---

## 1. Design System & Color Palette Strategy

### Palette Transformation
- **Primary Background:** Midnight Navy (`#070B14` base, `#0B1222` surface, `#0F182E` elevated card glass).
- **Primary Accents:** Electric Blue (`#3B82F6`, `#60A5FA`) and Neon Violet (`#8B5CF6`, `#A78BFA`, `#7C3AED`) for active navigation, glowing borders, brand gradients, and visual highlights.
- **Success & Trust Accents:** Emerald Green (`#10B981`, `#34D399`) reserved strictly for confirmed bookings, available seats, positive compatibility scores, and verified student indicators.
- **Text Hierarchy:**
  - High-contrast pure white/light slate (`#F8FAFC`, `#E2E8F0`) for primary headlines.
  - Muted slate (`#94A3B8`, `#64748B`) for metadata, sub-labels, and timestamps.

### Glassmorphism Tokens
- `backdrop-filter: blur(16px)` with subtle 1px border (`rgba(255, 255, 255, 0.08)`).
- Hover glow: `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2)`.

---

## 2. 3D Vehicle & Route Environment Strategy

### Dedicated Hero Experience
- Instead of generic vehicle customization sliders, focus exclusively on a **high-impact futuristic mobility hero**:
  - Sleek aerodynamic cyber vehicle body with metallic paint and electric blue headlight emission.
  - Animated road grid beneath the vehicle with infinite scrolling dashes.
  - Glowing curved route lines (electric blue & violet bezier curves) simulating university transit corridors.
  - Floating 3D holographic location beacons with pulsing light rings representing campus hubs.

### 3D Performance & Mobile Optimization
- **Asset Strategy:** Use procedural Three.js geometry with optimized buffer attributes and lightweight materials (`MeshStandardMaterial` with emissive maps), avoiding heavy multi-megabyte uncompressed models.
- **Lazy Loading:** Wrap the 3D canvas in `React.lazy()` and `<Suspense>` with a sleek skeleton/gradient placeholder.
- **Mobile LOD & Power Throttling:**
  - Detect mobile user-agent / screen width (`< 768px`).
  - Cap `dpr={Math.min(window.devicePixelRatio, 1.5)}`.
  - Disable unnecessary post-processing passes on mobile devices to preserve a steady 60 FPS.
- **Memory Management:** Ensure full disposal of geometries, materials, and requestAnimationFrame loops on component unmount.

---

## 3. Landing Page Composition & UX Integration

### Hero Section
- Dynamic split layout: High-impact hero copy and corridor search on the left, interactive 3D hero car canvas on the right.
- Orbital controls allowing mouse/touch interaction (drag to orbit, auto-reset to hero angle).

### Corridor Quick Search
- Input fields for **Pickup Location** and **Campus Destination** with instant auto-suggestion chips (Silk Board, Electronic City, Whitefield, Metro Gate).
- Submitting the search seamlessly navigates to `/find-rides?source=...&destination=...` without losing parameters.

### Preservation Invariants
- Zero backend route, controller, or database schema modifications.
- Existing authentication, ride discovery, seat booking, and test suites must remain 100% operational.

