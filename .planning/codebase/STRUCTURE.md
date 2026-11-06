# Codebase Structure

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool

## Directory Layout

```
CampusCarpool/
├── .planning/                  # GSD planning directory (configs, roadmaps, states)
│   ├── codebase/               # Mapped architectural documents
│   └── config.json             # GSD workflow configuration
├── backend/                    # Node.js Express REST API backend
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js   # Registration, login, profile management
│   │   ├── rideController.js   # Ride posting, search, fuzzy matching, cancellation
│   │   └── requestController.js# Seat requests, atomic bookings, approval/rejection
│   ├── middleware/
│   │   └── auth.js             # JWT bearer verification middleware
│   ├── models/
│   │   ├── Ride.js             # Mongoose schema for rides & waypoints
│   │   ├── RideRequest.js      # Mongoose schema for passenger booking requests
│   │   └── User.js             # Mongoose schema for student accounts & vehicles
│   ├── routes/
│   │   ├── auth.js             # /api/auth routes
│   │   ├── rides.js            # /api/rides routes
│   │   └── requests.js         # /api/requests routes
│   ├── package.json            # Backend dependencies & scripts
│   ├── server.js               # Express server entry point & health check
│   └── test-api.js             # 12-step automated backend integration test suite
├── frontend/                   # React 18 + Vite SPA frontend
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Unified API client & Render URL normalizer
│   │   ├── components/
│   │   │   ├── 3d/             # Three.js / React Three Fiber vehicle canvases
│   │   │   │   ├── CyberBike3D.jsx
│   │   │   │   ├── CyberCar3D.jsx
│   │   │   │   ├── CyberScooter3D.jsx
│   │   │   │   ├── NeonLightTrails.jsx
│   │   │   │   ├── RealisticCar3D.jsx
│   │   │   │   └── VehicleCanvas3D.jsx
│   │   │   ├── map/
│   │   │   │   └── RouteMap3D.jsx # Leaflet geospatial route visualizer
│   │   │   ├── CompatibilityBadge.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Icons.jsx       # SVG iconography library
│   │   │   ├── InteractiveSeatPicker.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RequestModal.jsx
│   │   │   └── RideCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # React authentication context & session store
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FindRides.jsx
│   │   │   ├── Garage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyRequests.jsx
│   │   │   ├── MyRides.jsx
│   │   │   ├── PostRide.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ReceivedRequests.jsx
│   │   │   ├── Register.jsx
│   │   │   └── RouteExplorer.jsx
│   │   ├── styles/
│   │   │   └── index.css       # Global design system, glassmorphism, SaaS classes
│   │   ├── App.jsx             # React router setup & route boundaries
│   │   └── main.jsx            # React root DOM rendering
│   ├── index.html              # HTML shell
│   ├── package.json            # Frontend dependencies & build tooling
│   └── vite.config.js          # Vite config & dev server proxy
├── GEMINI.md                   # Project instructions & GSD workflow bindings
├── render.yaml                 # Infrastructure as code for Render cloud deployment
├── run.js                      # Concurrently launches backend (5000) & frontend (5173)
└── README.md                   # Project documentation
```

## Key Files & Entry Points

- **Backend Entry:** `backend/server.js` (Express listener on port 5000)
- **Frontend Entry:** `frontend/src/main.jsx` -> `frontend/src/App.jsx` (Vite dev server on port 5173)
- **API Client:** `frontend/src/api/client.js`
- **Integration Test Suite:** `backend/test-api.js`
- **Deployment Manifest:** `render.yaml`

