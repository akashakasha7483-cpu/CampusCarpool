# Codebase Concerns & Future Roadmap

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool

## 1. 3D Graphics & Mobile Performance
- **Observation:** Three.js canvases (`VehicleCanvas3D.jsx`) run procedural 3D models with real-time lighting and shadows. On lower-end mobile devices, rendering multiple 3D canvases can cause frame drops.
- **Recommendation:** Implement WebGL context virtualization, lower pixel ratio on mobile (`Math.min(window.devicePixelRatio, 1.5)`), and add fallback 2D SVGs for low-power mode.

## 2. Real-Time Communication
- **Observation:** Current seat request updates rely on client polling or manual page refresh.
- **Recommendation:** Integrate Socket.io or Server-Sent Events (SSE) so host drivers receive instant push notifications when passengers request seats, and passengers receive instant approval toasts.

## 3. Map & Routing Precision
- **Observation:** Route explorer uses linear coordinates and fuzzy string matching.
- **Recommendation:** Integrate OpenStreetMap OSRM (Open Source Routing Machine) or Mapbox Directions API for turn-by-turn road geometry, realistic driving durations, and live traffic estimations.

## 4. Payment & Escrow Boundaries
- **Observation:** Ride contributions are currently handled via cash/peer-to-peer agreement.
- **Recommendation:** Implement UPI QR generation or escrow wallet integration with non-profit university carpooling compliance.

