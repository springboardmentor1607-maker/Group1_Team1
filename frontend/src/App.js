import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* App pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/submit-complaint" element={<SubmitComplaint />} />
    </Routes>
  );
}