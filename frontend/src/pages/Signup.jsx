import { useState } from "react";
import { Link } from "react-router-dom";
import "../cleanstreet.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.fullName.trim())  return "Full name is required.";
    if (!formData.username.trim())  return "Username is required.";
    if (!formData.email.trim())     return "Email is required.";
    if (!formData.email.includes("@")) return "Enter a valid email address.";
    if (!formData.password)         return "Password is required.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      // TODO: replace with your API call
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: formData.fullName,
      //     username: formData.username,
      //     email: formData.email,
      //     phone: formData.phone,
      //     password: formData.password,
      //   }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // navigate("/login");
      await new Promise((r) => setTimeout(r, 1000)); // remove this line when API is ready
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            <button className="cs-btn cs-btn--outline cs-btn--sm">Login</button>
          </Link>
          <Link to="/signup">
            <button className="cs-btn--register cs-navbar__link--active">Register</button>
          </Link>
        </div>
      </nav>

      {/* ── Auth Layout ── */}
      <div className="cs-center-layout">
        <div className="cs-auth-card">

          {/* Logo + Title */}
          <div className="cs-auth-card__logo">
            <div className="cs-navbar__logo" style={{ width: 44, height: 44, fontSize: 22, margin: "0 auto 12px" }}>🔁</div>
            <h1 className="cs-auth-card__title">Register for CleanStreet</h1>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="cs-alert cs-alert--error">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="cs-form-group">
              <label className="cs-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="cs-input"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {/* Username */}
            <div className="cs-form-group">
              <label className="cs-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="cs-input"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            {/* Email */}
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

            {/* Phone (optional) */}
            <div className="cs-form-group">
              <label className="cs-label" htmlFor="phone">
                Phone Number <span className="cs-label--optional">(Optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="cs-input"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div className="cs-form-group">
              <label className="cs-label" htmlFor="password">Password</label>
              <div className="cs-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="cs-input cs-input--password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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
              {/* Password strength hint */}
              {formData.password && (
                <div className={`cs-password-hint ${formData.password.length >= 6 ? "cs-password-hint--strong" : "cs-password-hint--weak"}`}>
                  {formData.password.length >= 6 ? "✅ Strong enough" : `${6 - formData.password.length} more characters needed`}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="cs-btn cs-btn--primary cs-btn--full cs-btn--lg"
              disabled={loading}
            >
              {loading ? <span className="cs-spinner" /> : "Register"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="cs-auth-card__footer">
            Already have an account?{" "}
            <Link to="/login" className="cs-auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
