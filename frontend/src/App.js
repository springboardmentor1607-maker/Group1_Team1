import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth }      from "./pages/AuthContext";
import { NotificationProvider }       from "./pages/NotificationContext";

import Login              from "./pages/Login";
import Signup             from "./pages/Signup";
import Dashboard          from "./pages/Dashboard";
import Profile            from "./pages/Profile";
import SubmitComplaint    from "./pages/SubmitComplaint";
import VolunteerDashboard from "./pages/volunteerDashboard";
import AdminDashboard     from "./pages/AdminDashboard";
import MapPage            from "./pages/Mappage";
import ViewComplaints     from "./pages/ViewComplaints";
import NotificationsPage  from "./pages/NotificationsPage";

// ── Guards ────────────────────────────────────────────────────────────────────
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === "admin")     return <Navigate to="/admin"     replace />;
    if (user.role === "volunteer") return <Navigate to="/volunteer" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();
  const home = !user ? "/login"
    : user.role === "admin"     ? "/admin"
    : user.role === "volunteer" ? "/volunteer"
    : "/dashboard";

  return (
    <Routes>
      <Route path="/login"  element={<PublicRoute><Login  /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* citizen */}
      <Route path="/dashboard"        element={<PrivateRoute roles={["user"]}><Dashboard /></PrivateRoute>} />
      <Route path="/submit-complaint" element={<PrivateRoute roles={["user"]}><SubmitComplaint /></PrivateRoute>} />
      <Route path="/complaints"       element={<PrivateRoute roles={["user"]}><ViewComplaints /></PrivateRoute>} />

      {/* volunteer */}
      <Route path="/volunteer" element={<PrivateRoute roles={["volunteer"]}><VolunteerDashboard /></PrivateRoute>} />

      {/* admin */}
      <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />

      {/* shared */}
      <Route path="/map"           element={<PrivateRoute><MapPage /></PrivateRoute>} />
      <Route path="/profile"       element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute roles={["user","volunteer"]}><NotificationsPage /></PrivateRoute>} />

      <Route path="/"  element={<Navigate to={home} replace />} />
      <Route path="*"  element={<Navigate to={home} replace />} />
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