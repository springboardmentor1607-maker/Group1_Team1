import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Login-Signup.css";
import API from "../api";

function getStrength(password) {
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  const strength = getStrength(newPassword);
  const isNavigatingAway = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    if (!newPassword) { setError("Please enter a new password."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError("");
    try {
      await API.post("/api/otp/reset-password", {
        email,
        otp: code,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        isNavigatingAway.current = true;
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new Event("openLoginModal"));
        }, 300);
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await API.post("/api/otp/send-reset-otp", { email });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div className="auth-card" style={{ maxWidth: 420, textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Password Reset!</h2>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>Your password has been reset successfully. Redirecting to login…</p>
          <div style={{ width: 48, height: 4, background: "var(--auth-primary)", borderRadius: 9999, margin: "0 auto", animation: "grow 2.5s linear forwards" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <div style={{ fontSize: 80, marginBottom: 24 }}>🔐</div>
          <h1 className="auth-panel__title">
            Create New <span>Password</span>
          </h1>
          <p className="auth-panel__desc">
            Enter the OTP sent to your email along with your new password.
            Make sure it's strong and memorable.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">✅</div>
              <div className="auth-feature__text">
                <strong>At least 8 characters</strong>
                Use a mix of letters, numbers, and symbols.
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">🛡️</div>
              <div className="auth-feature__text">
                <strong>Keep it private</strong>
                Never share your password with anyone.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card__header">
            <button className="auth-card__back" onClick={() => {
              isNavigatingAway.current = true;
              navigate("/");
              setTimeout(() => {
                window.dispatchEvent(new Event("openLoginModal"));
              }, 300);
            }}>← Back</button>
            <h2 className="auth-card__title">Set new password 🔑</h2>
            <p className="auth-card__subtitle">
              Code sent to <strong>{email}</strong>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 8 }}>
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", gap: 6 }}>
                ⚠️ {error}
              </div>
            )}

            {/* OTP boxes */}
            <div className="auth-group">
              <label className="auth-label">Verification Code</label>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "8px 0 4px" }} onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    style={{
                      width: 46, height: 52, textAlign: "center", fontSize: 22,
                      fontWeight: 700, borderRadius: 10,
                      border: `2px solid ${digit ? "var(--auth-primary)" : "#e5e7eb"}`,
                      outline: "none", color: "#111827",
                      background: digit ? "#eff6ff" : "#fff",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 6 }}>
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button type="button" onClick={handleResend} disabled={resending}
                    style={{ background: "none", border: "none", color: "var(--auth-primary)", fontWeight: 600, cursor: "pointer", padding: 0, font: "inherit" }}>
                    {resending ? "Sending…" : "Resend OTP"}
                  </button>
                )}
              </div>
            </div>

            {/* New password */}
            <div className="auth-group">
              <label className="auth-label">New Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setError(""); }}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-input-toggle" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {newPassword && (
                <div className="auth-strength">
                  <div className="auth-strength__bar">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`auth-strength__seg${strength.score >= i ? ` auth-strength__seg--${strength.color}` : ""}`} />
                    ))}
                  </div>
                  {strength.label && <span className={`auth-strength__label auth-strength__label--${strength.color}`}>{strength.label}</span>}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="auth-group">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-input-toggle" onClick={() => setShowConfirm(s => !s)} tabIndex={-1}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>⚠️ Passwords do not match</div>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✅ Passwords match</div>
              )}
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? <><span className="auth-btn__spinner" />Resetting…</> : "Reset Password →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}