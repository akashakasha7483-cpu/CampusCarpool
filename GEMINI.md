<!-- GSD:project-start source:PROJECT.md -->

## Project

**CampusCarpool: 3D Smart University Mobility Platform**

CampusCarpool is a verified peer-to-peer university carpooling and bike-sharing web platform designed specifically for college students and faculty. It enables commuters to discover shared rides along university transit corridors through intelligent approximate route matching, reserve seats atomically, share fuel contributions, and interact with futuristic 3D vehicle visualizations.

**Core Value:** Connecting university students along shared daily commute corridors with intelligent approximate route matching, atomic seat reservations, and immersive, responsive 3D mobility experiences.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Core Runtimes & Languages

- **JavaScript / Node.js:** Node.js v18+ (CommonJS on backend, ESM on frontend)
- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 6.4.5
- **Routing:** React Router DOM 6.22.0

## Frontend Libraries & 3D Tools

- **3D Graphics Engine:**
- **Geospatial Mapping:**
- **Styling & UI:**

## Backend Frameworks & Services

- **Web Server:** Express 4.18.2
- **Database ODM:** Mongoose 8.2.0
- **Database Engine:** MongoDB Atlas (M0/Shared cluster, TLS 1.2+)
- **Security & Cryptography:**
- **Cross-Origin Resource Sharing:** `cors` 2.8.5
- **Environment Management:** `dotenv` 16.4.5

## Testing & Automation

- **Test Suite:** Native Node.js integration test script (`backend/test-api.js`) verifying:
- **Dev Runner:** `run.js` utilizing `child_process.spawn` for dual-process orchestration.

## Cloud Infrastructure

- **Cloud Platform:** Render (`render.yaml`)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## 1. Code Organization & Patterns

- **Separation of Concerns:**
- **Imports:** Standard library / third-party packages first, followed by internal context, utilities, and components.
- **Naming Conventions:**

## 2. API Response Conventions

### Success Response:

### Error Response:

## 3. Database Safety & Concurrency

- **Atomic Decrements:** Never perform read-modify-write for available seat balances. Always use MongoDB atomic operators:
- **Privacy Enforcement:** Sensitive information such as student passwords, JWT secrets, and personally identifiable developer info must never be returned in public endpoints (such as `/api/health`).

## 4. UI / Styling System

- **Color Tokens:**
- **Class Naming:** SaaS and futuristic prefixes (`.saas-stat-card`, `.saas-status-badge`, `.btn-primary`).

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern Overview

- **Frontend Client:** Single Page Application (SPA) built with React 18, Vite, and React Router v6.
- **Backend API:** Stateless RESTful service built with Node.js, Express, and Mongoose ODM.
- **Database:** MongoDB Atlas cloud document database with indexing and atomic transaction operations.
- **3D Graphics & Mobility Engine:** Three.js / React Three Fiber interactive vehicle canvas and Leaflet geospatial map routing.

## Key Characteristics

## Conceptual Layers

### 1. Presentation Layer (`frontend/src/`)

- **Pages (`src/pages/`):** Full-screen views handling route context, page state, and lifecycle (`Home`, `Dashboard`, `FindRides`, `PostRide`, `MyRides`, `MyRequests`, `ReceivedRequests`, `Profile`, `Garage`, `RouteExplorer`, `Login`, `Register`).
- **Components (`src/components/`):** Reusable UI building blocks, including `RideCard`, `Navbar`, `Footer`, `InteractiveSeatPicker`, `CompatibilityBadge`, and `RequestModal`.
- **3D Graphics (`src/components/3d/`):** Procedural 3D canvas rendering customizable vehicles (`CyberCar3D`, `CyberBike3D`, `CyberScooter3D`, `RealisticCar3D`) with neon light trails and orbit controls.
- **Geospatial Map (`src/components/map/`):** Interactive Leaflet maps rendering route trajectories, waypoints, and campus destinations.

### 2. State & Client Service Layer (`frontend/src/context/`, `frontend/src/api/`)

- **AuthContext (`src/context/AuthContext.jsx`):** Manages user session, JWT storage, profile refresh, and reactive auth states.
- **API Client (`src/api/client.js`):** Unified fetch wrapper with smart domain normalization between local dev (`/api` proxy) and Render production (`https://...onrender.com/api`).

### 3. API Gateway & Controller Layer (`backend/routes/`, `backend/controllers/`)

- **Routers (`routes/*.js`):** Express routers mapping HTTP methods and URL paths to controllers with JWT authentication middleware (`middleware/auth.js`).
- **Controllers (`controllers/*.js`):** Business logic layer orchestrating database queries, validating input payloads, calculating route matching scores, and formatting API responses.

### 4. Data Access Layer (`backend/models/`, `backend/config/`)

- **Mongoose Models (`models/*.js`):** Schemas for `User`, `Ride`, and `RideRequest` with schema constraints, enum validations, and query helpers.
- **Database Connection (`config/db.js`):** Resilient MongoDB connection manager with auto-retry and TLS support.

## Data Flow

```

```
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agent/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
