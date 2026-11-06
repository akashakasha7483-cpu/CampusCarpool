# Architecture

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool (Smart University Transit Platform)

## Pattern Overview

**Overall:** Client-Server Monorepo / Decoupled Full-Stack Architecture  
- **Frontend Client:** Single Page Application (SPA) built with React 18, Vite, and React Router v6.
- **Backend API:** Stateless RESTful service built with Node.js, Express, and Mongoose ODM.
- **Database:** MongoDB Atlas cloud document database with indexing and atomic transaction operations.
- **3D Graphics & Mobility Engine:** Three.js / React Three Fiber interactive vehicle canvas and Leaflet geospatial map routing.

## Key Characteristics

1. **Client-Side Rendering (CSR):** Dynamic, interactive web UI with client-side routing, JWT session management in localStorage, and optimistic updates.
2. **Stateless API Architecture:** REST endpoints authenticated via Bearer JWT tokens in request headers.
3. **Approximate Route Matching Engine:** Custom fuzzy matching algorithm combining location bigram dice coefficient, waypoint proximity detection, and time window differences for intermediate commuter pickups.
4. **Concurrency-Safe Seat Inventory:** Atomic seat reservation (`$inc: { availableSeats: -seatsRequested }`) with race-condition prevention during simultaneous seat requests.

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
[User Action in Browser]
       │
       ▼
[React Component / Page] ────► [AuthContext / api.client.js]
                                              │ (HTTP / JSON + JWT)
                                              ▼
                                    [Express App / server.js]
                                              │
                                              ▼
                                    [Auth / Rate Middleware]
                                              │
                                              ▼
                                    [Route Controllers]
                                              │ (Mongoose Queries)
                                              ▼
                                    [MongoDB Atlas Cluster]
```

