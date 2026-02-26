import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login-Signup.css";

function Signup() {
  const [role, setRole] = useState("citizen");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("role", role);
   if (role === "admin") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}
  };

<<<<<<< HEAD
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

  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    setLoading(true);

    const res = await API.post("/api/auth/register", {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      password: form.password,
      role: form.role
    });

    setLoading(false);
    console.log("Backend response:", res.data);
    setSuccess(true);

  } catch (err) {
    setLoading(false);
    console.error("Backend error:", err.response ? err.response.data : err.message);
    alert("Registration failed: " + (err.response?.data?.message || err.message));
  }
};

  // ✅ Replaced "official" and "business" with a single "admin" role
  const roles = [
    { key: "citizen",   icon: "🧑‍💼", label: "Citizen"   },
    { key: "volunteer", icon: "🤝",   label: "Volunteer" },
    { key: "admin",     icon: "🛡️",   label: "Admin"     },
  ];

=======
>>>>>>> 0513b2d (Implemented role-based dashboards and admin complaint assignment)
  return (
    <div className="auth-page">

      {/* LEFT PANEL */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <h1 className="auth-panel__title">
            Be the Change <span>Your City Needs</span>
          </h1>
          <p className="auth-panel__desc">
            Create your free account and start making a difference.
          </p>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="auth-form-side">
        <div className="auth-card">

          <div className="auth-card__header">
            <h2 className="auth-card__title">Create Account</h2>
            <p className="auth-card__subtitle">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

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
                placeholder="Create password"
                required
              />
            </div>

            {/* ROLE SELECTOR */}
            <div className="auth-roles">
              <div
                className={`auth-role-btn ${
                  role === "citizen" ? "auth-role-btn--active" : ""
                }`}
                onClick={() => setRole("citizen")}
              >
                <span className="auth-role-btn__icon">👤</span>
                <span className="auth-role-btn__label">Citizen</span>
              </div>

              <div
                className={`auth-role-btn ${
                  role === "admin" ? "auth-role-btn--active" : ""
                }`}
                onClick={() => setRole("admin")}
              >
                <span className="auth-role-btn__icon">🏛️</span>
                <span className="auth-role-btn__label">Admin</span>
              </div>
            </div>

            <button type="submit" className="auth-btn auth-btn--green">
              Register
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Signup;