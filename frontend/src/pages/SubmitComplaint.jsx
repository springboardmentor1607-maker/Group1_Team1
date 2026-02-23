import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../SubmitComplaint.css';

// ─── CleanStreet Logo (same as Dashboard) ────────────────────────────────────
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
        <path d="M132,44 Q134,41 136,44" stroke="#37474f" strokeWidth="1.2" fill="none" />
        <path d="M142,37 Q144,34 146,37" stroke="#37474f" strokeWidth="1.2" fill="none" />
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { user, getInitials } = useAuth();

  const displayName = user?.name || 'User';
  const avatar = user?.name ? getInitials(user.name) : 'U';

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: '',
    priority: '',
    address: '',
    landmark: '',
    description: '',
    photo: null,
    photoPreview: null,
  });

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);

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

  // Initialize Leaflet map
  useEffect(() => {
    if (leafletMap.current) return;
    const L = window.L;
    if (!L || !mapRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng]).addTo(map)
        .bindPopup('📍 Issue location').openPopup();
    });

    leafletMap.current = map;
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="cs-page">
        <nav className="cs-navbar">
          <div className="cs-navbar__brand">
            <CleanStreetLogo size={42} />
            <span className="cs-navbar__name">CleanStreet</span>
          </div>
          <div className="cs-navbar__links">
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Report Issue', path: '/submit-complaint' },
              { label: 'View Complaints', path: '/complaints' },
            ].map(item => (
              <span key={item.label} className="cs-navbar__link" onClick={() => navigate(item.path)} style={{ cursor: 'pointer' }}>
                {item.label}
              </span>
            ))}
          </div>
          <div className="cs-navbar__actions">
            <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => navigate('/login')}>Login</button>
            <button className="cs-btn--register" onClick={() => navigate('/signup')}>Register</button>
            <div className="cs-avatar" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>{avatar}</div>
          </div>
        </nav>

        <div className="sc-success-screen">
          <div className="sc-success-card">
            <div className="sc-success-icon">✅</div>
            <h2>Report Submitted!</h2>
            <p>Your complaint has been received and will be reviewed by local authorities shortly.</p>
            <p className="sc-success-sub">You'll be notified of any updates via your dashboard.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
              <button className="cs-btn cs-btn--primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              <button className="cs-btn cs-btn--secondary" onClick={() => { setSubmitted(false); setForm({ title: '', type: '', priority: '', address: '', landmark: '', description: '', photo: null, photoPreview: null }); }}>
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-page">

      {/* ── Navbar ── */}
      <nav className="cs-navbar">
        <div className="cs-navbar__brand">
          <CleanStreetLogo size={42} />
          <span className="cs-navbar__name">CleanStreet</span>
        </div>
        <div className="cs-navbar__links">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Report Issue', path: '/submit-complaint' },
            { label: 'View Complaints', path: '/complaints' },
          ].map(item => (
            <span
              key={item.label}
              className={`cs-navbar__link ${item.label === 'Report Issue' ? 'cs-navbar__link--active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="cs-navbar__actions">
          <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => navigate('/login')}>Login</button>
          <button className="cs-btn--register" onClick={() => navigate('/signup')}>Register</button>
          <div className="cs-avatar" onClick={() => navigate('/profile')} title="My Profile" style={{ cursor: 'pointer' }}>{avatar}</div>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <div className="sc-hero">
        <div className="sc-hero__content">
          <div className="sc-hero__eyebrow">📋 Report a Civic Issue</div>
          <h1 className="sc-hero__title">Submit a Complaint</h1>
          <p className="sc-hero__subtitle">
            Help improve your community by reporting civic issues. Fill in the details below and we'll get it to the right authorities.
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="sc-main-content">
        <form onSubmit={handleSubmit}>
          <div className="sc-form-grid">

            {/* ── Left: Form ── */}
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
                    <label className="cs-label">Address <span className="sc-required">*</span></label>
                    <input
                      className="cs-input"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                </div>

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

                <div className="cs-form-group" style={{ marginBottom: 0 }}>
                  <label className="cs-label">Description <span className="sc-required">*</span></label>
                  <textarea
                    className="cs-input cs-textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail..."
                    required
                  />
                </div>
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
            </div>

            {/* ── Right: Map + Info ── */}
            <div className="sc-side-col">

              {/* Map */}
              <div className="cs-sidebar-card sc-section">
                <div className="cs-sidebar-card__title">📍 Location on Map</div>
                <div ref={mapRef} className="sc-map" />
                <p className="sc-map-hint">Click on the map to mark the exact location of the issue.</p>
              </div>

              {/* Tips */}
              <div className="cs-health-card sc-tips-card">
                <div className="cs-health-card__label">💡 Tips for a Good Report</div>
                <div className="sc-tips-list">
                  <div className="sc-tip">✓ Be specific about the location</div>
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

            </div>
          </div>
        </form>
      </div>

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />
    </div>
  );
}