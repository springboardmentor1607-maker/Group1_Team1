import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import Navbar from "./Navbar";
import API from "../api";

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

// ─── Config ───────────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  pothole:     "#ef4444",
  garbage:     "#f59e0b",
  streetlight: "#3b82f6",
  water:       "#06b6d4",
  road:        "#8b5cf6",
  noise:       "#ec4899",
  other:       "#6b7280",
};
const TYPE_EMOJIS = {
  pothole:     "🕳️",
  garbage:     "🗑️",
  streetlight: "💡",
  water:       "💧",
  road:        "🚧",
  noise:       "🔊",
  other:       "📌",
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
  completed: "#22c55e",
  in_review: "#f59e0b",
  received:  "#3b82f6",
  pending:   "#3b82f6",
  assigned:  "#8b5cf6",
  denied:    "#ef4444",
};
const STATUS_LABELS = {
  received:  "Received",
  in_review: "In Review",
  assigned:  "Assigned",
  resolved:  "Resolved",
  completed: "Completed",
  pending:   "Pending",
  denied:    "Denied",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCoords(c) {
  const coords = c.location_coords?.coordinates;
  const lat = coords?.[1] ?? c.latitude  ?? c.location?.lat;
  const lng = coords?.[0] ?? c.longitude ?? c.location?.lng;
  return (lat != null && lng != null) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "Just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  === 1) return "Yesterday";
  return `${days}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MapPage() {
  const navigate    = useNavigate();
  const { user, logout } = useAuth();
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const clusterRef  = useRef(null);

  const [complaints,    setComplaints]    = useState([]);
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(TYPE_LABELS).reduce((acc, k) => ({ ...acc, [k]: true }), {})
  );
  // mapReady drives the marker-draw effect so it waits for Leaflet + cluster to be loaded
  const [mapReady, setMapReady] = useState(false);

  const role = user?.role || "user";

  const mapDescription = {
    user:      "Complaints you've reported in your community.",
    volunteer: "Complaints assigned to you in your area.",
    admin:     "All reported civic issues across the platform.",
  };

  // ── 1. Fetch complaints ─────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        let endpoint = "/api/complaints";
        if (role === "user")      endpoint = "/api/complaints/my";
        if (role === "volunteer") endpoint = "/api/complaints/my-assignments";
        const { data } = await API.get(endpoint);
        setComplaints(Array.isArray(data) ? data : data.complaints || []);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    }
    load();
  }, [role]);

  // ── 2. Load scripts/CSS then init map ───────────────────────────────────────
  useEffect(() => {
    function injectCss(id, href) {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet"; link.href = href;
      document.head.appendChild(link);
    }
    injectCss("leaflet-css-mp",              "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    injectCss("markercluster-css-mp",        "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css");
    injectCss("markercluster-default-css-mp","https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css");

    function initMap() {
      if (mapInstance.current || !mapRef.current || !window.L) return;
      const L   = window.L;
      const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;

      // Styled cluster group
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 55,
        showCoverageOnHover: false,
        iconCreateFunction(c) {
          const n    = c.getChildCount();
          const size = n < 5 ? 36 : n < 15 ? 44 : 52;
          return L.divIcon({
            html: `<div style="
              width:${size}px;height:${size}px;
              background:linear-gradient(135deg,#1d4ed8,#2563eb);
              border-radius:50%;border:3px solid white;
              box-shadow:0 3px 14px rgba(37,99,235,0.5);
              display:flex;align-items:center;justify-content:center;
              color:white;font-size:${n<10?14:12}px;font-weight:800;
              font-family:system-ui,sans-serif;letter-spacing:-0.5px;
            ">${n}</div>`,
            iconSize:   [size, size],
            iconAnchor: [size / 2, size / 2],
            className:  "",
          });
        },
      });
      map.addLayer(cluster);
      clusterRef.current = cluster;
      setMapReady(true); // ← triggers marker draw
    }

    function loadCluster() {
      if (window.L?.MarkerClusterGroup) { initMap(); return; }
      if (document.getElementById("markercluster-js-mp")) return;
      const s = document.createElement("script");
      s.id  = "markercluster-js-mp";
      s.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
      s.onload = initMap;
      document.head.appendChild(s);
    }

    if (window.L) {
      loadCluster();
    } else {
      if (!document.getElementById("leaflet-js-mp")) {
        const s = document.createElement("script");
        s.id  = "leaflet-js-mp";
        s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        s.onload = loadCluster;
        document.head.appendChild(s);
      }
    }

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
      clusterRef.current = null;
    };
  }, []);

  // ── 3. Draw markers (runs when map is ready OR data/filters change) ──────────
  useEffect(() => {
    if (!mapReady || !mapInstance.current || !clusterRef.current || !window.L) return;
    const L       = window.L;
    const cluster = clusterRef.current;

    cluster.clearLayers();

    const visibleMarkers = [];

    complaints.forEach(c => {
      const pos = getCoords(c);
      if (!pos) return;

      const type   = (c.type || c.issueType || "other").toLowerCase().trim();
      const color  = TYPE_COLORS[type]  || TYPE_COLORS.other;
      const emoji  = TYPE_EMOJIS[type]  || "📌";
      const sColor = STATUS_COLORS[c.status] || STATUS_COLORS.received;
      const sLabel = STATUS_LABELS[c.status] || c.status || "Pending";

      if (activeFilters[type] === false) return;

      // ── Pin icon ────────────────────────────────────────────────────────────
      const icon = L.divIcon({
        html: `
          <div style="position:relative;width:38px;height:50px;filter:drop-shadow(0 4px 8px ${color}55);">
            <div style="
              position:absolute;top:0;left:0;width:38px;height:38px;
              background:${color};
              border-radius:50% 50% 50% 0;transform:rotate(-45deg);
              border:3px solid white;
              box-shadow:inset 0 -2px 4px rgba(0,0,0,0.15);
            "></div>
            <div style="
              position:absolute;top:4px;left:0;width:38px;height:30px;
              display:flex;align-items:center;justify-content:center;
              font-size:15px;line-height:1;
            ">${emoji}</div>
            <div style="
              position:absolute;top:0;right:0;
              width:13px;height:13px;border-radius:50%;
              background:${sColor};border:2.5px solid white;
              box-shadow:0 1px 4px rgba(0,0,0,0.25);
            "></div>
            <div style="
              position:absolute;bottom:2px;left:50%;
              transform:translateX(-50%);
              width:8px;height:5px;
              background:rgba(0,0,0,0.15);
              border-radius:50%;filter:blur(2px);
            "></div>
          </div>`,
        iconSize:    [38, 50],
        iconAnchor:  [19, 50],
        popupAnchor: [0, -46],
        className:   "",
      });

      // ── Popup ───────────────────────────────────────────────────────────────
      const photoHtml = c.photo
        ? `<img src="http://localhost:5001${c.photo}" alt=""
            style="width:100%;height:115px;object-fit:cover;border-radius:8px;margin-bottom:10px;display:block;"
            onerror="this.style.display='none'" />`
        : "";

      const desc = c.description
        ? `<div style="color:#374151;font-size:12px;margin-bottom:10px;
              padding:8px 10px;background:#f9fafb;border-radius:6px;
              border-left:3px solid ${color};max-height:56px;overflow:hidden;">
              ${c.description.slice(0, 110)}${c.description.length > 110 ? "…" : ""}
           </div>`
        : "";

      const reporterName = c.user_id?.name || "Anonymous";

      const popup = `
        <div style="min-width:220px;max-width:255px;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1.5;">
          ${photoHtml}
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
            <span style="background:${color}20;color:${color};padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;border:1px solid ${color}35;">
              ${emoji} ${type}
            </span>
            <span style="background:${sColor}20;color:${sColor};padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;border:1px solid ${sColor}35;">
              ● ${sLabel}
            </span>
          </div>
          <div style="font-weight:700;font-size:14px;color:#111827;margin-bottom:4px;line-height:1.3;">
            ${c.title || "Untitled"}
          </div>
          <div style="color:#6b7280;font-size:12px;margin-bottom:8px;display:flex;align-items:flex-start;gap:4px;">
            <span>📍</span><span>${c.address || "Location not specified"}</span>
          </div>
          ${desc}
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #f3f4f6;">
            <div style="display:flex;gap:10px;">
              <span style="color:#6b7280;font-size:11px;">👍 ${c.upvotes || 0}</span>
              <span style="color:#6b7280;font-size:11px;">👎 ${c.downvotes || 0}</span>
              <span style="color:#6b7280;font-size:11px;">💬 ${c.comments || 0}</span>
            </div>
            <span style="color:#9ca3af;font-size:11px;">${timeAgo(c.created_at)}</span>
          </div>
          <div style="color:#9ca3af;font-size:11px;margin-top:5px;">
            By <strong style="color:#6b7280;">${reporterName}</strong>
          </div>
        </div>`;

      const marker = L.marker([pos.lat, pos.lng], { icon })
        .bindPopup(popup, { maxWidth: 265, className: "cs-map-popup" });

      cluster.addLayer(marker);
      visibleMarkers.push(marker);
    });

    // Auto-fit to show all visible markers
    if (visibleMarkers.length > 0 && cluster.getBounds().isValid()) {
      mapInstance.current.fitBounds(cluster.getBounds(), { padding: [50, 50], maxZoom: 14 });
    }

  }, [complaints, activeFilters, mapReady]);

  const toggleFilter = type =>
    setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));

  const mappedComplaints = complaints.filter(c => getCoords(c) !== null);

  return (
    <div className="cs-page">

      {/* Popup style override */}
      <style>{`
        .cs-map-popup .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.18) !important;
          padding: 0 !important; overflow: hidden;
        }
        .cs-map-popup .leaflet-popup-content { margin: 14px !important; }
        .cs-map-popup .leaflet-popup-tip-container { margin-top: -1px; }
      `}</style>

      <Navbar />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#2563eb 100%)", padding: "28px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
            🗺️ Interactive Map
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Issue Map</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            {mapDescription[role]} {mappedComplaints.length} issue{mappedComplaints.length !== 1 ? "s" : ""} pinned.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

        {/* Map */}
        <div className="cs-card" style={{ padding: 0, overflow: "hidden", borderRadius: 14 }}>
          <div ref={mapRef} style={{ height: 560, width: "100%", zIndex: 0 }} />
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Filters */}
          <div className="cs-sidebar-card">
            <div className="cs-sidebar-card__title">🔽 Filter by Type</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              {Object.entries(TYPE_LABELS).map(([type, label]) => {
                const count  = complaints.filter(c => (c.type || c.issueType || "other").toLowerCase() === type).length;
                const active = activeFilters[type];
                return (
                  <label key={type} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer", padding: "7px 10px", borderRadius: 8,
                    background: active ? TYPE_COLORS[type] + "15" : "transparent",
                    border: `1px solid ${active ? TYPE_COLORS[type] + "30" : "transparent"}`,
                    transition: "all 0.15s",
                  }}>
                    <input type="checkbox" checked={active} onChange={() => toggleFilter(type)}
                      style={{ accentColor: TYPE_COLORS[type], width: 14, height: 14, flexShrink: 0 }} />
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: active ? TYPE_COLORS[type] : "#d1d5db",
                      flexShrink: 0, transition: "background 0.15s",
                    }} />
                    <span style={{ fontSize: 13, color: active ? "#1f2937" : "#9ca3af", flex: 1, transition: "color 0.15s" }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, minWidth: 20, textAlign: "center",
                      color: "white", background: active ? TYPE_COLORS[type] : "#d1d5db",
                      borderRadius: 9999, padding: "1px 6px", transition: "all 0.15s",
                    }}>{count}</span>
                  </label>
                );
              })}
            </div>
            <button
              className="cs-btn cs-btn--outline cs-btn--sm"
              style={{ marginTop: 12, width: "100%", fontSize: 12 }}
              onClick={() => setActiveFilters(Object.keys(TYPE_LABELS).reduce((a, k) => ({ ...a, [k]: true }), {}))}
            >Show All</button>
          </div>

          {/* Legend */}
          <div className="cs-sidebar-card">
            <div className="cs-sidebar-card__title">📍 Status Legend</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {[
                { label: "Pending / Received", color: STATUS_COLORS.received  },
                { label: "In Review",          color: STATUS_COLORS.in_review },
                { label: "Assigned",           color: STATUS_COLORS.assigned  },
                { label: "Resolved",           color: STATUS_COLORS.resolved  },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: color, flexShrink: 0,
                    boxShadow: `0 0 0 3px ${color}25`,
                  }} />
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f3f4f6", fontSize: 11, color: "#9ca3af" }}>
              💡 <em>Blue clusters group nearby pins — click to zoom in.</em>
            </div>
          </div>

          {/* Stats */}
          <div className="cs-health-card">
            <div className="cs-health-card__label">📊 Map Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              {[
                { label: "Total",    value: complaints.length,          color: "#93c5fd" },
                { label: "Mapped",   value: mappedComplaints.length,    color: "#c4b5fd" },
                { label: "Pending",  value: complaints.filter(c => ["received","pending"].includes(c.status)).length, color: "#fcd34d" },
                { label: "Resolved", value: complaints.filter(c => ["resolved","completed"].includes(c.status)).length, color: "#6ee7b7" },
              ].map(s => (
                <div key={s.label} style={{
                  textAlign: "center", background: "rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "12px 6px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}