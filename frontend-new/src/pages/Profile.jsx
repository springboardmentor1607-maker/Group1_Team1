import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../Profile.css";
import Navbar from "./Navbar";
import API from "../api";
import { useParams } from "react-router-dom";


// ─── Stat Mini Card ───────────────────────────────────────────────────────────
function StatMini({ icon, value, label, colorClass }) {
    return (
        <div className={`pf-stat ${colorClass}`}>
            <span className="pf-stat__icon">{icon}</span>
            <span className="pf-stat__value">{value}</span>
            <span className="pf-stat__label">{label}</span>
        </div>
    );
}

// ─── Time helper ─────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
}

// ─── Change Password Section ──────────────────────────────────────────────────
function ChangePasswordSection({ user }) {
    const [step, setStep] = useState("idle");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(0);
    const inputRefs = React.useRef([]);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const sendOtp = async () => {
        setStep("sending");
        setMessage("");
        try {
            await API.post("/api/otp/send-reset-otp", { email: user?.email });
            setStep("otp");
            setCountdown(60);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send OTP.");
            setStep("error");
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0)
            inputRefs.current[index - 1]?.focus();
    };

    const handleReset = async () => {
        const code = otp.join("");
        if (code.length < 6) { setMessage("Enter the complete 6-digit OTP."); return; }
        if (!newPassword) { setMessage("Enter a new password."); return; }
        if (newPassword.length < 8) { setMessage("Password must be at least 8 characters."); return; }
        if (newPassword !== confirmPassword) { setMessage("Passwords do not match."); return; }
        setStep("resetting");
        try {
            await API.post("/api/otp/reset-password", { email: user?.email, otp: code, newPassword });
            setStep("done");
            setMessage("Password changed successfully ✅");
            setOtp(["", "", "", "", "", ""]);
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password.");
            setStep("otp");
        }
    };

    const inputStyle = {
        width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb",
        borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit",
        boxSizing: "border-box",
    };

    return (
        <div style={{ padding: "4px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 22 }}>🔑</span>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Password</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Change your account password via OTP verification</div>
                    </div>
                </div>
                {step === "idle" || step === "error" ? (
                    <button className="pf-btn pf-btn--outline" onClick={sendOtp}>Change Password</button>
                ) : step === "sending" ? (
                    <button className="pf-btn pf-btn--outline" disabled>Sending OTP…</button>
                ) : step === "done" ? (
                    <button className="pf-btn pf-btn--outline" onClick={() => { setStep("idle"); setMessage(""); }}>Change Again</button>
                ) : null}
            </div>

            {(step === "otp" || step === "resetting") && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                    {message && (
                        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                            ⚠️ {message}
                        </div>
                    )}
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                            Verification Code
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400, marginLeft: 8 }}>Sent to {user?.email}</span>
                        </label>
                        <div style={{ display: "flex", gap: 8 }}>
                            {otp.map((digit, i) => (
                                <input key={i} ref={el => inputRefs.current[i] = el}
                                    type="text" inputMode="numeric" maxLength={1} value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    style={{ width: 44, height: 48, textAlign: "center", fontSize: 20, fontWeight: 700, borderRadius: 8, border: `2px solid ${digit ? "#2563eb" : "#e5e7eb"}`, outline: "none", background: digit ? "#eff6ff" : "#fff" }}
                                />
                            ))}
                            <div style={{ marginLeft: 8, display: "flex", alignItems: "center", fontSize: 12, color: "#6b7280" }}>
                                {countdown > 0 ? `Resend in ${countdown}s` : (
                                    <button type="button" onClick={sendOtp} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 12 }}>Resend OTP</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>New Password</label>
                            <div style={{ position: "relative" }}>
                                <input style={inputStyle} type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>
                                    {showPass ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Confirm Password</label>
                            <input style={{ ...inputStyle, borderColor: confirmPassword && newPassword !== confirmPassword ? "#fca5a5" : "#e5e7eb" }}
                                type="password" placeholder="Repeat password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 3 }}>⚠️ Passwords do not match</div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button className="pf-btn pf-btn--primary" onClick={handleReset} disabled={step === "resetting"}>
                            {step === "resetting" ? "Resetting…" : "Reset Password →"}
                        </button>
                        <button className="pf-btn pf-btn--outline" onClick={() => { setStep("idle"); setMessage(""); setOtp(["", "", "", "", "", ""]); setNewPassword(""); setConfirmPassword(""); }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === "done" && (
                <div style={{ marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#166534" }}>
                    ✅ {message}
                </div>
            )}
        </div>
    );
}

// ─── Deactivate Account Section ───────────────────────────────────────────────
//
// WHAT DEACTIVATE DOES:
//   • Sets user.isActive = false in the database (a soft flag — data is kept).
//   • The user cannot log in while deactivated. The login endpoint should check
//     this flag and return 403 "Account deactivated".
//   • An admin can reactivate the account at any time from User Management.
//   • The user's complaints, history, and data are all preserved.
//   • Use case: user wants a break, or admin wants to suspend without full deletion.
//
// DIFFERENCE FROM DELETE:
//   • Deactivate = reversible pause  (data stays, admin can undo)
//   • Delete     = permanent removal (data gone, cannot be undone)
//
function DeactivateAccountSection({ user, logout }) {
    const navigate = useNavigate();
    // step: idle | confirm | loading | done | error
    const [step, setStep] = useState("idle");
    const [confirmText, setConfirmText] = useState("");
    const [message, setMessage] = useState("");

    // Required: user must type "DEACTIVATE" exactly to proceed
    const REQUIRED = "DEACTIVATE";
    const canProceed = confirmText.trim() === REQUIRED;

    const handleDeactivate = async () => {
        if (!canProceed) return;
        setStep("loading");
        try {
            // BACKEND ENDPOINT:
            //   PATCH /api/users/:id/deactivate
            //   Body: {} (no body needed — just the auth token in headers)
            //   Sets user.isActive = false in DB
            //   Returns: { message: "Account deactivated" }
            await API.patch(`/api/users/${user._id}/deactivate`);
            setStep("done");
            // Log out and redirect — deactivated users cannot stay logged in
            setTimeout(() => {
                logout();
                navigate("/");
            }, 2500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to deactivate account. Please try again.");
            setStep("error");
        }
    };

    return (
        <div style={{ padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, marginTop: 1 }}>🌙</span>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Deactivate Account</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, maxWidth: 420, lineHeight: 1.5 }}>
                            Temporarily disable your account. You won't be able to log in, but your data and complaints
                            are fully preserved. An admin can reactivate your account at any time.
                        </div>
                    </div>
                </div>
                {step === "idle" && (
                    <button
                        onClick={() => setStep("confirm")}
                        style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 8, border: "1.5px solid #f59e0b", background: "#fffbeb", color: "#92400e", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        Deactivate
                    </button>
                )}
                {step === "error" && (
                    <button
                        onClick={() => { setStep("idle"); setMessage(""); setConfirmText(""); }}
                        style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Try Again
                    </button>
                )}
            </div>

            {/* Confirmation form */}
            {step === "confirm" && (
                <div style={{ marginTop: 16, background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18 }}>⚠️</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Confirm Account Deactivation</span>
                    </div>
                    <ul style={{ fontSize: 12, color: "#78350f", margin: "0 0 14px 18px", lineHeight: 1.7 }}>
                        <li>You will be immediately logged out</li>
                        <li>You won't be able to log back in while deactivated</li>
                        <li>Your complaints and data remain saved</li>
                        <li>Contact an admin to reactivate your account</li>
                    </ul>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#92400e", display: "block", marginBottom: 6 }}>
                            Type <strong>DEACTIVATE</strong> to confirm:
                        </label>
                        <input
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder="DEACTIVATE"
                            style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${canProceed ? "#f59e0b" : "#e5e7eb"}`, borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={handleDeactivate}
                            disabled={!canProceed || step === "loading"}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: canProceed ? "#f59e0b" : "#e5e7eb", color: canProceed ? "#fff" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                            {step === "loading" ? "Deactivating…" : "🌙 Yes, Deactivate"}
                        </button>
                        <button
                            onClick={() => { setStep("idle"); setConfirmText(""); }}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === "done" && (
                <div style={{ marginTop: 12, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#92400e" }}>
                    🌙 Account deactivated. Logging you out…
                </div>
            )}

            {step === "error" && message && (
                <div style={{ marginTop: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                    ⚠️ {message}
                </div>
            )}
        </div>
    );
}

// ─── Delete Account Section ───────────────────────────────────────────────────
//
// CAN YOU REUSE THE ADMIN DELETE ENDPOINT?
//   YES — the admin uses PATCH /api/users/:id/role or DELETE /api/users/:id.
//   You can reuse DELETE /api/users/:id for self-deletion, BUT:
//   • The backend must verify the requesting user's ID matches the :id param
//     OR allow admins to delete any user.
//   • Add a middleware check: if (req.user._id !== req.params.id && req.user.role !== "admin") return 403
//   • This way the same endpoint serves both admin-deletes-user and user-deletes-self.
//
// WHAT HAPPENS ON DELETE:
//   • User document removed from DB permanently
//   • All their complaints can either be: anonymized (user_id = null) OR also deleted
//     — backend team should decide which. Recommended: anonymize complaints so civic data
//       is preserved even when the reporter's account is gone.
//   • Token is invalidated (if using a token blacklist or JWT expiry is short, this is automatic)
//
function DeleteAccountSection({ user, logout }) {
    const navigate = useNavigate();
    // step: idle | confirm | loading | done | error
    const [step, setStep] = useState("idle");
    const [confirmText, setConfirmText] = useState("");
    const [message, setMessage] = useState("");

    // Required: user must type their exact email address to proceed
    const REQUIRED = user?.email || "";
    const canProceed = confirmText.trim().toLowerCase() === REQUIRED.toLowerCase() && REQUIRED !== "";

    const handleDelete = async () => {
        if (!canProceed) return;
        setStep("loading");
        try {
            // BACKEND ENDPOINT (reused from admin user management):
            //   DELETE /api/users/:id
            //   Headers: Authorization: Bearer <token>
            //   Backend checks: req.user._id === req.params.id OR req.user.role === "admin"
            //   On success:
            //     1. Deletes user document from DB
            //     2. Anonymizes complaints (sets user_id = null, keeps complaint data)
            //     3. Returns: { message: "Account deleted" }
            await API.delete(`/api/users/${user._id}`);
            setStep("done");
            setTimeout(() => {
                logout();
                navigate("/");
            }, 2500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete account. Please try again.");
            setStep("error");
        }
    };

    return (
        <div style={{ paddingTop: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, marginTop: 1 }}>🗑️</span>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#dc2626" }}>Delete Account</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, maxWidth: 420, lineHeight: 1.5 }}>
                            Permanently delete your account and all personal data. Your submitted complaints will be
                            anonymized so civic data is preserved. <strong style={{ color: "#dc2626" }}>This cannot be undone.</strong>
                        </div>
                    </div>
                </div>
                {step === "idle" && (
                    <button
                        onClick={() => setStep("confirm")}
                        style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 8, border: "1.5px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        Delete Account
                    </button>
                )}
                {step === "error" && (
                    <button
                        onClick={() => { setStep("idle"); setMessage(""); setConfirmText(""); }}
                        style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Try Again
                    </button>
                )}
            </div>

            {/* Confirmation form */}
            {step === "confirm" && (
                <div style={{ marginTop: 16, background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18 }}>🚨</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>This action is permanent and irreversible</span>
                    </div>
                    <ul style={{ fontSize: 12, color: "#7f1d1d", margin: "0 0 14px 18px", lineHeight: 1.7 }}>
                        <li>Your account will be <strong>permanently deleted</strong></li>
                        <li>All personal data will be removed from our servers</li>
                        <li>Your complaints will be anonymized (civic data preserved)</li>
                        <li>You cannot log back in or recover this account</li>
                        <li>Any volunteer assignments will be unassigned</li>
                    </ul>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#991b1b", display: "block", marginBottom: 6 }}>
                            Type your email <strong>{user?.email}</strong> to confirm:
                        </label>
                        <input
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder={user?.email}
                            style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${canProceed ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={handleDelete}
                            disabled={!canProceed || step === "loading"}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: canProceed ? "#dc2626" : "#e5e7eb", color: canProceed ? "#fff" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                            {step === "loading" ? "Deleting…" : "🗑️ Yes, Delete My Account"}
                        </button>
                        <button
                            onClick={() => { setStep("idle"); setConfirmText(""); }}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === "done" && (
                <div style={{ marginTop: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                    🗑️ Account deleted. Redirecting…
                </div>
            )}

            {step === "error" && message && (
                <div style={{ marginTop: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                    ⚠️ {message}
                </div>
            )}
        </div>
    );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function Profile() {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();
    const { id: profileId } = useParams();
    const isOwnProfile = !profileId;

    const [viewedUser, setViewedUser] = useState(null);
    const displayUser = isOwnProfile ? user : viewedUser;

    useEffect(() => {
        if (!profileId) return;
        API.get(`/api/users/${profileId}`)
            .then(res => setViewedUser(res.data))
            .catch(() => setViewedUser(null));
    }, [profileId]);

    const [stats, setStats] = useState({ reports: 0, resolved: 0, votes: 0, badges: 0 });
    const [complaints, setComplaints] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setActivityLoading(true);
                const role = user?.role || JSON.parse(localStorage.getItem("user") || "{}").role || "user";
                let raw = [];

                if (role === "admin") {
                    const res = await API.get("/api/complaints");
                    if (Array.isArray(res.data)) raw = res.data;
                    else if (Array.isArray(res.data?.complaints)) raw = res.data.complaints;
                    else if (Array.isArray(res.data?.data)) raw = res.data.data;
                    setComplaints(raw);
                    setStats({ reports: raw.length, resolved: raw.filter(c => ["resolved", "completed"].includes(c.status)).length, votes: 0, badges: 0 });
                } else {
                    const endpoint = role === "volunteer" ? "/api/complaints/my-assignments" : "/api/complaints/my";
                    const res = await API.get(endpoint);
                    if (Array.isArray(res.data)) raw = res.data;
                    else if (Array.isArray(res.data?.complaints)) raw = res.data.complaints;
                    else if (Array.isArray(res.data?.data)) raw = res.data.data;
                    setComplaints(raw);
                    const reports = raw.length;
                    const resolved = raw.filter(c => ["resolved", "completed"].includes(c.status)).length;
                    const votes = raw.reduce((sum, c) => sum + (Number(c.upvotes) || 0), 0);
                    let badges = 0;
                    if (role === "volunteer") { if (reports >= 1) badges++; if (resolved >= 5) badges++; }
                    else { if (reports >= 1) badges++; if (votes >= 10) badges++; if (resolved >= 5) badges++; }
                    setStats({ reports, resolved, votes, badges });
                }
            } catch (err) {
                console.error("[Profile] fetch failed:", err?.response?.status, err?.message);
            } finally {
                setActivityLoading(false);
            }
        };
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initialData = {
        username: user?.username || "",
        email: user?.email || "",
        fullName: user?.name || "",
        phone: user?.phone || "",
        location: user?.location || user?.address || "",
        bio: user?.bio || "",
    };

    const [formData, setFormData] = useState(initialData);
    const [savedData, setSavedData] = useState(initialData);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [locating, setLocating] = useState(false);

    function Profile() {

  const [saving, setSaving] = useState(false);

  const buildForm = (user) => {
    return {
      name: user?.name || "",
      email: user?.email || "",
    };
  };

  useEffect(() => {
    if (user) {
      const data = buildForm(user);
      setFormData(data);
      setSavedData(data);
    }
  }, [user?._id, user?.id]);

}

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) return setMessage("Geolocation not supported ❌");
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                    );
                    const data = await res.json();
                    setFormData(prev => ({ ...prev, location: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
                } catch { setMessage("Could not fetch address ❌"); }
                finally { setLocating(false); }
            },
            () => { setMessage("Location access denied ❌"); setLocating(false); }
        );
    };

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleEdit = () => { setEditMode(true); setMessage(""); };
    const handleCancel = () => { setFormData(savedData); setEditMode(false); setMessage(""); };
    const handleSave = () => {
        setSavedData(formData);
        updateUser({ name: formData.fullName, username: formData.username, email: formData.email, phone: formData.phone, address: formData.location, bio: formData.bio });
        setEditMode(false);
        setMessage("Profile updated successfully ✅");
    };

    const handleLogout = () => { logout(); navigate("/"); };

    const fields = [
        { name: "username", label: "Username", icon: "👤", type: "text" },
        { name: "email", label: "Email", icon: "✉️", type: "email" },
        { name: "fullName", label: "Full Name", icon: "🪪", type: "text" },
        { name: "phone", label: "Phone Number", icon: "📞", type: "tel" },
    ];

    const tabs = ["info", "activity", "security"];
    const avatarText = savedData.fullName ? savedData.fullName.substring(0, 2).toUpperCase() : "DU";
    const memberSince = user?.createdAt || user?.memberSince
        ? new Date(user.createdAt || user.memberSince).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
          })
        : "July 2025";

    return (
        <div className="pf-page">
            <Navbar />
            <div className="pf-body">

                {/* ── Hero strip ── */}
                <div className="pf-hero">
                    <div className="pf-hero__text">
                        <p className="pf-hero__eyebrow">👤 My Profile</p>
                        <h1 className="pf-hero__title">{savedData.fullName}</h1>
                        <p className="pf-hero__sub">@{savedData.username} · Member since {memberSince}</p>
                    </div>
                    {user?.role !== "admin" && (
                        <div className="pf-hero__stats">
                            <StatMini icon="⚠️" value={stats.reports} label="Reports" colorClass="pf-stat--blue" />
                            <StatMini icon="✅" value={stats.resolved} label="Resolved" colorClass="pf-stat--green" />
                            {user?.role !== "volunteer" && <StatMini icon="👍" value={stats.votes} label="Votes" colorClass="pf-stat--purple" />}
                            <StatMini icon="🏅" value={stats.badges} label="Badges" colorClass="pf-stat--yellow" />
                        </div>
                    )}
                </div>

                {/* ── Main grid ── */}
                <div className="pf-grid">

                    {/* ─── LEFT SIDEBAR ─── */}
                    <aside className="pf-sidebar">
                        <div className="pf-avatar-card">
                            <div className="pf-avatar-card__ring">
                                <div className="pf-avatar-card__circle">{avatarText}</div>
                            </div>
                            <h2 className="pf-avatar-card__name">{savedData.fullName}</h2>
                            <p className="pf-avatar-card__username">@{savedData.username}</p>
                            <span className="pf-role-badge">🧑‍💼 {user?.role === "user" ? "Citizen" : user?.role || "user"}</span>
                            <p className="pf-avatar-card__bio">{savedData.bio}</p>
                            <div className="pf-avatar-card__divider" />
                            <div className="pf-avatar-card__meta">
                                <span>📍 {savedData.location || "—"}</span>
                                <span>📞 {savedData.phone    || "—"}</span>
                                <span>✉️ {savedData.email    || "—"}</span>
                            </div>
                            <p className="pf-avatar-card__since">Member since {memberSince}</p>
                        </div>

                        {user?.role !== "admin" && (
                            <div className="pf-badges-card">
                                <div className="pf-badges-card__title">🏅 Civic Badges</div>
                                <div className="pf-badges-list">
                                    <div className={`pf-badge-item${stats.reports < 1 ? " pf-badge-item--locked" : ""}`}>
                                        <span className="pf-badge-item__icon">{stats.reports >= 1 ? "🌟" : "🔒"}</span>
                                        <div>
                                            <div className="pf-badge-item__name">{user?.role === "volunteer" ? "First Assignment" : "First Report"}</div>
                                            <div className="pf-badge-item__desc">{user?.role === "volunteer" ? "Received your first assignment" : "Submitted your first civic issue"}</div>
                                        </div>
                                    </div>
                                    {user?.role !== "volunteer" && (
                                        <div className={`pf-badge-item${stats.votes < 10 ? " pf-badge-item--locked" : ""}`}>
                                            <span className="pf-badge-item__icon">{stats.votes >= 10 ? "🤝" : "🔒"}</span>
                                            <div>
                                                <div className="pf-badge-item__name">Community Helper</div>
                                                <div className="pf-badge-item__desc">{stats.votes >= 10 ? "Voted on 10+ community issues" : `${stats.votes}/10 votes to unlock`}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`pf-badge-item${stats.resolved < 5 ? " pf-badge-item--locked" : ""}`}>
                                        <span className="pf-badge-item__icon">{stats.resolved >= 5 ? "🏆" : "🔒"}</span>
                                        <div>
                                            <div className="pf-badge-item__name">Street Champion</div>
                                            <div className="pf-badge-item__desc">{stats.resolved >= 5 ? "Got 5 issues resolved!" : `${stats.resolved}/5 resolved to unlock`}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* ─── RIGHT MAIN PANEL ─── */}
                    <div className="pf-main">

                        <div className="pf-tabs">
                            {tabs.map(tab => (
                                <button key={tab} className={`pf-tab${activeTab === tab ? " pf-tab--active" : ""}`} onClick={() => setActiveTab(tab)}>
                                    {tab === "info" && "📋 Account Info"}
                                    {tab === "activity" && "🕐 Activity"}
                                    {tab === "security" && "🔒 Security"}
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Account Info ── */}
                        {activeTab === "info" && (
                            <div className="pf-card pf-anim">
                                <div className="pf-card__header">
                                    <div>
                                        <h2 className="pf-card__title">Account Information</h2>
                                        <p className="pf-card__sub">Update your personal details below</p>
                                    </div>
                                    {!editMode ? (
                                        <button className="pf-btn pf-btn--primary" onClick={handleEdit}>
                                            ✏️ Edit Profile
                                        </button>
                                    ) : (
                                        <div className="pf-btn-group">
                                            <button
                                                className="pf-btn pf-btn--outline"
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="pf-btn pf-btn--primary"
                                                onClick={handleSave}
                                                disabled={saving}
                                            >
                                                {saving ? "Saving…" : "💾 Save Changes"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="pf-form-grid">
                                    {fields.map(f => (
                                        <div key={f.name} className="pf-form-group">
                                            <label className="pf-label">{f.icon} {f.label}</label>
                                            <input className={`pf-input${editMode ? " pf-input--active" : ""}`} type={f.type} name={f.name} value={formData[f.name]} disabled={!editMode} onChange={handleChange} />
                                        </div>
                                    ))}
                                    <div className="pf-form-group">
                                        <label className="pf-label">📍 Location</label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input className={`pf-input${editMode ? " pf-input--active" : ""}`} name="location" value={formData.location} disabled={!editMode} onChange={handleChange} style={{ flex: 1 }} />
                                            {editMode && (
                                                <button type="button" onClick={handleUseCurrentLocation} disabled={locating}
                                                    style={{ whiteSpace: "nowrap", padding: "0 14px", borderRadius: 8, border: "1px solid #e5e9f2", background: "#f4f6fb", color: "#374151", fontSize: 13, fontWeight: 500, cursor: locating ? "not-allowed" : "pointer", opacity: locating ? 0.7 : 1 }}>
                                                    {locating ? "Locating…" : "📍 Use Current"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pf-form-group pf-form-group--full">
                                        <label className="pf-label">Bio</label>
                                        <textarea className={`pf-input pf-textarea${editMode ? " pf-input--active" : ""}`} name="bio" value={formData.bio} disabled={!editMode} onChange={handleChange} />
                                    </div>
                                </div>
                                {message && <div className="pf-success">{message}</div>}
                            </div>
                        )}

                        {/* ── Tab: Activity ── */}
                        {activeTab === "activity" && (
                            <div className="pf-card pf-anim">
                                <div className="pf-card__header">
                                    <div>
                                        <h2 className="pf-card__title">Recent Activity</h2>
                                        <p className="pf-card__sub">Your latest actions on CleanStreet</p>
                                    </div>
                                </div>
                                <div className="pf-activity-list">
                                    {activityLoading ? (
                                        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                                            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                                            <div style={{ fontSize: 14 }}>Loading activity…</div>
                                        </div>
                                    ) : complaints.length === 0 ? (
                                        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                                            <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>No activity yet</div>
                                            <div style={{ fontSize: 12, marginTop: 4 }}>
                                                {user?.role === "admin" ? "No complaints have been submitted yet." : user?.role === "volunteer" ? "No assignments yet." : "Start by reporting a civic issue in your area!"}
                                            </div>
                                        </div>
                                    ) : (
                                        [...complaints]
                                            .sort((a, b) =>
                                                new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt) -
                                                new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt)
                                            )
                                            .slice(0, 10)
                                            .map((c, i) => {
                                                const status = c.status || "received";
                                                const dateStr = c.updated_at || c.updatedAt || c.created_at || c.createdAt;
                                                const STATUS_DISPLAY = {
                                                    completed: { icon: "🏆", color: "#10b981", verb: "completed" },
                                                    resolved: { icon: "🎉", color: "#22c55e", verb: "resolved" },
                                                    denied: { icon: "🚫", color: "#ef4444", verb: "denied" },
                                                    accepted: { icon: "✅", color: "#16a34a", verb: "accepted" },
                                                    in_progress: { icon: "🔄", color: "#8b5cf6", verb: "in progress" },
                                                    in_review: { icon: "🔄", color: "#8b5cf6", verb: "in review" },
                                                    assigned: { icon: "👤", color: "#f59e0b", verb: "assigned" },
                                                    received: { icon: "➕", color: "#3b82f6", verb: "submitted" },
                                                    pending: { icon: "➕", color: "#3b82f6", verb: "submitted" },
                                                };
                                                const disp = STATUS_DISPLAY[status] || STATUS_DISPLAY.received;
                                                const text = user?.role === "admin"
                                                    ? `${c.user_id?.name || "A citizen"} reported: "${c.title}" — ${disp.verb}`
                                                    : user?.role === "volunteer"
                                                        ? `"${c.title}" marked as ${disp.verb}`
                                                        : status === "received" || status === "pending"
                                                            ? `Reported: ${c.title}`
                                                            : `"${c.title}" is now ${disp.verb}`;
                                                return (
                                                    <div key={c._id || i} className="pf-activity-item">
                                                        <div className="pf-activity-item__icon" style={{ background: disp.color + "18", color: disp.color }}>{disp.icon}</div>
                                                        <div className="pf-activity-item__body">
                                                            <p className="pf-activity-item__text">{text}</p>
                                                            <p className="pf-activity-item__time">{timeAgo(dateStr)}</p>
                                                        </div>
                                                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, background: disp.color + "18", color: disp.color, whiteSpace: "nowrap" }}>
                                                            {status.replace("_", " ").toUpperCase()}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Security ── */}
                        {activeTab === "security" && (
                            <div className="pf-anim">

                                {/* ── Change Password ── */}
                                <div className="pf-card" style={{ marginBottom: 16 }}>
                                    <div className="pf-card__header">
                                        <div>
                                            <h2 className="pf-card__title">Security Settings</h2>
                                            <p className="pf-card__sub">Manage your password and account security</p>
                                        </div>
                                    </div>
                                    <ChangePasswordSection user={user} />
                                </div>

                                {/* ── Danger Zone ── */}
                                <div className="pf-danger-card">
                                    <div style={{ marginBottom: 20 }}>
                                        <h3 className="pf-danger-card__title">⚠️ Danger Zone</h3>
                                        <p className="pf-danger-card__sub">These actions affect your account access and data. Please read carefully before proceeding.</p>
                                    </div>

                                    {/* Log Out row */}
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, paddingBottom: 16, borderBottom: "1px solid #fee2e2", marginBottom: 16 }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                            <span style={{ fontSize: 22, marginTop: 1 }}>🚪</span>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Log Out</div>
                                                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Sign out of your current session on this device.</div>
                                            </div>
                                        </div>
                                        <button
                                            className="pf-btn pf-btn--danger"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to log out?")) {
                                                    logout();
                                                    navigate("/");
                                                }
                                            }}
                                            style={{ flexShrink: 0 }}>
                                            🚪 Log Out
                                        </button>
                                    </div>

                                    {/* Deactivate Account */}
                                    <div style={{ paddingBottom: 16, borderBottom: "1px solid #fee2e2", marginBottom: 16 }}>
                                        <DeactivateAccountSection user={user} logout={logout} />
                                    </div>

                                    {/* Delete Account */}
                                    <DeleteAccountSection user={user} logout={logout} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
