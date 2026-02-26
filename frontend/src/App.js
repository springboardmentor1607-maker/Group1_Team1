import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SubmitComplaint from "./pages/SubmitComplaint";
import Profile from "./pages/Profile";

function App() {
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/submit" element={<SubmitComplaint />} />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* CITIZEN ROUTE */}
        <Route
          path="/dashboard"
          element={
            role === "citizen" ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;