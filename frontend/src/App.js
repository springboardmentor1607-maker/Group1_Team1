import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/"                  element={<Navigate to="/login" replace />} />
      <Route path="/login"             element={<Login />} />
      <Route path="/signup"            element={<Signup />} />
      <Route path="/dashboard"         element={<UserDashboard />} />
      <Route path="/submit-complaint"  element={<SubmitComplaint />} />
      <Route path="/profile"           element={<Profile />} />
      <Route path="*"                  element={<Navigate to="/login" replace />} />
    </Routes>
  );
}