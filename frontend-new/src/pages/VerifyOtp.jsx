import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Login-Signup.css";
import API from "../api";

export default function VerifyOtp() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  // ✅ Destructure location from state — passed from Signup
  const { email, name, password, role, location: userLocation } = location.state || {};

  const [otp,        setOtp]        = useState(["","","","","",""]);
  const [loading,    setLoading]    = useState(false);
  const [resending,  setResending]  = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);
  const [countdown,  setCountdown]  = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => { if (!email) navigate("/signup"); }, [email, navigate]);

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
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setLoading(true);
    try {
      // ✅ Send location to backend so it's saved on User creation
      await API.post("/api/otp/verify-register-otp", {
        email,
        otp:      code,
        name,
        password,
        role,
        location: userLocation || "",   // ✅ IMPORTANT — saves location on User
      });

      setSuccess(true);

      // Auto-login after registration
      setTimeout(async () => {
        try {
          const loginRes  = await API.post("/api/auth/login", { email, password });
          const loginData = loginRes.data;
          localStorage.setItem("token", loginData.token);
          login(loginData);
          const userRole = loginData.role || role;
          navigate(userRole === "admin" ? "/admin" : userRole === "volunteer" ? "/volunteer" : "/dashboard");
        } catch {
          navigate("/login");
        }
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["","","","","",""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await API.post("/api/otp/send-register-otp", { email, name, password, role });
      setCountdown(60);
      setOtp(["","","","","",""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
        <div className="auth-card" style={{ maxWidth:440, textAlign:"center", padding:"60px 40px" }}>
          <div style={{ fontSize:72, marginBottom:20 }}>🎉</div>
          <h2 style={{ fontSize:26, fontWeight:800, color:"#111827", marginBottom:8 }}>Account Created!</h2>
          <p style={{ color:"#6b7280", fontSize:15, marginBottom:8 }}>Welcome to CleanStreet, <strong>{name}</strong>!</p>
          <p style={{ color:"#9ca3af", fontSize:13, marginBottom:28 }}>Your email has been verified. Redirecting you to your dashboard…</p>
          <div style={{ width:56, height:5, background:"var(--auth-primary)", borderRadius:9999, margin:"0 auto", animation:"grow 2.5s linear forwards" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <div style={{ fontSize:80, marginBottom:24 }}>📧</div>
          <h1 className="auth-panel__title">Check Your <span>Email</span></h1>
          <p className="auth-panel__desc">
            We've sent a 6-digit verification code to your email address.
            Enter it to complete your registration.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature__icon">🔐</div>
              <div className="auth-feature__text"><strong>Secure Verification</strong> OTP expires in 10 minutes for your security.</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature__icon">📬</div>
              <div className="auth-feature__text"><strong>Check Spam Folder</strong> If you don't see it, check your spam or junk folder.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card__header">
            <button className="auth-card__back" onClick={() => navigate("/signup")}>← Back to Sign Up</button>
            <h2 className="auth-card__title">Verify your email ✉️</h2>
            <p className="auth-card__subtitle">We sent a code to <strong>{email}</strong></p>
          </div>

          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#dc2626", display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
              ⚠️ {error}
            </div>
          )}

          {/* OTP boxes */}
          <div style={{ display:"flex", gap:10, justifyContent:"center", margin:"28px 0" }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i}
                ref={el => inputRefs.current[i] = el}
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width:52, height:58, textAlign:"center", fontSize:24, fontWeight:700,
                  borderRadius:12, border:`2px solid ${digit ? "var(--auth-primary)" : "#e5e7eb"}`,
                  outline:"none", color:"#111827", background:digit ? "#eff6ff" : "#fff",
                  transition:"all 0.15s",
                  boxShadow: digit ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
                }}
              />
            ))}
          </div>

          <button className="auth-btn" onClick={handleVerify} disabled={loading || otp.join("").length < 6} style={{ marginBottom:16 }}>
            {loading ? <><span className="auth-btn__spinner" />Verifying…</> : "Verify & Create Account →"}
          </button>

          <div style={{ textAlign:"center", fontSize:14, color:"#6b7280" }}>
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span style={{ color:"#9ca3af" }}>Resend in {countdown}s</span>
            ) : (
              <button onClick={handleResend} disabled={resending}
                style={{ background:"none", border:"none", color:"var(--auth-primary)", fontWeight:600, cursor:"pointer", padding:0, font:"inherit" }}>
                {resending ? "Sending…" : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
