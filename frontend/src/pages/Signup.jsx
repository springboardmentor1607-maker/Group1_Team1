import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login-Signup.css";

function CleanStreetLogo({ size = 100 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6"/><stop offset="100%" stopColor="#81d4fa"/>
        </linearGradient>
        <linearGradient id="grassG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a"/><stop offset="100%" stopColor="#388e3c"/>
        </linearGradient>
        <linearGradient id="roadG2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c"/><stop offset="100%" stopColor="#546e7a"/>
        </linearGradient>
        <clipPath id="cc2"><circle cx="100" cy="100" r="86"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white"/>
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2"/>
      <circle cx="100" cy="100" r="87" fill="url(#skyG2)"/>
      <g clipPath="url(#cc2)">
        <g fill="white">
          <rect x="25" y="78" width="16" height="32"/>
          <rect x="27" y="80" width="3" height="3" fill="#90caf9"/><rect x="32" y="80" width="3" height="3" fill="#90caf9"/>
          <rect x="27" y="86" width="3" height="3" fill="#90caf9"/><rect x="32" y="86" width="3" height="3" fill="#90caf9"/>
          <rect x="42" y="60" width="18" height="50"/>
          <rect x="50" y="52" width="2" height="9"/>
          <rect x="44" y="64" width="4" height="4" fill="#90caf9"/><rect x="51" y="64" width="4" height="4" fill="#90caf9"/>
          <rect x="44" y="72" width="4" height="4" fill="#90caf9"/><rect x="51" y="72" width="4" height="4" fill="#90caf9"/>
          <rect x="62" y="50" width="20" height="60"/>
          <rect x="71" y="42" width="2" height="10"/>
          <rect x="64" y="54" width="5" height="5" fill="#90caf9"/><rect x="72" y="54" width="5" height="5" fill="#90caf9"/>
          <rect x="64" y="63" width="5" height="5" fill="#90caf9"/><rect x="72" y="63" width="5" height="5" fill="#90caf9"/>
          <rect x="64" y="72" width="5" height="5" fill="#90caf9"/><rect x="72" y="72" width="5" height="5" fill="#90caf9"/>
          <rect x="64" y="81" width="5" height="5" fill="#90caf9"/>
          <rect x="84" y="58" width="18" height="52"/>
          <rect x="86" y="62" width="4" height="4" fill="#90caf9"/><rect x="93" y="62" width="4" height="4" fill="#90caf9"/>
          <rect x="86" y="70" width="4" height="4" fill="#90caf9"/><rect x="93" y="70" width="4" height="4" fill="#90caf9"/>
          <rect x="104" y="65" width="16" height="45"/>
          <rect x="106" y="68" width="4" height="4" fill="#90caf9"/><rect x="112" y="68" width="4" height="4" fill="#90caf9"/>
          <rect x="106" y="76" width="4" height="4" fill="#90caf9"/>
          <rect x="121" y="74" width="16" height="36"/>
          <rect x="123" y="78" width="3" height="3" fill="#90caf9"/><rect x="129" y="78" width="3" height="3" fill="#90caf9"/>
          <rect x="123" y="85" width="3" height="3" fill="#90caf9"/>
        </g>
        <ellipse cx="100" cy="132" rx="95" ry="44" fill="#81c784"/>
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassG2)"/>
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadG2)"/>
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3"/>
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3"/>
        <circle cx="48" cy="130" r="10" fill="#2e7d32"/><circle cx="42" cy="136" r="9" fill="#43a047"/>
        <circle cx="54" cy="136" r="9" fill="#43a047"/><rect x="47" y="142" width="3" height="7" fill="#5d4037"/>
        <circle cx="152" cy="130" r="10" fill="#2e7d32"/><circle cx="146" cy="136" r="9" fill="#43a047"/>
        <circle cx="158" cy="136" r="9" fill="#43a047"/><rect x="151" y="142" width="3" height="7" fill="#5d4037"/>
        <path d="M132,44 Q134,41 136,44" stroke="#37474f" strokeWidth="1.2" fill="none"/>
        <path d="M142,37 Q144,34 146,37" stroke="#37474f" strokeWidth="1.2" fill="none"/>
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3"/>
      <path id="la2" d="M 26,100 A 74,74 0 0,1 174,100" fill="none"/>
      <text fontFamily="'Arial Rounded MT Bold', Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#la2" startOffset="7%">CLEAN STREETS</textPath>
      </text>
      <g transform="translate(12,106) rotate(-15)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)"/>
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)"/>
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)"/>
      </g>
      <g transform="translate(188,106) rotate(15) scale(-1,1)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)"/>
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)"/>
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)"/>
      </g>
    </svg>
  );
}

