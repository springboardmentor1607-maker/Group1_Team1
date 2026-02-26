

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../SubmitComplaint.css';

// ─── CleanStreet Logo ─────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGradSC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" />
          <stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassGradSC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadGradSC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" />
          <stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="circleClipSC">
          <circle cx="100" cy="100" r="86" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyGradSC)" />
      <g clipPath="url(#circleClipSC)">
        <g fill="white">
          <rect x="25" y="78" width="16" height="32" />
          <rect x="27" y="80" width="3" height="3" fill="#90caf9" /><rect x="32" y="80" width="3" height="3" fill="#90caf9" />
          <rect x="42" y="60" width="18" height="50" /><rect x="50" y="52" width="2" height="9" fill="white" />
          <rect x="44" y="64" width="4" height="4" fill="#90caf9" /><rect x="51" y="64" width="4" height="4" fill="#90caf9" />
          <rect x="44" y="72" width="4" height="4" fill="#90caf9" /><rect x="51" y="72" width="4" height="4" fill="#90caf9" />
          <rect x="62" y="50" width="20" height="60" /><rect x="71" y="42" width="2" height="10" fill="white" />
          <rect x="64" y="54" width="5" height="5" fill="#90caf9" /><rect x="72" y="54" width="5" height="5" fill="#90caf9" />
          <rect x="64" y="63" width="5" height="5" fill="#90caf9" /><rect x="72" y="63" width="5" height="5" fill="#90caf9" />
          <rect x="64" y="72" width="5" height="5" fill="#90caf9" /><rect x="72" y="72" width="5" height="5" fill="#90caf9" />
          <rect x="84" y="58" width="18" height="52" />
          <rect x="86" y="62" width="4" height="4" fill="#90caf9" /><rect x="93" y="62" width="4" height="4" fill="#90caf9" />
          <rect x="86" y="70" width="4" height="4" fill="#90caf9" /><rect x="93" y="70" width="4" height="4" fill="#90caf9" />
          <rect x="104" y="65" width="16" height="45" />
          <rect x="106" y="68" width="4" height="4" fill="#90caf9" /><rect x="112" y="68" width="4" height="4" fill="#90caf9" />
          <rect x="121" y="74" width="16" height="36" />
          <rect x="123" y="78" width="3" height="3" fill="#90caf9" /><rect x="129" y="78" width="3" height="3" fill="#90caf9" />
        </g>
        <ellipse cx="100" cy="132" rx="95" ry="44" fill="#81c784" />
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGradSC)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGradSC)" />
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="csTextArcSC" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="'Arial Rounded MT Bold', Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csTextArcSC" startOffset="7%">CLEAN STREETS</textPath>
      </text>
      <g transform="translate(12,106) rotate(-15)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)" />
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)" />
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)" />
      </g>
      <g transform="translate(188,106) rotate(15) scale(-1,1)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)" />
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)" />
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)" />
      </g>
    </svg>
  );
}

