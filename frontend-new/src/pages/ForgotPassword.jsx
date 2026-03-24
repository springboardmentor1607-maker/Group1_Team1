import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login-Signup.css";
import API from "../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    setError("");
    try {
      await API.post("/api/otp/send-reset-otp", { email });
      setSent(true);
      // Navigate to reset password page with email
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <div style={{ fontSize: 80, marginBottom: 24 }}>🔑</div>
          <h1 className="auth-panel__title">
            Forgot Your <span>Password?</span>
          </h1>
          <p className="auth-panel__desc">
            No worries! Enter your registered email address and we'll send
            you a verification code to reset your password.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">📧</div>
              <div className="auth-feature__text">
                <strong>Check Your Email</strong>
                We'll send a 6-digit OTP to your registered email.
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">⏱️</div>
              <div className="auth-feature__text">
                <strong>Quick & Secure</strong>
                The OTP expires in 10 minutes for your safety.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card__header">
            <button className="auth-card__back" onClick={() => navigate("/login")}>← Back to Login</button>
            <h2 className="auth-card__title">Reset password 🔒</h2>
            <p className="auth-card__subtitle">
              Enter your email and we'll send you a reset code
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>OTP Sent!</div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>Redirecting to reset password page…</div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 8 }}>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 6 }}>
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? <><span className="auth-btn__spinner" />Sending OTP…</> : "Send Reset Code →"}
              </button>

              <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#6b7280" }}>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{ background: "none", border: "none", color: "var(--auth-primary)", fontWeight: 600, cursor: "pointer", padding: 0, font: "inherit" }}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
