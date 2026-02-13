import { useState } from "react";
import { Link } from "react-router-dom";
import "../cleanstreet.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with your API call
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // localStorage.setItem("token", data.token);
      // navigate("/dashboard");
      await new Promise((r) => setTimeout(r, 1000)); // remove this line when API is ready
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-page">

      {/* ── Navbar ── */}
      <nav className="cs-navbar">
        <div className="cs-navbar__brand">
          <div className="cs-navbar__logo">🔁</div>
          <span className="cs-navbar__name">CleanStreet</span>
        </div>
        <div className="cs-navbar__links">
          <Link to="/"           className="cs-navbar__link">Dashboard</Link>
          <Link to="/report"     className="cs-navbar__link">Report Issue</Link>
          <Link to="/complaints" className="cs-navbar__link">View Complaints</Link>
        </div>
        <div className="cs-navbar__actions">
          <Link to="/login">
            <button className="cs-btn cs-btn--outline cs-btn--sm cs-navbar__link--active">Login</button>
          </Link>
          <Link to="/signup">
            <button className="cs-btn--register">Register</button>
          </Link>
        </div>
      </nav>

      {/* ── Auth Layout ── */}
      <div className="cs-center-layout">
        <div className="cs-auth-card">

          {/* Logo + Title */}
          <div className="cs-auth-card__logo">
            <div className="cs-navbar__logo" style={{ width: 44, height: 44, fontSize: 22, margin: "0 auto 12px" }}>🔁</div>
            <h1 className="cs-auth-card__title">Login to CleanStreet</h1>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="cs-alert cs-alert--error">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="cs-form-group">
              <label className="cs-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="cs-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="cs-form-group">
              <label className="cs-label" htmlFor="password">Password</label>
              <div className="cs-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="cs-input cs-input--password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cs-input-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="cs-btn cs-btn--primary cs-btn--full cs-btn--lg"
              disabled={loading}
            >
              {loading ? <span className="cs-spinner" /> : "Login"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="cs-auth-card__footer">
            Don't have an account?{" "}
            <Link to="/signup" className="cs-auth-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
