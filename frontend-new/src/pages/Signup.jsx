import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Login-Signup.css";
import API from "../api";

function CleanStreetLogo({ size = 100 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="cc2"><circle cx="100" cy="100" r="86" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyG2)" />
      <g clipPath="url(#cc2)">
        <g fill="white">
          <rect x="25" y="78" width="16" height="32" />
          <rect x="27" y="80" width="3" height="3" fill="#90caf9" /><rect x="32" y="80" width="3" height="3" fill="#90caf9" />
          <rect x="42" y="60" width="18" height="50" /><rect x="50" y="52" width="2" height="9" />
          <rect x="44" y="64" width="4" height="4" fill="#90caf9" /><rect x="51" y="64" width="4" height="4" fill="#90caf9" />
          <rect x="44" y="72" width="4" height="4" fill="#90caf9" /><rect x="51" y="72" width="4" height="4" fill="#90caf9" />
          <rect x="62" y="50" width="20" height="60" /><rect x="71" y="42" width="2" height="10" />
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
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassG2)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadG2)" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="la2" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="'Arial Rounded MT Bold', Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#la2" startOffset="7%">CLEAN STREETS</textPath>
      </text>
    </svg>
  );
}

function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak",   color: "weak"   },
    { label: "Fair",   color: "fair"   },
    { label: "Good",   color: "good"   },
    { label: "Strong", color: "strong" },
  ];
  return { score, ...map[score] };
}

