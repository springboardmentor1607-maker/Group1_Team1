import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Mappage from "./pages/Mappage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SubmitComplaint from "./pages/SubmitComplaint";
import VolunteerDashboard from "./pages/volunteerDashboard";

export default function App() {
  return (
    <Routes>
      {/* default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* auth */}
      <Route path="/login"  element={<Login />}  />
      <Route path="/signup" element={<Signup />} />

      {/* citizen */}
      <Route path="/dashboard"        element={<Dashboard />}        />
      <Route path="/profile"          element={<Profile />}          />
      <Route path="/submit-complaint" element={<SubmitComplaint />}  />

      {/* volunteer */}
      <Route path="/volunteer" element={<VolunteerDashboard />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/map" element={<Mappage />} />
    
    </Routes>
  );
}