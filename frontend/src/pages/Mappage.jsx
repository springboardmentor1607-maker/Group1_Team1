import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import Navbar from "./Navbar";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGradMP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassGradMP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadGradMP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="circleClipMP"><circle cx="100" cy="100" r="86" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyGradMP)" />
      <g clipPath="url(#circleClipMP)">
        <g fill="white">
          <rect x="25" y="78" width="16" height="32" />
          <rect x="27" y="80" width="3" height="3" fill="#90caf9" /><rect x="32" y="80" width="3" height="3" fill="#90caf9" />
          <rect x="42" y="60" width="18" height="50" /><rect x="50" y="52" width="2" height="9" fill="white" />
          <rect x="44" y="64" width="4" height="4" fill="#90caf9" /><rect x="51" y="64" width="4" height="4" fill="#90caf9" />
          <rect x="62" y="50" width="20" height="60" /><rect x="71" y="42" width="2" height="10" fill="white" />
          <rect x="64" y="54" width="5" height="5" fill="#90caf9" /><rect x="72" y="54" width="5" height="5" fill="#90caf9" />
          <rect x="84" y="58" width="18" height="52" />
          <rect x="86" y="62" width="4" height="4" fill="#90caf9" /><rect x="93" y="62" width="4" height="4" fill="#90caf9" />
          <rect x="104" y="65" width="16" height="45" />
          <rect x="106" y="68" width="4" height="4" fill="#90caf9" /><rect x="112" y="68" width="4" height="4" fill="#90caf9" />
          <rect x="121" y="74" width="16" height="36" />
          <rect x="123" y="78" width="3" height="3" fill="#90caf9" /><rect x="129" y="78" width="3" height="3" fill="#90caf9" />
        </g>
        <ellipse cx="100" cy="132" rx="95" ry="44" fill="#81c784" />
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGradMP)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGradMP)" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="csArcMP" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csArcMP" startOffset="7%">CLEAN STREETS</textPath>
      </text>
    </svg>
  );
}

// ─── Issue type config ────────────────────────────────────────────────────────
const TYPE_COLORS = {
  pothole:     "#ef4444",
  garbage:     "#f59e0b",
  streetlight: "#3b82f6",
  water:       "#06b6d4",
  road:        "#8b5cf6",
  noise:       "#ec4899",
  other:       "#6b7280",
};

const TYPE_LABELS = {
  pothole:     "🕳️ Potholes",
  garbage:     "🗑️ Garbage",
  streetlight: "💡 Street Lights",
  water:       "💧 Water Leaks",
  road:        "🚧 Road Damage",
  noise:       "🔊 Noise",
  other:       "📌 Other",
};

