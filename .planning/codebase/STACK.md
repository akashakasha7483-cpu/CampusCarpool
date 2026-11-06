# Technology Stack

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool

## Core Runtimes & Languages

- **JavaScript / Node.js:** Node.js v18+ (CommonJS on backend, ESM on frontend)
- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 6.4.5
- **Routing:** React Router DOM 6.22.0

## Frontend Libraries & 3D Tools

- **3D Graphics Engine:**
  - `three`: 0.162.0 (WebGL 3D engine)
  - `@react-three/fiber`: 8.15.19 (React renderer for Three.js)
  - `@react-three/drei`: 9.102.6 (Three.js helpers & shader utilities)
- **Geospatial Mapping:**
  - `leaflet`: 1.9.4
  - `react-leaflet`: 4.2.1
- **Styling & UI:**
  - Pure custom CSS (`frontend/src/styles/index.css`) with CSS custom properties, glassmorphism (`backdrop-filter`), and CSS grid
  - SVG iconography built in `frontend/src/components/Icons.jsx`

## Backend Frameworks & Services

- **Web Server:** Express 4.18.2
- **Database ODM:** Mongoose 8.2.0
- **Database Engine:** MongoDB Atlas (M0/Shared cluster, TLS 1.2+)
- **Security & Cryptography:**
  - `bcryptjs`: 2.4.3 (salted password hashing)
  - `jsonwebtoken`: 9.0.2 (HMAC SHA-256 JWT signing and verification)
- **Cross-Origin Resource Sharing:** `cors` 2.8.5
- **Environment Management:** `dotenv` 16.4.5

## Testing & Automation

- **Test Suite:** Native Node.js integration test script (`backend/test-api.js`) verifying:
  - Public health check endpoint
  - Driver and passenger registration & authentication
  - Ride publishing and fuzzy matching algorithms
  - Atomic seat reservations and overbooking prevention
  - Privacy safeguards (ensuring no personal names or IDs in technical responses)
- **Dev Runner:** `run.js` utilizing `child_process.spawn` for dual-process orchestration.

## Cloud Infrastructure

- **Cloud Platform:** Render (`render.yaml`)
  - **Backend Web Service:** Node environment, auto-deployed from GitHub
  - **Frontend Static Site:** Static CDN deployment built with `npm run build`

