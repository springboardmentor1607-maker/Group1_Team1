import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/AuthContext";
import { NotificationProvider } from "./pages/NotificationContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SubmitComplaint from "./pages/SubmitComplaint";
import VolunteerDashboard from "./pages/volunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MapPage from "./pages/Mappage";
import ViewComplaints from "./pages/ViewComplaints";
import NotificationsPage from "./pages/NotificationsPage";

// ── Guards ────────────────────────────────────────────────────────────────────

// Unauthenticated users hitting a protected route go back to the landing page.
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Authenticated users hitting /login or /signup are sent to their dashboard.
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "volunteer") return <Navigate to="/volunteer" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — always shown first, accessible to everyone */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth pages — redirect logged-in users to their dashboard */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      {/* Citizen */}
      <Route path="/dashboard" element={<PrivateRoute roles={["user"]}><Dashboard /></PrivateRoute>} />
      <Route path="/submit-complaint" element={<PrivateRoute roles={["user"]}><SubmitComplaint /></PrivateRoute>} />
      <Route path="/complaints" element={<PrivateRoute roles={["user"]}><ViewComplaints /></PrivateRoute>} />

      {/* Volunteer */}
      <Route path="/volunteer" element={<PrivateRoute roles={["volunteer"]}><VolunteerDashboard /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />

      {/* Shared private routes */}
      <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute roles={["user", "volunteer"]}><NotificationsPage /></PrivateRoute>} />

      {/* Catch-all → back to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
}