// ─── Leaflet Map Component ────────────────────────────────────────────────────
function LocationMap({ onLocationSelect, selectedCoords }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const L = window.L;
      if (!L) return;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const greenIcon = L.divIcon({
        html: `<div style="
          background: #4caf50;
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: '',
      });

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        placeMarker(L, map, greenIcon, lat, lng);
        const address = await reverseGeocode(lat, lng);
        onLocationSelect({ lat, lng, address });
      });

      mapInstanceRef.current = map;
      mapInstanceRef.current._greenIcon = greenIcon;
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedCoords || !mapInstanceRef.current) return;
    const { lat, lng } = selectedCoords;
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!L) return;
    map.flyTo([lat, lng], 16, { duration: 1.5 });
    placeMarker(L, map, map._greenIcon, lat, lng);
  }, [selectedCoords]);

  const placeMarker = (L, map, icon, lat, lng) => {
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<b>📍 Issue Location</b><br/>${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      .openPopup();
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocating(false);
        const address = await reverseGeocode(lat, lng);
        onLocationSelect({ lat, lng, address });
        if (mapInstanceRef.current && window.L) {
          const L = window.L;
          mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.5 });
          placeMarker(L, mapInstanceRef.current, mapInstanceRef.current._greenIcon, lat, lng);
        }
      },
      (err) => {
        setLocating(false);
        setLocError('Could not get your location. Please click on the map instead.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={locating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            background: locating ? '#a5d6a7' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: locating ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {locating ? (
            <>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Locating…
            </>
          ) : (
            <>📡 Use My Location</>
          )}
        </button>
        <span style={{ fontSize: 12, color: '#888' }}>or click the map to pin</span>
      </div>

      {locError && (
        <div style={{ fontSize: 12, color: '#e53935', marginBottom: 8 }}>⚠ {locError}</div>
      )}

      <div
        ref={mapRef}
        style={{
          height: 300,
          width: '100%',
          borderRadius: 12,
          border: '2px solid #e8f5e9',
          overflow: 'hidden',
          zIndex: 0,
        }}
      />

      <p style={{ fontSize: 12, color: '#888', marginTop: 8, marginBottom: 0 }}>
        📍 Click the map or use "My Location" to mark the exact issue spot. The address will auto-fill.
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const displayName = user?.name || 'User';
  const avatar = user?.name ? getInitials(user.name) : 'U';

  const [submitted, setSubmitted] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const [form, setForm] = useState({
    title: '',
    type: '',
    priority: '',
    address: '',
    landmark: '',
    description: '',
    photo: null,
    photoPreview: null,
    lat: '',
    lng: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photo: file, photoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const removePhoto = () => setForm(f => ({ ...f, photo: null, photoPreview: null }));

  const handleLocationSelect = ({ lat, lng, address }) => {
    setSelectedCoords({ lat, lng });
    setForm(f => ({
      ...f,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      address: address || f.address,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token"); // adjust if different

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("latitude", form.lat);
    formData.append("longitude", form.lng);
    formData.append("address", form.address);

    if (form.photo) {
      formData.append("photo", form.photo);
    }

    const res = await fetch("http://localhost:5000/api/complaints", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to submit");
    }

    console.log("SUCCESS:", data);
    setSubmitted(true);

  } catch (err) {
    console.error("Submit error:", err);
    alert("Failed to submit complaint");
  }
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Report Issue', path: '/submit-complaint' },
    { label: 'View Complaints', path: '/complaints' },
  ];

  // ── Navbar (shared) ─────────────────────────────────────────────────────────
  const Navbar = ({ activePage }) => (
    <nav className="cs-navbar">
      <div className="cs-navbar__brand">
        <CleanStreetLogo size={42} />
        <span className="cs-navbar__name">CleanStreet</span>
      </div>
      <div className="cs-navbar__links">
        {navLinks.map(item => (
          <span
            key={item.label}
            className={`cs-navbar__link ${item.label === activePage ? 'cs-navbar__link--active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
          >
            {item.label}
          </span>
        ))}
      </div>
      <div className="cs-navbar__actions">
        <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={handleLogout} style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}>
          Logout
        </button>
        <div className="cs-avatar" onClick={() => navigate('/profile')} title="My Profile" style={{ cursor: 'pointer' }}>
          {avatar}
        </div>
      </div>
    </nav>
  );

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="cs-page">
        <Navbar activePage="" />

        <div className="sc-success-screen">
          <div className="sc-success-card">
            <div className="sc-success-icon">✅</div>
            <h2>Report Submitted!</h2>
            <p>Your complaint has been received and will be reviewed by local authorities shortly.</p>
            <p className="sc-success-sub">You'll be notified of any updates via your dashboard.</p>
            {form.lat && form.lng && (
              <p style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
                📍 Pinned at {form.lat}, {form.lng}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
              <button className="cs-btn cs-btn--primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              <button className="cs-btn cs-btn--secondary" onClick={() => {
                setSubmitted(false);
                setSelectedCoords(null);
                setForm({ title: '', type: '', priority: '', address: '', landmark: '', description: '', photo: null, photoPreview: null, lat: '', lng: '' });
              }}>
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ───────────────────────────────────────────────────────────────
  return (
    <div className="cs-page">

      <Navbar activePage="Report Issue" />

      {/* Hero */}
      <div className="sc-hero">
        <div className="sc-hero__content">
          <div className="sc-hero__eyebrow">📋 Report a Civic Issue</div>
          <h1 className="sc-hero__title">Submit a Complaint</h1>
          <p className="sc-hero__subtitle">
            Help improve your community by reporting civic issues. Fill in the details below and we'll get it to the right authorities.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="sc-main-content">
        <form onSubmit={handleSubmit}>
          <div className="sc-form-grid">

            {/* ── Left: Form Fields ── */}
            <div className="sc-form-col">

              {/* Issue Details */}
              <div className="cs-sidebar-card sc-section">
                <div className="cs-sidebar-card__title">📝 Issue Details</div>

                <div className="sc-row">
                  <div className="cs-form-group">
                    <label className="cs-label">Issue Title <span className="sc-required">*</span></label>
                    <input
                      className="cs-input"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>
                  <div className="cs-form-group">
                    <label className="cs-label">Issue Type <span className="sc-required">*</span></label>
                    <div className="sc-select-wrap">
                      <select className="cs-input cs-select" name="type" value={form.type} onChange={handleChange} required>
                        <option value="">Select issue type</option>
                        <option value="pothole">🕳️ Pothole</option>
                        <option value="streetlight">💡 Streetlight</option>
                        <option value="garbage">🗑️ Garbage / Dump</option>
                        <option value="water">💧 Water Leak</option>
                        <option value="road">🚧 Road Damage</option>
                        <option value="noise">🔊 Noise Complaint</option>
                        <option value="other">📌 Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sc-row">
                  <div className="cs-form-group">
                    <label className="cs-label">Priority Level <span className="sc-required">*</span></label>
                    <div className="sc-select-wrap">
                      <select className="cs-input cs-select" name="priority" value={form.priority} onChange={handleChange} required>
                        <option value="">Select priority</option>
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                        <option value="critical">🚨 Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="cs-form-group">
                    <label className="cs-label">
                      Address <span className="sc-required">*</span>
                      {form.lat && <span style={{ fontSize: 11, color: '#4caf50', marginLeft: 6 }}>📍 Auto-filled from map</span>}
                    </label>
                    <input
                      className="cs-input"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Pin on map or type address"
                      required
                    />
                  </div>
                </div>

                <input type="hidden" name="lat" value={form.lat} />
                <input type="hidden" name="lng" value={form.lng} />

                {form.lat && form.lng && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#e8f5e9',
                    border: '1px solid #a5d6a7',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontSize: 12,
                    color: '#2e7d32',
                    marginBottom: 12,
                  }}>
                    📍 {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, lat: '', lng: '' }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13, padding: 0, lineHeight: 1 }}
                    >✕</button>
                  </div>
                )}

                <div className="cs-form-group">
                  <label className="cs-label">Nearby Landmark <span className="sc-optional">(Optional)</span></label>
                  <input
                    className="cs-input"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="e.g., Near City Hall"
                  />
                </div>

