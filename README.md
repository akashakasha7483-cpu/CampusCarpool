# CampusCarpool 🚗🎓
**Intelligent Student Ride-Sharing & Route Optimization Platform**

> **Academic Project Submission**  
> **Student Name:** AKASH M R  
> **Student ID:** 2102508522  
> **Degree Program:** B.Tech / B.E. Information Technology  

---

## 📌 Executive Summary

Students traveling along similar routes to campus often travel alone or uncoordinated, incurring unnecessary fuel costs, exacerbating campus traffic congestion, and contributing to vehicular emissions. **CampusCarpool** is a full-stack web platform specifically engineered for college commuters. It enables students to offer spare seats in their cars or two-wheelers, search for rides along their route with **intelligent approximate route matching**, view real-time compatibility scores, request seats, and manage bookings with **atomic overbooking prevention**.

---

## 🎯 Main Objectives & Innovations

1. **Intelligent Approximate Route Matching:**  
   Unlike rigid equality filters, CampusCarpool leverages token overlap and bi-gram dice coefficients to identify compatible rides even when riders board at intermediate bus stops, metro gates, or landmarks.
2. **Compatibility Scoring Algorithm:**  
   Each ride result features a dynamic compatibility percentage ($0\% - 100\%$) broken down into route alignment, travel time proximity window, and driver trust.
3. **Atomic Concurrency & Overbooking Prevention:**  
   Seat decrementing is executed via MongoDB atomic find-and-modify queries (`$inc: { availableSeats: -seats }`) ensuring no two concurrent passengers can overbook remaining seats.
4. **Student Identity & Trust:**  
   Restricted to verified students with roll numbers, college emails, vehicle registrations, and community peer ratings.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM v6, Custom SVG Icon Architecture, Modern Responsive Design Tokens |
| **Backend** | Node.js v24, Express.js 4, REST API Architecture, Helmet & Morgan logging |
| **Database** | MongoDB v8.3, Mongoose ORM, Atomic Updates & Compound Indexing |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js (10 salt rounds), CORS |
| **Styling** | Professional Navy Blue (`#0f172a`), Emerald Green (`#10b981`), and Pure White Design System |

---

## 📐 System Architecture

```
                    +--------------------------------+
                    |    React.js + Vite Frontend    |
                    |   (Port 5173 - Client Side)    |
                    +--------------------------------+
                                   |
                         HTTP / REST API (JWT)
                                   v
                    +--------------------------------+
                    |     Express.js Node Backend    |
                    |   (Port 5000 - Server Side)    |
                    +--------------------------------+
                       /           |              \
           [Auth Middleware] [Route Matcher] [Atomic Lock]
                      \            |              /
                    +--------------------------------+
                    |    MongoDB 8.3 + Mongoose      |
                    | (Database: campuscarpool)      |
                    +--------------------------------+
```

---

## 🧠 Intelligent Matching Algorithm

The compatibility score evaluates multiple weighted factors:

$$\text{Compatibility Score} = (0.50 \times S_{\text{route}}) + (0.25 \times S_{\text{time}}) + (0.15 \times S_{\text{date}}) + (0.10 \times S_{\text{driver}})$$

### Factors:
- **Route Score ($S_{\text{route}}$):** Evaluates bi-gram dice coefficient + token overlap between query pickup/destination against ride source, destination, and all intermediate waypoints.
- **Time Score ($S_{\text{time}}$):**
  - $|\Delta t| \le 15 \text{ min} \implies 1.0$ ($100\%$)
  - $|\Delta t| \le 30 \text{ min} \implies 0.9$ ($90\%$)
  - $|\Delta t| \le 60 \text{ min} \implies 0.75$ ($75\%$)
  - $|\Delta t| \le 120 \text{ min} \implies 0.5$ ($50\%$)
- **Date Score ($S_{\text{date}}$):** $1.0$ if date matches query, $0.2$ if different.
- **Driver Trust ($S_{\text{driver}}$):** Normalization of driver rating out of $5.0$.

---

## 🗄️ Database Models

### 1. User (`models/User.js`)
- `name` (String, required)
- `email` (String, unique, lowercase)
- `password` (Hashed with bcryptjs)
- `studentId` (String, Roll Number, e.g. `2102508522`)
- `department` (String, e.g. `Information Technology`)
- `phone` (String)
- `vehicleInfo` (`{ vehicleType, model, registrationNumber }`)
- `rating` (Number, default 4.8)
- `ridesHosted` / `ridesJoined` (Counter metrics)

### 2. Ride (`models/Ride.js`)
- `driver` (ObjectId ref User)
- `source` (String, pickup location)
- `destination` (String, drop-off location)
- `waypoints` (Array of Strings, intermediate stops)
- `date` (String, YYYY-MM-DD)
- `time` (String, HH:MM)
- `seatsTotal` (Number, 1-8)
- `availableSeats` (Number, 0-8)
- `pricePerSeat` (Number, INR contribution)
- `status` (`'active' | 'full' | 'completed' | 'cancelled'`)

