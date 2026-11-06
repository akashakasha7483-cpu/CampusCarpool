# Testing Architecture & Verification

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool

## Test Infrastructure

The project uses an end-to-end integration test runner implemented in `backend/test-api.js`.

### Execution Command:
```bash
node backend/test-api.js
```

### Coverage (12 Core Test Assertions):
1. **Health Check (`GET /api/health`):** Verifies HTTP 200, DB connection status, and privacy enforcement (zero student names or IDs leaked).
2. **Driver Registration (`POST /api/auth/register`):** Tests student driver account creation with vehicle details.
3. **Passenger Registration (`POST /api/auth/register`):** Tests passenger student account creation.
4. **Driver Authentication (`POST /api/auth/login`):** Tests credentials validation and JWT token issuance.
5. **Ride Publishing (`POST /api/rides`):** Tests route creation, waypoints, schedule, and seat capacity.
6. **Intelligent Route Matching (`GET /api/rides/search`):** Tests fuzzy string matching and scoring algorithm.
7. **Seat Request Dispatch (`POST /api/requests`):** Tests passenger booking request generation.
8. **Duplicate Request Prevention:** Tests HTTP 400 rejection when duplicate requests are submitted.
9. **Host Inbound Requests (`GET /api/requests/received`):** Tests driver retrieval of pending booking requests.
10. **Atomic Seat Booking (`PUT /api/requests/:id/accept`):** Tests atomic seat decrement (`$inc`) and booking confirmation.
11. **Overbooking Prevention:** Tests that booking more seats than available triggers HTTP 400.
12. **Ride & Request Synchronization (`GET /api/requests/my` & `GET /api/rides/my`):** Tests end-to-end data integrity.

## Frontend Build Verification

To test that all JSX components, Three.js shaders, CSS classes, and Vite bundles compile cleanly:
```bash
npm --prefix frontend run build
```
Exit code 0 confirms production readiness.

