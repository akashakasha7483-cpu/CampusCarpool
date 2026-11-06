# Phase 4: Research & Technical Architecture
## Premium Student Dashboard, Profiles & Ride Management

## 1. Domain & Problem Definition
CampusCarpool serves two distinct, alternating student roles:
1. **The Host Driver (Student Commuter with Vehicle):** Needs to publish daily commute corridors, manage vehicle specifications, monitor seat occupancy, and quickly approve or decline passenger requests with one click.
2. **The Passenger (Rider without Vehicle or Seeking Transit Share):** Needs to track requested rides, view real-time approval status, access verified driver contact information upon confirmation, and view digital boarding passes.

In Phase 4, we must unify these workflows into a cohesive mobility command center across:
- `/dashboard`: Personalized mobility command deck with high-level KPI metrics, active ride summaries, and quick action consoles.
- `/my-rides`: Driver corridor dispatch manager with live seat capacity meters, request counters, and ride lifecycle controls.
- `/my-requests`: Passenger booking hub with status tracking (`pending`, `accepted`, `rejected`) and digital boarding passes.
- `/received-requests`: Driver approval station with passenger profile inspection, seat decrement validation, and one-click accept/reject.
- `/post-ride`: Premium multi-step corridor builder with intermediate transit waypoints and fuel share contribution calculator.
- `/profile`: Verified academic credential dossier, peer rating display, vehicle garage registration, and emergency contact details.

---

## 2. Existing Backend APIs & Data Contracts
All backend controllers and schemas are fully implemented, verified, and operational:
1. **Auth & Profile API (`/api/auth`)**:
   - `GET /api/auth/profile`: Retrieves authenticated user details: `name`, `email`, `studentId`, `department`, `phone`, `rating`, `ridesCount`, `verified`, `vehicleInfo: { vehicleType, model, registrationNumber }`.
   - `PUT /api/auth/profile`: Updates profile information (persists vehicle specs and academic bio).
2. **Ride Management API (`/api/rides`)**:
   - `GET /api/rides/my-rides`: Returns rides posted by authenticated user with populated driver details and counts.
   - `POST /api/rides`: Creates new ride with auto-resolved landmark coordinates (`geoHelper.js`).
   - `DELETE /api/rides/:id`: Cancels ride, sets status to `cancelled`, and marks associated requests as cancelled.
3. **Request Management API (`/api/requests`)**:
   - `GET /api/requests/my-requests`: Returns requests made by the current user. When `status === 'accepted'`, populated driver contact details (phone, email) are accessible.
   - `GET /api/requests/received`: Returns requests received by the current driver for their posted rides. Populates passenger `name`, `studentId`, `department`, `phone`, and `rating`.
   - `POST /api/requests/:id/accept`: **Atomic Transaction:** Uses MongoDB `$inc: { availableSeats: -seatsRequested }` to decrement available seats atomically. Rejects immediately if available seats are insufficient.
   - `POST /api/requests/:id/reject`: Sets request status to `rejected`, preserving seat counts.
   - `DELETE /api/requests/:id`: Cancels pending request.

---

## 3. Privacy, Security & Data Integrity Safeguards
- **Zero Fake Data or Mock Ratings:** All ratings, ride counts, and verification badges bind strictly to `user.rating`, `user.ridesCount`, and verified student email domains (`@university.edu`).
- **Privacy Enforcement:** Passenger and driver phone numbers are masked or hidden until a ride request is officially `accepted` by the host driver.
- **Atomic Concurrency Protection:** Under no circumstances should client code mutate seat balances directly. The UI must invoke `/api/requests/:id/accept` and reflect the returned `ride.availableSeats`.

---

## 4. UI/UX & Design Token Architecture
- **Palette Consistency:**
  - Background: Deep Midnight Navy (`#070B14`, `#0F172A`)
  - Accent Corridors: Electric Blue (`#3B82F6`), Neon Violet (`#8B5CF6`)
  - Status Indicators:
    - `Active / Accepted / Verified`: Emerald Green (`#10B981`)
    - `Pending / In Review`: Neon Amber (`#F59E0B`)
    - `Rejected / Cancelled`: Rose / Crimson (`#EF4444`)
- **Visual Elements:** Glassmorphic cards with subtle backdrop blurs, top-line illumination ribbons, driver avatar gradient pills, visual seat dot gauges, and high-density SaaS tables.

---

## 5. Wave Plan Breakdown (3 Plans)
1. **Plan 04-01 (Wave 1): Mobility Command Deck & Student Profile Dossier**
   - Redesign `Dashboard.jsx` (KPI ribbons, quick dispatch drawer, active bookings summary).
   - Redesign `Profile.jsx` (Academic credentials, peer ratings, vehicle specs registration).
   - Create `StudentVerificationBadge.jsx` for reusable academic credentials.
2. **Plan 04-02 (Wave 2): Driver Dispatch Console & Passenger Booking Hub**
   - Redesign `MyRides.jsx` (Corridor capacity meters, request counts, lifecycle controls).
   - Redesign `ReceivedRequests.jsx` (Driver approval dispatcher, one-click accept/reject with atomic sync).
   - Redesign `MyRequests.jsx` (Passenger booking status tracker, digital boarding pass vouchers).
3. **Plan 04-03 (Wave 3): Futuristic Multi-Step Corridor Dispatcher**
   - Redesign `PostRide.jsx` (Multi-step or segmented corridor publisher with intermediate stop chips and live fuel split calculator).