const STATUS_COLORS = {
  resolved:  "#22c55e",
  in_review: "#f59e0b",
  received:  "#3b82f6",
  pending:   "#3b82f6",
  assigned:  "#8b5cf6",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MapPage() {
  const navigate  = useNavigate();
  const { user, logout, getInitials } = useAuth();
  const mapRef    = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);

  const [complaints, setComplaints] = useState([]);
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(TYPE_LABELS).reduce((acc, k) => ({ ...acc, [k]: true }), {})
  );
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const token  = localStorage.getItem("token");
  const avatar = user?.name ? getInitials(user.name) : "U";
  const role   = user?.role || "citizen";

  const mapDescription = {
    citizen:   "Complaints you've reported in your community.",
    volunteer: "Complaints assigned to you in your area.",
    admin:     "All reported civic issues across the platform.",
  };

  // ── Fetch complaints ────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchComplaints() {
      try {
        let url = "http://localhost:5000/api/complaints";
        if (role === "citizen")   url = "http://localhost:5000/api/complaints?mine=true";
        if (role === "volunteer") url = "http://localhost:5000/api/complaints/assigned-to-me";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setComplaints(Array.isArray(data) ? data : data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    }
    fetchComplaints();
  }, [role]);

  // ── Init Leaflet map ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById("leaflet-css-mp")) {
      const link = document.createElement("link");
      link.id = "leaflet-css-mp";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (mapInstance.current || !mapRef.current) return;
      const L = window.L;
      if (!L) return;

      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;
    };

    if (window.L) initMap();
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // ── Draw markers when complaints or filters change ──────────────────────────
  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    const L = window.L;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    complaints.forEach(c => {
      const lat = c.latitude  || c.location?.lat;
      const lng = c.longitude || c.location?.lng;
      if (!lat || !lng) return;

      const type   = c.type || c.issueType || "other";
      const color  = TYPE_COLORS[type] || TYPE_COLORS.other;
      const sColor = STATUS_COLORS[c.status] || STATUS_COLORS.received;

      if (!activeFilters[type]) return;

      const icon = L.divIcon({
        html: `<div style="
          background: ${color};
          width: 24px; height: 24px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        className: "",
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="min-width: 180px; font-family: inherit;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${c.title}</div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">${c.address || ""}</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span style="background:${color}20; color:${color}; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: capitalize;">${type}</span>
              <span style="background:${sColor}20; color:${sColor}; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: capitalize;">${c.status || "pending"}</span>
            </div>
          </div>
        `);

      markersRef.current.push(marker);
    });
  }, [complaints, activeFilters]);

  const toggleFilter = (type) => {
    setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  // Complaints with valid coordinates for the list
  const mappedComplaints = complaints.filter(c =>
    (c.latitude || c.location?.lat) && (c.longitude || c.location?.lng)
  );

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="cs-page">

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
        padding: "28px 32px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
            🗺️ Interactive Map
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Issue Map</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            {mapDescription[role]} {mappedComplaints.length} issues pinned.
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

        {/* Map */}
        <div className="cs-card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            ref={mapRef}
            style={{ height: 520, width: "100%", zIndex: 0 }}
          />
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Filters */}
          <div className="cs-sidebar-card">
            <div className="cs-sidebar-card__title">🔽 Filter by Type</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {Object.entries(TYPE_LABELS).map(([type, label]) => {
                const count = complaints.filter(c => (c.type || c.issueType || "other") === type).length;
                return (
                  <label key={type} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer", padding: "6px 8px", borderRadius: 8,
                    background: activeFilters[type] ? TYPE_COLORS[type] + "12" : "transparent",
                    transition: "background 0.15s",
                  }}>
                    <input
                      type="checkbox"
                      checked={activeFilters[type]}
                      onChange={() => toggleFilter(type)}
                      style={{ accentColor: TYPE_COLORS[type], width: 14, height: 14 }}
                    />
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: TYPE_COLORS[type], flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{label}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{count}</span>
                  </label>
                );
              })}
            </div>
            <button
              className="cs-btn cs-btn--outline cs-btn--sm"
              style={{ marginTop: 12, width: "100%", fontSize: 12 }}
              onClick={() => setActiveFilters(
                Object.keys(TYPE_LABELS).reduce((acc, k) => ({ ...acc, [k]: true }), {})
              )}
            >Show All</button>
          </div>

          {/* Legend */}
          <div className="cs-sidebar-card">
            <div className="cs-sidebar-card__title">📍 Status Legend</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {[
                { label: "Pending / Received", color: STATUS_COLORS.received },
                { label: "In Review",          color: STATUS_COLORS.in_review },
                { label: "Assigned",           color: STATUS_COLORS.assigned  },
                { label: "Resolved",           color: STATUS_COLORS.resolved  },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="cs-health-card">
            <div className="cs-health-card__label">📊 Map Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              {[
                { label: "Total",    value: complaints.length,                                                        color: "#3b82f6" },
                { label: "Mapped",   value: mappedComplaints.length,                                                  color: "#8b5cf6" },
                { label: "Pending",  value: complaints.filter(c => c.status === "received" || c.status === "pending").length, color: "#f59e0b" },
                { label: "Resolved", value: complaints.filter(c => c.status === "resolved").length,                  color: "#22c55e" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 6px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}