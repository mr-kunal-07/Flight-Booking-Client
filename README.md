# Flight Booking Frontend

A modern, responsive React application for searching and booking flights with TypeScript and Redux Toolkit.

## FRONTEND WEBSITE IS LIVE 🔴 [Deploy on Vercel]
- https://flightbooking2.vercel.app/home
  
## BACKEND API IS LIVE 🔴 [Deploy on Render]
- https://flight-booking-api-pv1j.onrender.com


---

## ✨ Features

- ✅ User authentication (Login/Register)
- ✅ JWT token management
- ✅ Flight search with filters
- ✅ Responsive flight cards UI
- ✅ Flight details view
- ✅ Multi-passenger booking form
- ✅ Booking confirmation
- ✅ Booking history
- ✅ Protected routes
- ✅ Loading states & error handling
- ✅ Form validation
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern UI with Tailwind CSS

---

## 🛠 Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Featch
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Date Handling:** date-fns

---

## ✅ Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running on `http://localhost:3000`

---

## 🚀 Installation

### Step 1: Clone Code From Git
```bash
git clone git@github.com:mr-kunal-07/Flight-Booking-Client.git
```

### Step 2: Install Dependencies
```bash
npm install
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file:
```env
VITE_API_URL = http://localhost:3000
```

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Application: `http://localhost:5173`
---


## 🔐 Authentication Flow

1. User submits login/register form
2. API call to backend
3. Receive JWT token
4. Store token in localStorage
5. Set Authorization header for future requests
6. Redirect to /home page
7. Protected routes check for token
8. On logout, clear token and redirect to login

---


## For Backend Setup
# Flight Booking Backend API

## ✨ Features

- ✅ JWT-based authentication and authorization
- ✅ User registration and login
- ✅ Flight search with multiple filters
- ✅ Flight booking with passenger management
- ✅ Booking history tracking
- ✅ Secure password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Error handling middleware
- ✅ Database transactions for booking integrity
- ✅ PostgreSQL with Sequelize ORM

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon Cloud)
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Security:** helmet, cors
- **Logging:** morgan

---

## ✅ Prerequisites

- Node.js v18 or higher
- npm or yarn
- Neon PostgreSQL account ([Sign up](https://console.neon.tech/))

---

## 🚀 Installation

### Step 1: Clone Code from Git
```bash
git clone git@github.com:mr-kunal-07/Flight-Booking-api.git
```

### Step 2: Install Dependencies
```bash
npm install
```

---


### Environment Variables

Create `.env` file:
```env
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:5173

FORCE_SYNC=false
```


## 📚 API Documentation


## 🔐 Authentication Endpoints

### 1. Register User
```http
POST /api/auth/register

```

---

### 2. Login User
```http
POST /api/auth/login

```

---


## ✈️ Flight Endpoints

### 4. Search Flights
```http
POST /api/flights/search

```

---

### 5. Get All Flights (Paginated)
```http
GET /api/flights?page=1&limit=10

```

---

### 6. Get Flight by ID
```http
GET /api/flights/:id

```

---

## 🎫 Booking Endpoints (Protected)

### 7. Create Booking
```http
POST /api/bookings/create
```

---

### 8. Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Bearer <token>
```

---

### 9. Get User Booking History
```http
GET /api/bookings/user/history
```

---
