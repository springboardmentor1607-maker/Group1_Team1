import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../SubmitComplaint.css";

/* ───────── CleanStreet Logo ───────── */
function CleanStreetLogo({ size = 42 }) {
  return (
    <div style={{ fontSize: size * 0.6 }}>🌿</div>
  );
}

/* ───────── Leaflet Map Component ───────── */
function LocationMap({ onLocationSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const L = window.L;
      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([lat, lng]).addTo(map);

        onLocationSelect({
          lat: lat.toFixed(6),
          lng: lng.toFixed(6),
        });
      });

      mapInstance.current = map;
    };

    loadLeaflet();
  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ height: 300, borderRadius: 12 }} />;
}

/* ───────── Main Component ───────── */
export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const avatar = user?.name ? getInitials(user.name) : "U";

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    address: "",
    lat: "",
    lng: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setForm((f) => ({ ...f, lat, lng }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ───────── Success Screen ───────── */
  if (submitted) {
    return (
      <div className="cs-page">
        <Navbar avatar={avatar} navigate={navigate} onLogout={handleLogout} />

        <div className="sc-success-screen">
          <div className="sc-success-card">
            <h2>✅ Report Submitted!</h2>
            <p>Your complaint has been recorded successfully.</p>
            {form.lat && (
              <p>
                📍 {form.lat}, {form.lng}
              </p>
            )}
            <button
              className="cs-btn cs-btn--primary"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───────── Main Form ───────── */
  return (
    <div className="cs-page">
      <Navbar avatar={avatar} navigate={navigate} onLogout={handleLogout} />

      <div className="sc-hero">
        <h1>Submit a Complaint</h1>
        <p>Report civic issues and help improve your community.</p>
      </div>

      <div className="sc-main-content">
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Issue Title"
            required
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue"
            required
          />

          <LocationMap onLocationSelect={handleLocationSelect} />

          {form.lat && (
            <p>
              📍 Selected: {form.lat}, {form.lng}
            </p>
          )}

          <button type="submit">Submit Report</button>
        </form>
      </div>
    </div>
  );
}

/* ───────── Shared Navbar ───────── */
function Navbar({ avatar, navigate, onLogout }) {
  return (
    <nav className="cs-navbar">
      <div className="cs-navbar__brand">
        <CleanStreetLogo />
        <span>CleanStreet</span>
      </div>

      <div className="cs-navbar__links">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span>
        <span onClick={() => navigate("/submit-complaint")}>
          Report Issue
        </span>
        <span onClick={() => navigate("/complaints")}>
          View Complaints
        </span>
      </div>

      <div className="cs-navbar__actions">
        <button onClick={onLogout}>Logout</button>
        <div onClick={() => navigate("/profile")}>{avatar}</div>
      </div>
    </nav>
  );
}