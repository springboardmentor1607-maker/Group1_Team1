import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import API from "../api";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGradLP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassGradLP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadGradLP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="circleClipLP"><circle cx="100" cy="100" r="86" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyGradLP)" />
      <g clipPath="url(#circleClipLP)">
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
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGradLP)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGradLP)" />
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="csArcLP" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csArcLP" startOffset="7%">CLEAN STREETS</textPath>
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

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score: s, ...map[s] };
}

function timeAgo(date) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

// ─── GPS reverse-geocode helper (same logic as Maps page) ─────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const a = data.address || {};
    // Build "City, State" string — mirrors what Signup.jsx expects
    const city  = a.city || a.town || a.village || a.county || "";
    const state = a.state || "";
    return city && state ? `${city}, ${state}` : city || state || data.display_name || "";
  } catch {
    return "";
  }
}

// ─── Modal shared styles ──────────────────────────────────────────────────────
const MS = {
  overlay: { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "lpFadeIn 0.2s ease" },
  card: { background: "#fff", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 440, position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", animation: "lpSlideUp 0.25s ease" },
  close: { position: "absolute", top: 14, right: 14, background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: 800, color: "#111827", margin: "10px 0 4px" },
  sub: { fontSize: 13, color: "#6b7280", margin: 0 },
  // ── "Sign up free" / "Sign in" links inside modals navigate to the full page ──
  lBtn: { background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "inherit", fontFamily: "inherit" },
  sRow: { display: "flex", gap: 10, marginBottom: 14 },
  sBtn: { flex: 1, padding: "9px 10px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" },
  dRow: { display: "flex", alignItems: "center", gap: 10, margin: "2px 0 14px" },
  dLine: { flex: 1, height: 1, background: "#f3f4f6" },
  dText: { fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" },
  err: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
  lbl: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  iW: { position: "relative", display: "flex", alignItems: "center" },
  iI: { position: "absolute", left: 12, fontSize: 15, pointerEvents: "none" },
  inp: { width: "100%", padding: "10px 12px 10px 36px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#111827", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  inpP: { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#111827", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  tog: { position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 0 },
  sub2: { width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  fE: { fontSize: 11, color: "#ef4444", marginTop: 3 },
  fg: { background: "none", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" },
};

// ─── Login Modal ──────────────────────────────────────────────────────────────
// Syncs with Login.jsx: same API call, same role-based redirect.
// "Sign up free" link → navigates to /signup (the full Signup.jsx page)
function LoginModal({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", { email: form.email, password: form.password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      login(data.user || data, data.token);
      const role = (data.user?.role || data.role || "user").toLowerCase();
      onClose();
      if (role === "admin") navigate("/admin");
      else if (role === "volunteer") navigate("/volunteer");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div style={MS.overlay} onClick={onClose}>
      <div style={MS.card} onClick={e => e.stopPropagation()}>
        <button style={MS.close} onClick={onClose}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <CleanStreetLogo size={64} />
          <h2 style={MS.title}>Welcome back 👋</h2>
          <p style={MS.sub}>
            No account?{" "}
            <button onClick={onSwitchToSignup} style={MS.lBtn}>
              Sign up free
            </button>
          </p>
        </div>
        <div style={MS.sRow}>
          <button style={MS.sBtn}>🌐 Google</button>
          <button style={MS.sBtn}>📘 Facebook</button>
        </div>
        <div style={MS.dRow}><div style={MS.dLine} /><span style={MS.dText}>or sign in with email</span><div style={MS.dLine} /></div>
        {error && <div style={MS.err}>⚠️ {error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div>
            <label style={MS.lbl}>Email address <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={MS.iW}><span style={MS.iI}>✉️</span>
              <input style={MS.inp} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
            </div>
          </div>
          <div>
            <label style={MS.lbl}>Password <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={MS.iW}><span style={MS.iI}>🔒</span>
              <input style={MS.inp} type={showPass ? "text" : "password"} name="password" placeholder="Your password" value={form.password} onChange={handleChange} />
              <button type="button" style={MS.tog} onClick={() => setShowPass(s => !s)}>{showPass ? "🙈" : "👁️"}</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" style={MS.fg} onClick={() => { onClose(); navigate("/forgot-password"); }}>Forgot password?</button>
          </div>
          <button style={{ ...MS.sub2, opacity: loading ? 0.75 : 1 }} type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 14 }}>
          Want the full experience?{" "}
          <button onClick={() => { onClose(); navigate("/login"); }} style={{ ...MS.fg, fontSize: 12 }}>
            Open full login page →
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Signup Modal ─────────────────────────────────────────────────────────────
// Syncs with Signup.jsx: same API call (/api/otp/send-register-otp),
// same navigate("/verify-otp") with identical state shape including location.
// Adds GPS "Use my location" button — reverse-geocodes via Nominatim.
function SignupModal({ onClose, onSwitchToLogin }) {
  const navigate = useNavigate();

  // ── FIX: was `role: "defaultRole"` (a string literal bug) ──
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", location: "", role: "user",   // ← correct default
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const strength = getStrength(form.password);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: "" }));
  };

  // ── GPS: detect current location and reverse-geocode to city string ──
  const handleUseLocation = () => {
    if (!navigator.geolocation) { setGpsError("GPS not supported by your browser."); return; }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const city = await reverseGeocode(coords.latitude, coords.longitude);
        if (city) {
          setForm(f => ({ ...f, location: city }));
          setErrors(er => ({ ...er, location: "" }));
        } else {
          setGpsError("Couldn't detect location. Please type it manually.");
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(
          err.code === 1
            ? "Location access denied. Please allow it or type manually."
            : "Couldn't get location. Please type it manually."
        );
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Min. 8 characters";
    if (!form.location.trim()) e.location = "Required";
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setLoading(true);
    try {
      await API.post("/api/otp/send-register-otp", {
        email: form.email,
        name: form.firstName + " " + form.lastName,
      });
      onClose();
      // ── Exact same state shape as Signup.jsx ──
      navigate("/verify-otp", {
        state: {
          email: form.email,
          name: form.firstName + " " + form.lastName,
          password: form.password,
          location: form.location,   // ← stored by VerifyOtp → backend
          role: form.role,
        },
      });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Failed to send OTP." });
    } finally { setLoading(false); }
  };

  const roles = [
    { key: "user",      icon: "🧑‍💼", label: "Citizen"   },
    { key: "volunteer", icon: "🤝",   label: "Volunteer" },
    { key: "admin",     icon: "🛡️",   label: "Admin"     },
  ];

  return (
    <div style={MS.overlay} onClick={onClose}>
      <div style={{ ...MS.card, maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <button style={MS.close} onClick={onClose}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <CleanStreetLogo size={56} />
          <h2 style={MS.title}>Create your account 🌿</h2>
          <p style={MS.sub}>
            Have an account?{" "}
            <button onClick={onSwitchToLogin} style={MS.lBtn}>
              Sign in
            </button>
          </p>
        </div>
        {errors.general && <div style={MS.err}>⚠️ {errors.general}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>

          {/* Name row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={MS.lbl}>First Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input style={{ ...MS.inpP, borderColor: errors.firstName ? "#fca5a5" : "#e5e7eb" }} name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
              {errors.firstName && <div style={MS.fE}>{errors.firstName}</div>}
            </div>
            <div>
              <label style={MS.lbl}>Last Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input style={{ ...MS.inpP, borderColor: errors.lastName ? "#fca5a5" : "#e5e7eb" }} name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
              {errors.lastName && <div style={MS.fE}>{errors.lastName}</div>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={MS.lbl}>Email address <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={MS.iW}><span style={MS.iI}>✉️</span>
              <input style={{ ...MS.inp, borderColor: errors.email ? "#fca5a5" : "#e5e7eb" }} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            {errors.email && <div style={MS.fE}>{errors.email}</div>}
          </div>

          {/* Password */}
          <div>
            <label style={MS.lbl}>Password <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={MS.iW}><span style={MS.iI}>🔒</span>
              <input style={{ ...MS.inp, borderColor: errors.password ? "#fca5a5" : "#e5e7eb" }} type={showPass ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} />
              <button type="button" style={MS.tog} onClick={() => setShowPass(s => !s)}>{showPass ? "🙈" : "👁️"}</button>
            </div>
            {form.password && (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength.score ? strength.color : "#e5e7eb", transition: "background 0.3s" }} />)}
                </div>
                {strength.label && <div style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</div>}
              </div>
            )}
            {errors.password && <div style={MS.fE}>{errors.password}</div>}
          </div>

          {/* ── Location with GPS button ── */}
          <div>
            <label style={MS.lbl}>
              Location
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ ...MS.iW, flex: 1 }}>
                <span style={MS.iI}>📍</span>
                <input
                  style={{ ...MS.inp, borderColor: errors.location ? "#fca5a5" : "#e5e7eb" }}
                  name="location"
                  placeholder="e.g. Kanpur, Uttar Pradesh"
                  value={form.location}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />
              </div>
              {/* GPS button — same icon/behaviour as Maps page */}
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={gpsLoading}
                title="Detect my current location"
                style={{
                  flexShrink: 0,
                  height: 42,
                  padding: "0 12px",
                  border: "1.5px solid #2563eb",
                  borderRadius: 10,
                  background: gpsLoading ? "#eff6ff" : "#2563eb",
                  color: gpsLoading ? "#2563eb" : "#fff",
                  fontSize: 18,
                  cursor: gpsLoading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {gpsLoading ? (
                  <span style={{ fontSize: 13, fontWeight: 600 }}>…</span>
                ) : (
                  "🎯"
                )}
              </button>
            </div>
            {/* GPS status messages */}
            {gpsLoading && (
              <div style={{ fontSize: 11, color: "#2563eb", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ animation: "lpPulse 1s infinite", display: "inline-block" }}>📡</span>
                Detecting your location…
              </div>
            )}
            {gpsError && !gpsLoading && (
              <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>⚠️ {gpsError}</div>
            )}
            {!gpsError && !gpsLoading && form.location && (
              <div style={{ fontSize: 11, color: "#16a34a", marginTop: 4 }}>✓ Location set</div>
            )}
            {errors.location && <div style={MS.fE}>{errors.location}</div>}
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
              Your city or district — used to match you with nearby complaints
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label style={MS.lbl}>I am joining as</label>
            <div style={{ display: "flex", gap: 8 }}>
              {roles.map(r => (
                <button key={r.key} type="button" onClick={() => setForm(f => ({ ...f, role: r.key }))}
                  style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `2px solid ${form.role === r.key ? "#2563eb" : "#e5e7eb"}`, background: form.role === r.key ? "#eff6ff" : "#fff", color: form.role === r.key ? "#2563eb" : "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.15s", fontFamily: "inherit" }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>{r.label}
                </button>
              ))}
            </div>
          </div>

          <button style={{ ...MS.sub2, opacity: loading ? 0.75 : 1 }} type="submit" disabled={loading}>
            {loading ? "Sending OTP…" : "Create Account →"}
          </button>
          <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: 0 }}>By signing up you agree to our Terms &amp; Privacy Policy.</p>
        </form>

        {/* Link to full Signup page */}
        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 14 }}>
          Want the full experience?{" "}
          <button onClick={() => { onClose(); navigate("/signup"); }} style={{ ...MS.fg, fontSize: 12 }}>
            Open full signup page →
          </button>
        </p>
      </div>
    </div>
  );
}

function ComplaintJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { icon: "📸", label: "Submitted",   color: "#3b82f6", bg: "#dbeafe", desc: "Citizen reports issue with photo & location" },
    { icon: "👤", label: "Assigned",    color: "#f59e0b", bg: "#fef9c3", desc: "Admin assigns a local volunteer" },
    { icon: "✅", label: "Accepted",    color: "#22c55e", bg: "#dcfce7", desc: "Volunteer confirms and heads to site" },
    { icon: "🔄", label: "In Progress", color: "#8b5cf6", bg: "#ede9fe", desc: "Issue is actively being resolved" },
    { icon: "🏆", label: "Resolved",    color: "#10b981", bg: "#d1fae5", desc: "Done! Citizen gets notified instantly" },
  ];
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 2200);
    return () => clearInterval(t);
  }, [steps.length]);
  return (
    <div style={{ background: "#fff", borderRadius: 22, padding: "28px 26px", border: "1px solid #e5e7eb", boxShadow: "0 8px 32px rgba(37,99,235,0.1)" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 22 }}>🔴 Live — Complaint Journey</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: i <= activeStep ? step.bg : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, border: `2px solid ${i === activeStep ? step.color : "transparent"}`, boxShadow: i === activeStep ? `0 0 0 5px ${step.color}25` : "none", transition: "all 0.45s ease" }}>
                <span style={{ opacity: i <= activeStep ? 1 : 0.3 }}>{step.icon}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 2, height: 30, background: i < activeStep ? step.color : "#e5e7eb", transition: "background 0.45s ease", marginTop: 3, marginBottom: 3, borderRadius: 99 }} />}
            </div>
            <div style={{ paddingTop: 11, opacity: i <= activeStep ? 1 : 0.35, transition: "opacity 0.45s" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: i === activeStep ? step.color : "#374151" }}>{step.label}</div>
              {i === activeStep && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, animation: "lpFadeIn 0.3s ease" }}>{step.desc}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, padding: "11px 14px", background: "#dcfce7", borderRadius: 10, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 15 }}>🔔</span>
        <span style={{ fontSize: 12, color: "#166534", fontWeight: 600 }}>You're notified at every step</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ total: "500+", resolved: "380+", users: "1,200+", avgDays: 3 });
  const [recentResolutions, setRecentResolutions] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const howRef   = useRef(null);
  const featRef  = useRef(null);
  const statsRef = useRef(null);
  const resRef   = useRef(null);

  // ─── FIX: Only fetch stats when user is logged in ─────────────────────────
  // Previously this called /api/complaints without auth → 401 → api interceptor
  // redirected to /login. Now we only fetch if the user is authenticated,
  // and fall back to static numbers for guests.
  useEffect(() => {
    if (!user) {
      // Guest — show static fallback numbers, don't hit authenticated endpoints
      setStatsLoading(false);
      return;
    }
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await API.get("/api/complaints");
        const raw = Array.isArray(res.data) ? res.data : res.data?.complaints || [];
        const total = raw.length;
        const resolvedList = raw.filter(c => ["resolved", "completed"].includes(c.status));
        const resolved = resolvedList.length;
        const uniqueUsers = new Set(raw.map(c => String(c.user_id?._id || c.user_id))).size;
        let avgDays = 3;
        if (resolvedList.length > 0) {
          const totalDays = resolvedList.reduce((sum, c) => {
            const d = Math.max(0, (new Date(c.updated_at || c.updatedAt) - new Date(c.created_at || c.createdAt)) / 86400000);
            return sum + d;
          }, 0);
          avgDays = Math.max(1, Math.round(totalDays / resolvedList.length));
        }
        setStats({ total, resolved, users: uniqueUsers, avgDays });
        const recent = resolvedList
          .sort((a, b) => new Date(b.updated_at || b.updatedAt) - new Date(a.updated_at || a.updatedAt))
          .slice(0, 6)
          .map(c => ({ id: String(c._id), title: c.title || "Civic Issue", type: (c.type || "general").toLowerCase(), address: c.address ? c.address.split(",").slice(0, 2).join(", ") : "Local Area", resolvedAt: c.updated_at || c.updatedAt, priority: c.priority || "medium", upvotes: c.upvotes || 0 }));
        setRecentResolutions(recent);
      } catch {
        // Keep static fallback numbers on error
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = ref => ref.current?.scrollIntoView({ behavior: "smooth" });

  // If already logged in, go straight to their dashboard instead of opening a modal
  const userDashboard = user
    ? (user.role === "admin" ? "/admin" : user.role === "volunteer" ? "/volunteer" : "/dashboard")
    : null;
  const openLogin  = () => user ? navigate(userDashboard) : setModal("login");
  const openSignup = () => user ? navigate(userDashboard) : setModal("signup");
  const closeModal = () => setModal(null);

  const resolveRate = typeof stats.total === "number" && stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100) : 76;

  const TYPE_ICONS = { pothole: "🕳️", streetlight: "💡", garbage: "🗑️", water: "💧", road: "🛣️", noise: "📢", other: "📋", general: "📋" };
  const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#f97316", critical: "#ef4444" };

  const FEATURES = [
    { icon: "📍", title: "Pin & Report Instantly", desc: "Snap a photo, mark the spot on the map, submit in under 30 seconds. No paperwork, no queues.", color: "#2563eb", bg: "#dbeafe", cta: "Try Reporting →", onClick: openSignup },
    { icon: "🔄", title: "Real-Time Tracking", desc: "Follow every stage of your complaint with live status updates and push notifications.", color: "#8b5cf6", bg: "#ede9fe", cta: "View Complaints →", onClick: openSignup },
    { icon: "🗺️", title: "City-Wide Issue Map", desc: "See every reported issue on an interactive map. Know exactly what's being worked on near you.", color: "#0891b2", bg: "#cffafe", cta: "Explore Map →", onClick: openSignup },
    { icon: "🤝", title: "Local Volunteer Network", desc: "Trained volunteers are assigned to every issue — fast, accountable, community-driven action.", color: "#16a34a", bg: "#dcfce7", cta: "Become a Volunteer →", onClick: () => setModal("signup-volunteer") },
    { icon: "🔔", title: "Instant Notifications", desc: "Get notified at every status change. From submission to resolution — always in the loop.", color: "#d97706", bg: "#fef9c3", cta: null, onClick: null },
    { icon: "📊", title: "Personal Dashboard", desc: "Track all your complaints, upvotes, and civic impact from your beautiful personal dashboard.", color: "#dc2626", bg: "#fee2e2", cta: "Go to Dashboard →", onClick: openSignup },
  ];

  const STEPS = [
    { num: "01", icon: "📸", title: "Report an Issue", desc: "Take a photo of a pothole, broken streetlight, garbage dump, or any civic problem. Add your location and submit in seconds.", color: "#2563eb", bg: "linear-gradient(135deg,#dbeafe,#eff6ff)" },
    { num: "02", icon: "👤", title: "Volunteer Gets Assigned", desc: "Our admin reviews the report and assigns a trained local volunteer to handle it, usually within a few hours.", color: "#f59e0b", bg: "linear-gradient(135deg,#fef9c3,#fffbeb)" },
    { num: "03", icon: "🏆", title: "Issue Gets Resolved", desc: "The volunteer fixes the issue, marks it complete, and you get notified instantly. You can verify and approve the resolution.", color: "#10b981", bg: "linear-gradient(135deg,#d1fae5,#f0fdf4)" },
  ];

  const TESTIMONIALS = [
    { name: "Priya Sharma", role: "Citizen, Bhubaneswar", avatar: "PS", color: "#dbeafe", text: "\"I reported a broken streetlight and it was fixed within 3 days. CleanStreet actually works — I was shocked by how fast it happened!\"" },
    { name: "Rahul Nayak",  role: "Volunteer, Cuttack",  avatar: "RN", color: "#dcfce7", text: "\"Being a volunteer has given me a sense of purpose. I've resolved 47 complaints in my area and the community recognition is amazing.\"" },
    { name: "Anita Das",    role: "Citizen, Puri",       avatar: "AD", color: "#fef9c3", text: "\"The map feature is brilliant. I can see exactly what's being worked on in my neighbourhood. Feels like the city is finally listening.\"" },
  ];

  const FALLBACK_RESOLUTIONS = [
    { icon: "🕳️", type: "Pothole",     title: "Road pothole repaired on Main Street",        addr: "Bhubaneswar, Odisha", time: "2 days ago", upvotes: 34, priority: "high"     },
    { icon: "💡", type: "Streetlight", title: "Broken streetlight replaced near park",         addr: "Cuttack, Odisha",     time: "4 days ago", upvotes: 28, priority: "medium"  },
    { icon: "🗑️", type: "Garbage",    title: "Illegal dump cleared from colony road",          addr: "Puri, Odisha",        time: "1 week ago", upvotes: 52, priority: "critical" },
    { icon: "💧", type: "Water",       title: "Leaking pipe on residential road sealed",       addr: "Rourkela, Odisha",    time: "3 days ago", upvotes: 19, priority: "high"     },
    { icon: "🛣️", type: "Road",       title: "Damaged footpath repaired near school",          addr: "Sambalpur, Odisha",   time: "5 days ago", upvotes: 41, priority: "medium"  },
    { icon: "💡", type: "Streetlight", title: "Non-functional traffic signal fixed",           addr: "Berhampur, Odisha",   time: "6 days ago", upvotes: 67, priority: "critical" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#fff", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,0.97)" : "transparent", backdropFilter: scrolled ? "blur(18px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none", transition: "all 0.3s ease", padding: "0 48px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CleanStreetLogo size={40} />
          <span style={{ fontSize: 19, fontWeight: 900, color: "#111827", letterSpacing: -0.3 }}>CleanStreet</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[{ label: "How it Works", ref: howRef }, { label: "Features", ref: featRef }, { label: "Impact", ref: statsRef }, { label: "Recent Wins", ref: resRef }].map(item => (
            <button key={item.label} onClick={() => scrollTo(item.ref)} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{item.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {user ? (
            <button onClick={() => navigate(userDashboard)} style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>Go to Dashboard →</button>
          ) : (
            <>
              <button onClick={openLogin} style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>Log In</button>
              <button onClick={openSignup} style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>Get Started Free</button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(160deg,#f0fdf4 0%,#eff6ff 50%,#f8fafc 100%)", padding: "100px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 380px", gap: 72, alignItems: "center" }}>
          <div style={{ animation: "lpFadeUp 0.7s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#dcfce7", color: "#166534", padding: "6px 16px", borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 28, letterSpacing: 0.3 }}>
              🌿 India's Civic Issue Reporting Platform
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: "#111827", lineHeight: 1.07, margin: "0 0 22px", letterSpacing: -1.5 }}>
              Making Cities<br />
              <span style={{ background: "linear-gradient(135deg,#2563eb,#16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Cleaner & Safer</span><br />
              Together
            </h1>
            <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.75, margin: "0 0 38px", maxWidth: 500 }}>
              Report potholes, broken streetlights, garbage dumps — and watch local volunteers fix them in real time. Full transparency from complaint to resolution.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <button onClick={openSignup} style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(37,99,235,0.35)", transition: "transform 0.15s,box-shadow 0.15s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(37,99,235,0.45)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.35)"; }}>🚀 Report an Issue Free</button>
              <button onClick={openLogin} style={{ background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>Sign In →</button>
            </div>
            <div style={{ display: "flex", gap: 36 }}>
              {[{ num: statsLoading ? "…" : `${stats.total}+`, label: "Issues Reported" }, { num: statsLoading ? "…" : `${stats.resolved}+`, label: "Resolved" }, { num: `${resolveRate}%`, label: "Resolution Rate" }, { num: `${stats.avgDays} days`, label: "Avg. Fix Time" }].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ animation: "lpFadeUp 0.95s ease" }}><ComplaintJourney /></div>
        </div>
      </section>

      {/* ── Who is it for ── */}
      <section style={{ padding: "90px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>Who is CleanStreet for?</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>Three roles, one mission — cleaner cities.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { icon: "🧑‍💼", title: "Citizens",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", points: ["Report civic issues with photos & GPS","Track complaint status live","Upvote issues in your neighbourhood","Get notified at resolution"], cta: "Join as Citizen" },
              { icon: "🤝",   title: "Volunteers", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", points: ["Accept & resolve local assignments","Track your performance dashboard","Earn community recognition","Make visible neighbourhood impact"], cta: "Become a Volunteer" },
              { icon: "🛡️",  title: "Admins",     color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", points: ["Oversee all complaints citywide","Assign volunteers by zone","Generate PDF & CSV reports","Manage users & applications"], cta: "Admin Access" },
            ].map((card, i) => (
              <div key={i} style={{ background: card.bg, border: `1.5px solid ${card.border}`, borderRadius: 16, padding: "28px 24px", transition: "transform 0.2s,box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>{card.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {card.points.map(p => (<li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151", lineHeight: 1.5 }}><span style={{ color: card.color, fontWeight: 800, flexShrink: 0 }}>✓</span>{p}</li>))}
                </ul>
                <button onClick={openSignup} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: card.color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{card.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section ref={howRef} style={{ padding: "90px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-block", background: "#dbeafe", color: "#1d4ed8", padding: "6px 18px", borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>From photo to fixed — in 3 steps</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>Simple, transparent, and community-powered.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, position: "relative" }}>
            <div style={{ position: "absolute", top: 44, left: "16%", right: "16%", height: 2, background: "linear-gradient(90deg,#2563eb,#22c55e)", borderRadius: 99, zIndex: 0 }} />
            {STEPS.map((step, i) => (
              <div key={i} style={{ background: step.bg, borderRadius: 20, padding: "34px 28px", position: "relative", zIndex: 1, border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", margin: "0 auto 22px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, boxShadow: `0 8px 28px ${step.color}22`, border: `3px solid ${step.color}28` }}>{step.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: 1.2, marginBottom: 10, textAlign: "center" }}>{step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 10px", textAlign: "center" }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: 0, textAlign: "center" }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button onClick={openSignup} style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 36px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(37,99,235,0.35)" }}>Start Reporting Now →</button>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      <section ref={statsRef} style={{ padding: "80px 48px", background: "linear-gradient(135deg,#1e3a8a,#1d4ed8,#2563eb)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Real Numbers. Real Impact.</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>{statsLoading ? "Loading live data…" : "Computed from our live database right now."}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 32 }}>
            {[{ icon: "📋", num: statsLoading ? "…" : `${stats.total}+`, label: "Issues Reported" }, { icon: "✅", num: statsLoading ? "…" : `${stats.resolved}+`, label: "Successfully Resolved" }, { icon: "👥", num: statsLoading ? "…" : `${stats.users}+`, label: "Active Citizens" }, { icon: "⚡", num: `${stats.avgDays} days`, label: "Average Fix Time" }].map(s => (
              <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 16px", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 4, letterSpacing: -1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "20px 36px", display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{resolveRate}%</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Resolution Rate</div></div>
              <div style={{ width: 200, height: 10, background: "rgba(255,255,255,0.15)", borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: `${resolveRate}%`, background: "linear-gradient(90deg,#bfdbfe,#fff)", borderRadius: 99 }} /></div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>of all reported issues resolved ✅</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featRef} style={{ padding: "90px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "#dcfce7", color: "#166534", padding: "6px 18px", borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>Everything you need to take action</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>Designed for citizens, volunteers, and administrators.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "24px", border: "1px solid #e5e7eb", transition: "transform 0.2s,box-shadow 0.2s,border-color 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#bfdbfe"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 14px" }}>{f.desc}</p>
                {f.cta && f.onClick && (<button onClick={f.onClick} style={{ background: "none", border: "none", color: f.color, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>{f.cta}</button>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "90px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "#fef9c3", color: "#92400e", padding: "6px 18px", borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>TESTIMONIALS</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>What our community says</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 16, padding: "28px 24px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 24, marginBottom: 14 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#374151" }}>{t.avatar}</div>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{t.name}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Resolutions ── */}
      <section ref={resRef} style={{ padding: "90px 48px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#dcfce7,#d1fae5)", color: "#065f46", padding: "6px 18px", borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "lpPulse 1.5s infinite", display: "inline-block" }} />
              COMMUNITY SUCCESS STORIES
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>{recentResolutions.length > 0 ? "Issues Resolved Recently" : "Real Problems. Real Solutions."}</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>{recentResolutions.length > 0 ? "Pulled live from our database — anonymized civic issues our volunteers just resolved." : "Join thousands already making a difference in their communities."}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {(recentResolutions.length > 0 ? recentResolutions : FALLBACK_RESOLUTIONS).map((r, i) => (
              <div key={r.id || i} style={{ background: "linear-gradient(135deg,#f0fdf4,#f8fafc)", border: "1px solid #dcfce7", borderRadius: 16, padding: "22px 20px", position: "relative", overflow: "hidden", transition: "transform 0.2s,box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(16,185,129,0.12)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg,#22c55e,#10b981)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "5px 14px", borderRadius: "0 16px 0 12px" }}>✓ RESOLVED</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{recentResolutions.length > 0 ? (TYPE_ICONS[r.type] || "📋") : r.icon}</div>
                  <div><div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "capitalize" }}>{r.type}</div><div style={{ fontSize: 10, color: "#9ca3af" }}>{recentResolutions.length > 0 ? timeAgo(r.resolvedAt) : r.time}</div></div>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.4 }}>{r.title}</h4>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>📍 {r.address || r.addr}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ background: (PRIORITY_COLORS[r.priority] || "#6b7280") + "18", color: PRIORITY_COLORS[r.priority] || "#6b7280", padding: "2px 9px", borderRadius: 9999, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{r.priority}</span>
                  {r.upvotes > 0 && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>👍 {r.upvotes}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 38 }}>
            <button onClick={openSignup} style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 34px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(37,99,235,0.35)" }}>Join &amp; Start Reporting →</button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "80px 48px", background: "linear-gradient(135deg,#f0fdf4,#eff6ff)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🌿</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#111827", margin: "0 0 16px", letterSpacing: -0.5 }}>Ready to make a difference?</h2>
          <p style={{ fontSize: 17, color: "#6b7280", margin: "0 0 36px", lineHeight: 1.75 }}>Join thousands of citizens already helping build cleaner, safer, and more accountable communities across India.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 }}>
            <button onClick={openSignup} style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}>🚀 Get Started Free</button>
            <button onClick={openLogin} style={{ background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Sign In →</button>
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>Free to join · No credit card required · Start in 60 seconds</div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0f172a", padding: "60px 48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <CleanStreetLogo size={36} />
                <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>CleanStreet</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: "#64748b", margin: "0 0 20px" }}>A civic issue reporting platform empowering citizens and volunteers to build cleaner, safer communities across India.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["🐦", "📘", "📸", "💼"].map((icon, i) => (<div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{icon}</div>))}
              </div>
            </div>
            {[
              { title: "Platform",  links: [{ label: "Report an Issue",     action: openSignup }, { label: "View Complaints",     action: openSignup }, { label: "Issue Map",             action: openSignup }, { label: "My Dashboard",   action: openLogin }] },
              { title: "Community", links: [{ label: "Become a Volunteer",   action: openSignup }, { label: "How it Works",       action: () => scrollTo(howRef) }, { label: "Recent Resolutions", action: () => scrollTo(resRef) }, { label: "Our Impact", action: () => scrollTo(statsRef) }] },
              { title: "Account",   links: [{ label: "Sign Up Free",         action: openSignup }, { label: "Log In",             action: openLogin }, { label: "Forgot Password",       action: () => navigate("/forgot-password") }, { label: "Verify OTP", action: () => navigate("/verify-otp") }] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map(link => (
                    <button key={link.label} onClick={link.action} style={{ background: "none", border: "none", textAlign: "left", fontSize: 13, color: "#64748b", cursor: "pointer", padding: 0, fontFamily: "inherit", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>{link.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#475569" }}>© {new Date().getFullYear()} CleanStreet. All rights reserved.</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Made with 🌿 for cleaner Indian cities</div>
          </div>
        </div>
      </footer>

      {modal === "login"  && <LoginModal  onClose={closeModal} onSwitchToSignup={() => setModal("signup")} />}
      {modal === "signup" && <SignupModal onClose={closeModal} onSwitchToLogin={() => setModal("login")} />}

      <style>{`
        @keyframes lpFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes lpSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpFadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpPulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6} }
        @keyframes lpFloat0  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes lpFloat1  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes lpFloat2  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        *{box-sizing:border-box}
        input:focus{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,0.12)!important;outline:none!important}
      `}</style>
    </div>
  );
}
