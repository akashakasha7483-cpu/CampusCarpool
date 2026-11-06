# Code Conventions & Standards

**Analysis Date:** 2026-11-06  
**Project:** CampusCarpool

## 1. Code Organization & Patterns

- **Separation of Concerns:**
  - Routes (`backend/routes/`) only declare paths, HTTP methods, and attach middleware.
  - Controllers (`backend/controllers/`) handle request body parsing, model queries, business calculations, and status codes.
  - Presentation components are purely functional React components with hooks (`useState`, `useEffect`, `useMemo`).
- **Imports:** Standard library / third-party packages first, followed by internal context, utilities, and components.
- **Naming Conventions:**
  - React components & files: PascalCase (e.g. `RideCard.jsx`, `InteractiveSeatPicker.jsx`).
  - Controllers & utilities: camelCase (e.g. `rideController.js`, `client.js`).
  - Mongoose models: PascalCase singular (e.g. `User.js`, `Ride.js`).
  - Routes: lowercase kebab or plural (e.g. `rides.js`, `requests.js`).

## 2. API Response Conventions

Every backend API endpoint returns a standardized JSON object:

### Success Response:
```json
{
  "success": true,
  "message": "Ride posted successfully!",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Descriptive error message explaining validation or resource failure"
}
```

## 3. Database Safety & Concurrency

- **Atomic Decrements:** Never perform read-modify-write for available seat balances. Always use MongoDB atomic operators:
  ```javascript
  const updatedRide = await Ride.findOneAndUpdate(
    { _id: rideId, availableSeats: { $gte: seatsRequested } },
    { $inc: { availableSeats: -seatsRequested } },
    { new: true }
  );
  ```
- **Privacy Enforcement:** Sensitive information such as student passwords, JWT secrets, and personally identifiable developer info must never be returned in public endpoints (such as `/api/health`).

## 4. UI / Styling System

- **Color Tokens:**
  - Primary Background: Dark Navy `#080D1A` / `#0F172A`
  - Elevated Cards: `#111C2E` / `#0D1626` with `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Accent / Glow: Emerald Neon `#10B981` / `#34D399` (`box-shadow: 0 0 15px rgba(16, 185, 129, 0.35)`)
  - Cyan Accent: `#06B6D4` / `#38BDF8`
  - Warning / Pending: Amber `#F59E0B`
  - Error / Destructive: Rose `#EF4444`
- **Class Naming:** SaaS and futuristic prefixes (`.saas-stat-card`, `.saas-status-badge`, `.btn-primary`).