<<<<<<< HEAD
                {/* Description Field */}
                <div className="cs-form-group">
                  <label className="cs-label">Description <span className="sc-required">*</span></label>
                  <textarea
                    className="cs-input"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
=======
                <div className="cs-form-group" style={{ marginBottom: 0 }}>
                  <label className="cs-label">Description <span className="sc-required">*</span></label>
                  <textarea
                    className="cs-input cs-textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
>>>>>>> Anusha
                    placeholder="Describe the issue in detail..."
                    required
                  />
                </div>
<<<<<<< HEAD

                {/* Photo Upload */}
                <div className="cs-form-group">
                  <label className="cs-label">Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="cs-input"
                  />
                  {form.photoPreview && (
                    <div style={{ marginTop: 12 }}>
                      <img src={form.photoPreview} alt="Preview" style={{ 
                        maxWidth: '100%', 
                        maxHeight: 200, 
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} />
                      <button
                        type="button"
                        onClick={removePhoto}
                        style={{
                          marginTop: 8,
                          padding: '4px 12px',
                          background: '#ef5350',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

=======
              </div>

              {/* Photo Upload */}
              <div className="cs-sidebar-card sc-section">
                <div className="cs-sidebar-card__title">📷 Photo Evidence <span className="sc-optional">(Optional)</span></div>
                {!form.photoPreview ? (
                  <label className="sc-dropzone">
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                    <div className="sc-dropzone-inner">
                      <span className="sc-dropzone-icon">📁</span>
                      <p className="sc-dropzone-text"><strong>Click to upload</strong> or drag and drop</p>
                      <p className="sc-dropzone-hint">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </label>
                ) : (
                  <div className="sc-photo-preview">
                    <img src={form.photoPreview} alt="Preview" className="sc-photo-img" />
                    <button type="button" className="sc-photo-remove" onClick={removePhoto}>✕ Remove Photo</button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="cs-btn cs-btn--secondary" onClick={() => navigate('/dashboard')}>
                  Cancel
                </button>
                <button type="submit" className="cs-btn cs-btn--primary">
                  ➤ Submit Report
                </button>
              </div>
>>>>>>> Anusha
            </div>

            {/* ── Right: Map + Info ── */}
            <div className="sc-side-col">

              {/* Map Card */}
              <div className="cs-sidebar-card sc-section">
                <div className="cs-sidebar-card__title">📍 Pin Location on Map</div>
                <LocationMap
                  onLocationSelect={handleLocationSelect}
                  selectedCoords={selectedCoords}
                />
              </div>

              {/* Tips */}
              <div className="cs-health-card sc-tips-card">
                <div className="cs-health-card__label">💡 Tips for a Good Report</div>
                <div className="sc-tips-list">
                  <div className="sc-tip">✓ Pin the exact location on the map</div>
                  <div className="sc-tip">✓ Add a clear photo if possible</div>
                  <div className="sc-tip">✓ Describe the issue thoroughly</div>
                  <div className="sc-tip">✓ Set the correct priority level</div>
                </div>
              </div>

              {/* What happens next */}
              <div className="cs-sidebar-card sc-section">
                <div className="cs-sidebar-card__title">🔄 What Happens Next?</div>
                <div className="sc-steps">
                  <div className="sc-step">
                    <div className="sc-step__num" style={{ background: '#dbeafe', color: '#1d4ed8' }}>1</div>
                    <div className="sc-step__text">Your report is received and logged</div>
                  </div>
                  <div className="sc-step">
                    <div className="sc-step__num" style={{ background: '#fef9c3', color: '#92400e' }}>2</div>
                    <div className="sc-step__text">Authorities review and assign the issue</div>
                  </div>
                  <div className="sc-step">
                    <div className="sc-step__num" style={{ background: '#dcfce7', color: '#166534' }}>3</div>
                    <div className="sc-step__text">Issue is resolved and you're notified</div>
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              {/* Submit Button */}
              <div className="cs-sidebar-card sc-section" style={{ textAlign: 'center', paddingTop: 20 }}>
                <button 
                  type="submit" 
                  className="cs-btn cs-btn--primary" 
                  style={{ 
                    width: '100%',
                    padding: '12px 24px',
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  🚀 Submit Complaint
                </button>
              </div>

=======
>>>>>>> Anusha
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