export default function Signup() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
    role:      "user",
    location:  "",   // ✅ always collected for all roles
  });

  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f  => ({ ...f,  [name]: value }));
    setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password)         e.password  = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    // location required only for volunteers
    if (form.role === "volunteer" && !form.location.trim()) {
      e.location = "Location is required for volunteers";
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    try {
      setLoading(true);
      await API.post("/api/otp/send-register-otp", {
        email: form.email,
        name:  `${form.firstName} ${form.lastName}`,
      });
      setLoading(false);
      // ✅ Pass location to VerifyOtp so it reaches the backend
      navigate("/verify-otp", {
        state: {
          email:    form.email,
          name:     `${form.firstName} ${form.lastName}`,
          password: form.password,
          role:     form.role,
          location: form.location,   // ✅ IMPORTANT
        },
      });
    } catch (err) {
      setLoading(false);
      setErrors({ general: err.response?.data?.message || "Failed to send OTP. Please try again." });
    }
  };

  const roles = [
    { key: "user",      icon: "🧑‍💼", label: "Citizen"   },
    { key: "volunteer", icon: "🤝",   label: "Volunteer" },
    { key: "admin",     icon: "🛡️",  label: "Admin"     },
  ];

  return (
    <div className="auth-page">

      {/* ── Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <div className="auth-panel__logo">
            <CleanStreetLogo size={110} />
          </div>
          <h1 className="auth-panel__title">
            Be the Change<br />Your City <span>Needs</span>
          </h1>
          <p className="auth-panel__desc">
            Create your free account and start making a difference. Report issues,
            earn civic badges, and help build a cleaner, safer community.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">🏅</div>
              <div className="auth-feature__text"><strong>Earn Civic Badges</strong> Get recognized for your contributions.</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">📊</div>
              <div className="auth-feature__text"><strong>Personal Dashboard</strong> Track all your reports and impact.</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">🔔</div>
              <div className="auth-feature__text"><strong>Live Notifications</strong> Get updates the moment your issue is acted upon.</div>
            </div>
          </div>
          <div className="auth-stats">
            <div className="auth-stat"><span className="auth-stat__num">Free</span><span className="auth-stat__label">Always</span></div>
            <div className="auth-stat"><span className="auth-stat__num">30s</span><span className="auth-stat__label">To Sign Up</span></div>
            <div className="auth-stat"><span className="auth-stat__num">🔒</span><span className="auth-stat__label">Secure</span></div>
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">

          {success ? (
            <div className="auth-success">
              <span className="auth-success__icon">🎉</span>
              <h2 className="auth-success__title">You're all set!</h2>
              <p className="auth-success__msg">
                Welcome to CleanStreet, {form.firstName}!<br />
                Your account has been created.
              </p>
              <button className="auth-btn" style={{ marginTop: 24 }}
                onClick={() => navigate(form.role === "admin" ? "/admin" : form.role === "volunteer" ? "/volunteer" : "/dashboard")}>
                Go to Dashboard →
              </button>
            </div>
          ) : (
            <>
              <div className="auth-card__header">
                <button className="auth-card__back" onClick={() => navigate("/")}>← Back to home</button>
                <h2 className="auth-card__title">Create your account 🌿</h2>
                <p className="auth-card__subtitle">
                  Already have an account?{" "}
                  <button onClick={() => navigate("/login")} style={{ background:"none", border:"none", color:"var(--auth-primary)", fontWeight:600, cursor:"pointer", padding:0, font:"inherit" }}>
                    Sign in
                  </button>
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>

                {errors.general && (
                  <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#dc2626", display:"flex", alignItems:"center", gap:6 }}>
                    ⚠️ {errors.general}
                  </div>
                )}

                {/* First + Last Name */}
                <div className="auth-row">
                  <div className="auth-group">
                    <label className="auth-label">First Name</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">👤</span>
                      <input className={`auth-input${errors.firstName ? " auth-input--error" : ""}`} type="text" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
                    </div>
                    {errors.firstName && <span className="auth-error-msg">⚠ {errors.firstName}</span>}
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Last Name</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">👤</span>
                      <input className={`auth-input${errors.lastName ? " auth-input--error" : ""}`} type="text" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
                    </div>
                    {errors.lastName && <span className="auth-error-msg">⚠ {errors.lastName}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="auth-group">
                  <label className="auth-label">Email address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉️</span>
                    <input className={`auth-input${errors.email ? " auth-input--error" : ""}`} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
                  </div>
                  {errors.email && <span className="auth-error-msg">⚠ {errors.email}</span>}
                </div>

                {/* ✅ Location — always shown, required only for volunteers */}
                <div className="auth-group">
                  <label className="auth-label">
                    Location / City
                    {form.role === "volunteer"
                      ? <span style={{ color:"#ef4444", marginLeft:4 }}>*</span>
                      : <span style={{ fontSize:11, color:"#9ca3af", marginLeft:6 }}>(optional)</span>
                    }
                  </label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">📍</span>
                    <input
                      className={`auth-input${errors.location ? " auth-input--error" : ""}`}
                      type="text"
                      name="location"
                      placeholder={form.role === "volunteer" ? "e.g. Lucknow, Uttar Pradesh" : "e.g. Chennai (optional)"}
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.location
                    ? <span className="auth-error-msg">⚠ {errors.location}</span>
                    : form.role === "volunteer"
                      ? <span style={{ fontSize:11, color:"#2563eb", marginTop:3, display:"block" }}>📌 Used to match you with complaints in your area</span>
                      : null
                  }
                </div>

                {/* Password */}
                <div className="auth-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input className={`auth-input${errors.password ? " auth-input--error" : ""}`} type={showPass ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
                    <button type="button" className="auth-input-toggle" onClick={() => setShowPass(s => !s)} tabIndex={-1}>{showPass ? "🙈" : "👁️"}</button>
                  </div>
                  {errors.password && <span className="auth-error-msg">⚠ {errors.password}</span>}
                  {form.password && (
                    <div className="auth-strength">
                      <div className="auth-strength__bars">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`auth-strength__bar${strength.score >= i ? ` auth-strength__bar--${strength.color}` : ""}`} />
                        ))}
                      </div>
                      <span className="auth-strength__label">{strength.label ? `Password strength: ${strength.label}` : ""}</span>
                    </div>
                  )}
                </div>

                {/* Role */}
                <div className="auth-group">
                  <label className="auth-label">I am a…</label>
                  <div className="auth-roles" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                    {roles.map(r => (
                      <button key={r.key} type="button"
                        className={`auth-role-btn${form.role === r.key ? " auth-role-btn--active" : ""}`}
                        onClick={() => setForm(f => ({ ...f, role: r.key }))}
                        style={r.key === "admin" ? { gridColumn:"1 / -1" } : {}}>
                        <span className="auth-role-btn__icon">{r.icon}</span>
                        <span className="auth-role-btn__label">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button className="auth-btn auth-btn--green" type="submit" disabled={loading}>
                  {loading ? <><span className="auth-btn__spinner" />Creating account…</> : "Create Account 🌿"}
                </button>

                <p className="auth-terms">
                  By signing up you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
