# Phase 2: Research & Technical Architecture

## 1. Domain & Problem Definition
CampusCarpool requires a high-polish, production-grade ride discovery and booking workflow on `/find-rides`. In Phase 1, we established the midnight navy, electric blue, and neon violet visual identity. In Phase 2, we must elevate the discovery experience so students can quickly scan, compare, and reserve seats along daily transit corridors without feeling overwhelmed or encountering booking confusion.

## 2. Codebase Inspection & Baseline State
- **Search API (`/api/rides/search`)**:
  - Parameters: `source`, `destination`, `date`, `time`, `minSeats`, `excludeOwn`.
  - Computes bi-gram Dice coefficient string proximity via `routeMatcher.js`.
  - Populates driver details: `name`, `email`, `studentId`, `department`, `phone`, `rating`, `vehicleInfo`.
  - Returns array of scored rides with `compatibility: { score, percentage, reasons }`.
- **Existing `FindRides.jsx`**:
  - Manages search parameters in URL query params.
  - Contains basic in-memory tabs (`all`, `high-match`, `multi-seat`, `leaving-today`).
  - Contains rudimentary view mode toggle (`grid` | `table`), but table is embedded inline with basic styling.
- **Existing `RideCard.jsx`**:
  - Renders basic driver initials, route points, vehicle type, price, and request button.
  - Still contains green color tokens from previous design.
  - Lacks structured visual hierarchy for departure time, price, seats, and route waypoints.
- **Existing `InteractiveSeatPicker.jsx`**:
  - Displays modal with generic rectangular seat buttons.
  - Submits to `POST /api/requests` with `rideId`, `seatsRequested`, `pickupNote`.
  - Uses basic alert for success without interactive confirmation ticket or live seat decrement feedback.

## 3. Architecture & Data Contracts (Zero Regressions)
- **Zero Backend Alteration**: All existing backend controllers (`rideController.js`, `requestController.js`), Mongoose schemas (`Ride`, `RideRequest`), and atomic MongoDB operators (`$inc: { availableSeats: -n }`) remain 100% untouched.
- **Client-Side State Flow**:
  - When a booking is submitted from `InteractiveSeatPicker`, on success it triggers a state callback that updates the ride's `availableSeats` in the parent list without needing a full jarring page reload.
  - If a ride reaches 0 available seats, its status badge reflects "Full / Waitlist" and disables the seat picker.
  - If the user is unauthenticated, clicking "Reserve Seat" seamlessly routes to `/login` with `state: { from: location }`.

## 4. UI/UX Strategy
- **Grid View**: Luxury cyberpunk glass cards with driver avatar pill, verified department tag, departure time countdown badge, electric blue/violet route trajectory, price pill, and compatibility score gauge.
- **Comparison Table View**: High-density SaaS comparison table with hover spotlight rows, sticky header, driver profile badge, departure corridor, seats remaining progress bar, price, and instant reserve action.
- **Interactive Cabin Seat HUD**: Top-down futuristic vehicle cabin with steering wheel icon, driver locked seat, open passenger seats with cyan glow when selected, occupied seats with locked red/muted state, total cost contribution counter, and pickup note textarea.
- **Animated Confirmation Ticket**: Upon successful reservation, smoothly transitions the modal into a sleek digital boarding pass with ride reference ID, pickup location, departure time, and driver contact info.

