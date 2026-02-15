import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login-Signup.css";
import axios from "axios";

function CleanStreetLogo({ size = 100 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id="skyG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" />
          <stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" />
          <stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="cc">
          <circle cx="100" cy="100" r="86" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle
        cx="100"
        cy="100"
        r="98"
        fill="none"
        stroke="#4caf50"
        strokeWidth="4"
      />
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#4caf50"
        strokeWidth="2"
      />
      <circle cx="100" cy="100" r="87" fill="url(#skyG)" />
      <g clipPath="url(#cc)">
        <g fill="white">
          <rect x="25" y="78" width="16" height="32" />
          <rect x="27" y="80" width="3" height="3" fill="#90caf9" />
          <rect x="32" y="80" width="3" height="3" fill="#90caf9" />
          <rect x="27" y="86" width="3" height="3" fill="#90caf9" />
          <rect x="32" y="86" width="3" height="3" fill="#90caf9" />
          <rect x="42" y="60" width="18" height="50" />
          <rect x="50" y="52" width="2" height="9" />
          <rect x="44" y="64" width="4" height="4" fill="#90caf9" />
          <rect x="51" y="64" width="4" height="4" fill="#90caf9" />
          <rect x="44" y="72" width="4" height="4" fill="#90caf9" />
          <rect x="51" y="72" width="4" height="4" fill="#90caf9" />
          <rect x="44" y="80" width="4" height="4" fill="#90caf9" />
          <rect x="51" y="80" width="4" height="4" fill="#90caf9" />
          <rect x="62" y="50" width="20" height="60" />
          <rect x="71" y="42" width="2" height="10" />
          <rect x="64" y="54" width="5" height="5" fill="#90caf9" />
          <rect x="72" y="54" width="5" height="5" fill="#90caf9" />
          <rect x="64" y="63" width="5" height="5" fill="#90caf9" />
          <rect x="72" y="63" width="5" height="5" fill="#90caf9" />
          <rect x="64" y="72" width="5" height="5" fill="#90caf9" />
          <rect x="72" y="72" width="5" height="5" fill="#90caf9" />
          <rect x="64" y="81" width="5" height="5" fill="#90caf9" />
          <rect x="72" y="81" width="5" height="5" fill="#90caf9" />
          <rect x="84" y="58" width="18" height="52" />
          <rect x="86" y="62" width="4" height="4" fill="#90caf9" />
          <rect x="93" y="62" width="4" height="4" fill="#90caf9" />
          <rect x="86" y="70" width="4" height="4" fill="#90caf9" />
          <rect x="93" y="70" width="4" height="4" fill="#90caf9" />
          <rect x="86" y="78" width="4" height="4" fill="#90caf9" />
          <rect x="93" y="78" width="4" height="4" fill="#90caf9" />
          <rect x="104" y="65" width="16" height="45" />
          <rect x="106" y="68" width="4" height="4" fill="#90caf9" />
          <rect x="112" y="68" width="4" height="4" fill="#90caf9" />
          <rect x="106" y="76" width="4" height="4" fill="#90caf9" />
          <rect x="112" y="76" width="4" height="4" fill="#90caf9" />
          <rect x="121" y="74" width="16" height="36" />
          <rect x="123" y="78" width="3" height="3" fill="#90caf9" />
          <rect x="129" y="78" width="3" height="3" fill="#90caf9" />
          <rect x="123" y="85" width="3" height="3" fill="#90caf9" />
          <rect x="129" y="85" width="3" height="3" fill="#90caf9" />
        </g>
        <ellipse cx="100" cy="132" rx="95" ry="44" fill="#81c784" />
        <path
          d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z"
          fill="url(#grassG)"
        />
        <path
          d="M86,190 Q91,150 100,120 Q109,150 114,190 Z"
          fill="url(#roadG)"
        />
        <line
          x1="100"
          y1="178"
          x2="100"
          y2="170"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
        <line
          x1="100"
          y1="165"
          x2="100"
          y2="155"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" />
        <circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" />
        <rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" />
        <circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" />
        <rect x="151" y="142" width="3" height="7" fill="#5d4037" />
        <path
          d="M132,44 Q134,41 136,44"
          stroke="#37474f"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M142,37 Q144,34 146,37"
          stroke="#37474f"
          strokeWidth="1.2"
          fill="none"
        />
      </g>
      <circle
        cx="100"
        cy="100"
        r="87"
        fill="none"
        stroke="#4caf50"
        strokeWidth="3"
      />
      <path id="la" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text
        fontFamily="'Arial Rounded MT Bold', Arial, sans-serif"
        fontSize="17"
        fontWeight="800"
        fill="#2e7d32"
        letterSpacing="2.5"
      >
        <textPath href="#la" startOffset="7%">
          CLEAN STREETS
        </textPath>
      </text>
      <g transform="translate(12,106) rotate(-15)">
        <ellipse
          cx="0"
          cy="0"
          rx="7"
          ry="3"
          fill="#4caf50"
          transform="rotate(-35)"
        />
        <ellipse
          cx="6"
          cy="-4"
          rx="6"
          ry="2.5"
          fill="#66bb6a"
          transform="rotate(-65)"
        />
        <ellipse
          cx="-2"
          cy="5"
          rx="5"
          ry="2.5"
          fill="#388e3c"
          transform="rotate(5)"
        />
      </g>
      <g transform="translate(188,106) rotate(15) scale(-1,1)">
        <ellipse
          cx="0"
          cy="0"
          rx="7"
          ry="3"
          fill="#4caf50"
          transform="rotate(-35)"
        />
        <ellipse
          cx="6"
          cy="-4"
          rx="6"
          ry="2.5"
          fill="#66bb6a"
          transform="rotate(-65)"
        />
        <ellipse
          cx="-2"
          cy="5"
          rx="5"
          ry="2.5"
          fill="#388e3c"
          transform="rotate(5)"
        />
      </g>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user data
      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <div className="auth-panel__logo">
            <CleanStreetLogo size={110} />
          </div>
          <h1 className="auth-panel__title">
            Making Cities <span>Cleaner</span>,<br />
            One Report at a Time
          </h1>
          <p className="auth-panel__desc">
            Join thousands of active citizens helping improve their communities
            by reporting civic issues directly to local authorities.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">📍</div>
              <div className="auth-feature__text">
                <strong>Report Issues Instantly</strong>
                Snap a photo, pin the location, done in seconds.
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">🔄</div>
              <div className="auth-feature__text">
                <strong>Track in Real-Time</strong>
                Follow your complaint from submission to resolution.
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">🏙️</div>
              <div className="auth-feature__text">
                <strong>Community Impact</strong>
                See how your reports are improving your city.
              </div>
            </div>
          </div>
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat__num">1.2k</span>
              <span className="auth-stat__label">Citizens</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat__num">248</span>
              <span className="auth-stat__label">Resolved</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat__num">94%</span>
              <span className="auth-stat__label">Satisfied</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card__header">
            <button className="auth-card__back" onClick={() => navigate("/")}>
              ← Back to home
            </button>
            <h2 className="auth-card__title">Welcome back 👋</h2>
            <p className="auth-card__subtitle">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--auth-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Sign up free
              </button>
            </p>
          </div>

          <div className="auth-social" style={{ marginBottom: 20 }}>
            <button className="auth-social-btn">
              <span className="auth-social-btn__icon">🌐</span>Google
            </button>
            <button className="auth-social-btn">
              <span className="auth-social-btn__icon">📘</span>Facebook
            </button>
          </div>

          <div className="auth-divider">
            <div className="auth-divider__line" />
            <span className="auth-divider__text">or sign in with email</span>
            <div className="auth-divider__line" />
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            style={{ marginTop: 16 }}
          >
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div className="auth-group">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  className={`auth-input${error ? " auth-input--error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className={`auth-input${error ? " auth-input--error" : ""}`}
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPass((s) => !s)}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox-wrap">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <span className="auth-checkbox-label">Remember me</span>
              </label>
              <button type="button" className="auth-forgot">
                Forgot password?
              </button>
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-btn__spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
