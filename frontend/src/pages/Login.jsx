import React from "react";
import { useNavigate } from "react-router-dom";
import "../Login-Signup.css";

function Login() {
  const navigate = useNavigate();
  
const handleLogin = () => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole) {
    alert("No account found. Please register first.");
    return;
  }

  if (storedRole === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
};
  return (
    <div className="auth-page">

      {/* LEFT PANEL */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <h1 className="auth-panel__title">
            Welcome Back
          </h1>
          <p className="auth-panel__desc">
            Login to manage complaints and city reports.
          </p>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="auth-form-side">
        <div className="auth-card">

          <div className="auth-card__header">
            <h2 className="auth-card__title">Login</h2>
            <p className="auth-card__subtitle">
              Don’t have an account? <a href="/">Sign up</a>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>

            <div className="auth-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                className="auth-input auth-input--no-icon"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                className="auth-input auth-input--no-icon"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;