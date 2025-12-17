import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Register from "./pages/Register";
import FlightDetailsPage from "./pages/FlightDetailsPage";
import BookingHistory from "./pages/BookingHistory";
import BookingConfirmation from "./pages/BookingConfirmation";

const App = () => {
  return (
    <Routes>
      {/* Public routes - redirect to /search if logged in */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/flight/:id"
        element={
          <ProtectedRoute>
            <FlightDetailsPage />
          </ProtectedRoute>}
      />



      {/* Protected routes - redirect to /login if not logged in */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />


      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
