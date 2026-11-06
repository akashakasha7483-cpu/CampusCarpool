# Integrations & External Services

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool

## 1. Database Integration: MongoDB Atlas

- **Driver:** Mongoose v8.2.0
- **URI Format:** `mongodb+srv://<user>:<password>@cluster0.jzaflwa.mongodb.net/campuscarpool?retryWrites=true&w=majority`
- **Security:**
  - TLS encrypted transport
  - IP Access List configured for cloud access (`0.0.0.0/0`)
  - Connection pooling handled via Mongoose connection manager in `backend/config/db.js`
- **Collections:**
  - `users`: Student accounts, credentials, vehicle profiles, ratings
  - `rides`: Published rides, origin, destination, intermediate waypoints, departure times, seats
  - `riderequests`: Booking requests linking passengers, drivers, and rides with status flags

## 2. Cloud Hosting: Render

- **Backend Web Service (`campuscarpool-backend-qzd0`):**
  - Public URL: `https://campuscarpool-backend-qzd0.onrender.com`
  - Build Command: `npm install`
  - Start Command: `npm start` (`node server.js`)
  - Environment Variables:
    - `PORT`: `5000`
    - `MONGODB_URI`: Atlas connection string
    - `JWT_SECRET`: Secret key for token signing
- **Frontend Static Site (`campuscarpool-frontend-qzd0`):**
  - Public URL: `https://campuscarpool-frontend-qzd0.onrender.com`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
  - Environment Variables:
    - `VITE_API_URL`: Points to `https://campuscarpool-backend-qzd0.onrender.com/api`

## 3. Geospatial Mapping & Geocoding

- **Map Rendering:** Leaflet OpenStreetMap tiles via `react-leaflet`
- **Matching Algorithm:** Bigram Dice coefficient algorithm implemented in JavaScript for approximate campus location string matching (e.g. matching "Silk Board" with "Silkboard Junction").

## 4. Authentication Integration

- **Standard:** JSON Web Tokens (JWT)
- **Token Transmission:** `Authorization: Bearer <token>` HTTP header
- **Client Storage:** `localStorage.getItem('token')` managed by `AuthContext.jsx`
- **Session Lifecycle:** Auto-checked on app mount via `GET /api/auth/me`.