// Password strength checker
function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "weak" },
    { label: "Fair", color: "fair" },
    { label: "Good", color: "good" },
    { label: "Strong", color: "strong" },
  ];
  return { score, ...map[score] };
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "citizen" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  const roles = [
    { key: "citizen", icon: "🧑‍💼", label: "Citizen" },
    { key: "official", icon: "🏛️", label: "Official" },
    { key: "volunteer", icon: "🤝", label: "Volunteer" },
    { key: "business", icon: "🏢", label: "Business" },
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
            Be the Change<br/>Your City <span>Needs</span>
          </h1>
          <p className="auth-panel__desc">
            Create your free account and start making a difference. Report
            issues, earn civic badges, and help build a cleaner, safer community.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">🏅</div>
              <div className="auth-feature__text">
                <strong>Earn Civic Badges</strong>
                Get recognized for your contributions to the community.
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">📊</div>
              <div className="auth-feature__text">
                <strong>Personal Dashboard</strong>
                Track all your reports, votes, and community impact.
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">🔔</div>
              <div className="auth-feature__text">
                <strong>Live Notifications</strong>
                Get updates the moment your issue is acted upon.
              </div>
            </div>
          </div>
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat__num">Free</span>
              <span className="auth-stat__label">Always</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat__num">30s</span>
              <span className="auth-stat__label">To Sign Up</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat__num">🔒</span>
              <span className="auth-stat__label">Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">

          {success ? (
            /* Success State */
            <div className="auth-success">
              <span className="auth-success__icon">🎉</span>
              <h2 className="auth-success__title">You're all set!</h2>
              <p className="auth-success__msg">
                Welcome to CleanStreet, {form.firstName}!<br/>
                Your account has been created. Let's start making your city cleaner.
              </p>
              <button className="auth-btn" style={{ marginTop: 24 }} onClick={() => navigate("/dashboard")}>
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
                  <button onClick={() => navigate("/login")} style={{ background:"none", border:"none", color:"var(--auth-primary)", fontWeight:600, cursor:"pointer", padding:0, font:"inherit" }}>Sign in</button>
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>

                {/* Name row */}
                <div className="auth-row">
                  <div className="auth-group">
                    <label className="auth-label">First Name</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">👤</span>
                      <input className={`auth-input${errors.firstName ? " auth-input--error" : ""}`} type="text" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange}/>
                    </div>
                    {errors.firstName && <span className="auth-error-msg">⚠ {errors.firstName}</span>}
                  </div>
                  <div className="auth-group">
                    <label className="auth-label">Last Name</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">👤</span>
                      <input className={`auth-input${errors.lastName ? " auth-input--error" : ""}`} type="text" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange}/>
                    </div>
                    {errors.lastName && <span className="auth-error-msg">⚠ {errors.lastName}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="auth-group">
                  <label className="auth-label">Email address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉️</span>
                    <input className={`auth-input${errors.email ? " auth-input--error" : ""}`} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email"/>
                  </div>
                  {errors.email && <span className="auth-error-msg">⚠ {errors.email}</span>}
                </div>

                {/* Password */}
                <div className="auth-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input className={`auth-input${errors.password ? " auth-input--error" : ""}`} type={showPass ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password"/>
                    <button type="button" className="auth-input-toggle" onClick={() => setShowPass(s => !s)} tabIndex={-1}>{showPass ? "🙈" : "👁️"}</button>
                  </div>
                  {errors.password && <span className="auth-error-msg">⚠ {errors.password}</span>}
                  {/* Strength meter */}
                  {form.password && (
                    <div className="auth-strength">
                      <div className="auth-strength__bars">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`auth-strength__bar${strength.score >= i ? ` auth-strength__bar--${strength.color}` : ""}`}/>
                        ))}
                      </div>
                      <span className="auth-strength__label">
                        {strength.label ? `Password strength: ${strength.label}` : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Role selector */}
                <div className="auth-group">
                  <label className="auth-label">I am a…</label>
                  <div className="auth-roles">
                    {roles.map(r => (
                      <button
                        key={r.key}
                        type="button"
                        className={`auth-role-btn${form.role === r.key ? " auth-role-btn--active" : ""}`}
                        onClick={() => setForm(f => ({ ...f, role: r.key }))}
                      >
                        <span className="auth-role-btn__icon">{r.icon}</span>
                        <span className="auth-role-btn__label">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button className="auth-btn auth-btn--green" type="submit" disabled={loading}>
                  {loading ? (<><span className="auth-btn__spinner"/>Creating account…</>) : "Create Account 🌿"}
                </button>

                <p className="auth-terms">
                  By signing up you agree to our{" "}
                  <a href="/terms">Terms of Service</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>.
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