### 3. RideRequest (`models/RideRequest.js`)
- `ride` (ObjectId ref Ride)
- `passenger` (ObjectId ref User)
- `driver` (ObjectId ref User)
- `seatsRequested` (Number)
- `pickupNote` (String)
- `status` (`'pending' | 'accepted' | 'rejected' | 'cancelled'`)
- `responseMessage` (String, note from driver)

---

## 🔌 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student account | Public |
| `POST` | `/api/auth/login` | Student login & JWT issue | Public |
| `GET` | `/api/auth/me` | Current authenticated student info | Private |
| `PUT` | `/api/auth/profile` | Update profile & vehicle info | Private |

### Rides (`/api/rides`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/rides` | Post a new ride offer with waypoints | Private |
| `GET` | `/api/rides/search` | Search rides with intelligent scoring | Public/Private |
| `GET` | `/api/rides` | Get all active campus rides | Public |
| `GET` | `/api/rides/my-rides` | Get rides hosted by logged-in student | Private |
| `GET` | `/api/rides/:id` | Get ride details and confirmed riders | Public |
| `PATCH` | `/api/rides/:id/cancel` | Cancel ride (Driver only) | Private |

### Requests (`/api/requests`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/requests` | Send seat request to driver | Private (Passenger) |
| `GET` | `/api/requests/my-requests` | View requests sent by student | Private (Passenger) |
| `GET` | `/api/requests/received` | View requests received for hosted rides | Private (Driver) |
| `PATCH` | `/api/requests/:id/accept` | Accept request & decrement seats | Private (Driver) |
| `PATCH` | `/api/requests/:id/reject` | Reject seat request | Private (Driver) |
| `PATCH` | `/api/requests/:id/cancel` | Cancel request & restore seats | Private (Passenger) |

### System Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns project status, student ID, and DB connection state |

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** (Local instance or MongoDB Atlas)

### Quick Start (All-in-One)

1. **Clone or Open Project Directory:**
   ```bash
   cd CampusCarpool
   ```

2. **Configure Environment (Optional):**
   A pre-configured `backend/.env` is already provided:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/campuscarpool
   JWT_SECRET=campuscarpool_jwt_super_secret_key_2026_akash
   JWT_EXPIRES_IN=7d
   ```
   *(If you want to use MongoDB Atlas cloud, simply paste your Atlas URI in `backend/.env`)*

3. **Seed Database with Academic Demo Data:**
   ```bash
   npm run seed
   ```
   *This seeds sample students (including AKASH M R - 2102508522), campus rides, waypoints, and requests.*

4. **Run the Full Application:**
   ```bash
   npm start
   ```
   *(Or `node run.js`)*

   - **Frontend UI:** Open your browser at **`http://localhost:5173`**
   - **Backend API:** Active at **`http://localhost:5000`**
   - **API Health Check:** **`http://localhost:5000/api/health`**

---

## 🧪 Testing the User Journeys

### Pre-loaded Demo Accounts:
| Role | Email | Password | Student ID |
|---|---|---|---|
| **Driver (Akash M R)** | `akash@college.edu` | `password123` | **2102508522** |
| **Passenger (Priya Sharma)** | `priya@college.edu` | `password123` | `2102508101` |
| **Driver (Rahul Verma)** | `rahul@college.edu` | `password123` | `2102508204` |

*(Tip: On the Login page, click **"Fill Driver (Akash)"** or **"Fill Passenger (Priya)"** for instant one-click login!)*

### Key Demonstration Journeys:
1. **Intelligent Search & Approximate Matching:**
   - Go to **Find Rides**.
   - Search pickup: `Koramangala`, destination: `Campus`.
   - Notice that Akash's ride (which started at Silk Board but included Koramangala as a waypoint) is discovered with a **~90% Excellent Match** badge!
   - Click the match badge to inspect the mathematical breakdown.

2. **Requesting a Seat:**
   - Log in as Passenger (`priya@college.edu`).
   - Click **"Request Seat Now"** on any ride with available capacity.
   - Choose requested seats and add a pickup note. Click **Confirm Request**.

3. **Driver Approval & Concurrency Protection:**
   - Log in as Driver (`akash@college.edu`).
   - Go to **Received Requests**.
   - Inspect the passenger's details, department, and contact phone.
   - Click **Accept & Confirm Seat**.
   - Notice the ride's available seats automatically decrement by the booked amount!
   - Any attempt to overbook or request duplicate seats is rejected with clear error messages.

4. **Profile Management:**
   - Navigate to **Profile** to update vehicle specs (Car/Bike/Scooter), registration number, department, and commuter bio.

---

## 🛡️ Automated Verification Suite

Run the full end-to-end automated test suite:
```bash
npm run test:api
```
All 12 validation steps execute against live MongoDB, verifying health, student registration, JWT tokens, ride posting, waypoint matching, duplicate request rejection, and seat decrement logic.

---

**Academic Project by:**  
**AKASH M R** &bull; Student ID: **2102508522**  
*CampusCarpool &copy; 2026*

