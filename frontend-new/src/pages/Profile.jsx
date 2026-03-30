import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../Profile.css";
import Navbar from "./Navbar";
import API from "../api";

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
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)   return "Just now";
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    if (days  === 1) return "Yesterday";
    return `${days}d ago`;
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function Profile() {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();

    // ── Real stats + activity fetched from complaints API ──────────────────
    const [stats, setStats]           = useState({ reports: 0, resolved: 0, votes: 0, badges: 0 });
    const [complaints, setComplaints] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setActivityLoading(true);
                const role = user?.role
                    || JSON.parse(localStorage.getItem("user") || "{}").role
                    || "user";

                let raw = [];

                if (role === "admin") {
                    const res = await API.get("/api/complaints");
                    if (Array.isArray(res.data))                  raw = res.data;
                    else if (Array.isArray(res.data?.complaints)) raw = res.data.complaints;
                    else if (Array.isArray(res.data?.data))       raw = res.data.data;

                    setComplaints(raw);
                    setStats({
                        reports:  raw.length,
                        resolved: raw.filter(c => ["resolved","completed"].includes(c.status)).length,
                        votes:    0,
                        badges:   0,
                    });
                } else {
                    const endpoint = role === "volunteer"
                        ? "/api/complaints/my-assignments"
                        : "/api/complaints/my";

                    const res = await API.get(endpoint);
                    if (Array.isArray(res.data))                  raw = res.data;
                    else if (Array.isArray(res.data?.complaints)) raw = res.data.complaints;
                    else if (Array.isArray(res.data?.data))       raw = res.data.data;

                    setComplaints(raw);

                    const reports  = raw.length;
                    const resolved = raw.filter(c => ["resolved","completed"].includes(c.status)).length;
                    const votes    = raw.reduce((sum, c) => sum + (Number(c.upvotes) || 0), 0);
                    let badges = 0;
                    if (role === "volunteer") {
                        if (reports >= 1)  badges += 1;
                        if (resolved >= 5) badges += 1;
                    } else {
                        if (reports >= 1)  badges += 1;
                        if (votes >= 10)   badges += 1;
                        if (resolved >= 5) badges += 1;
                    }
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

    // ── Build form data from user ──────────────────────────────────────────
    const buildForm = (u) => ({
        username: u?.username || "",
        email:    u?.email    || "",
        fullName: u?.name     || "",
        phone:    u?.phone    || "",
        location: u?.location || "",
        bio:      u?.bio      || "",
    });

    const [formData, setFormData]   = useState(() => buildForm(user));
    const [savedData, setSavedData] = useState(() => buildForm(user));
    const [editMode, setEditMode]   = useState(false);
    const [saving, setSaving]       = useState(false);
    const [message, setMessage]     = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [locating, setLocating]   = useState(false);

    // Re-sync form when user loads/changes — check both _id and id
    useEffect(() => {
        const data = buildForm(user);
        setFormData(data);
        setSavedData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id, user?.id]);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) return setMessage("Geolocation not supported by your browser ❌");
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                    );
                    const data = await res.json();
                    const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                    setFormData(prev => ({ ...prev, location: address }));
                } catch {
                    setMessage("Could not fetch address ❌");
                } finally {
                    setLocating(false);
                }
            },
            () => { setMessage("Location access denied ❌"); setLocating(false); }
        );
    };

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleEdit   = () => { setEditMode(true); setMessage(""); };
    const handleCancel = () => { setFormData(savedData); setEditMode(false); setMessage(""); };

    // ─────────────────────────────────────────────────────────────────────────
    // FIX: handleSave now calls PATCH /api/users/:id so changes persist after
    // refresh. Previously it only updated localStorage — backend never knew.
    // ─────────────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        // Support both _id (MongoDB) and id (some backends serialize as id)
        const userId = user?._id || user?.id;
        if (!userId) {
            setMessage("Session error — please log in again ❌");
            return;
        }
        setSaving(true);
        setMessage("");
        try {
            const payload = {
                name:     formData.fullName,
                username: formData.username,
                email:    formData.email,
                phone:    formData.phone,
                address:  formData.location,   // backend field is "address" not "location"
                location: formData.location,   // also send location for any updated backend
                bio:      formData.bio,
            };

            // Ensure token is in the header before calling
            const token = localStorage.getItem("token");
            if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Backend route is PUT /api/users/profile (token identifies the user)
            const res = await API.put("/api/users/profile", payload);

            // Backend returns { _id, name, email, phone, location, role }
            // Merge response back into context so all components see updated data
            const updated = res.data || {};
            updateUser({
                name:     updated.name     || payload.name,
                email:    updated.email    || payload.email,
                phone:    updated.phone    || payload.phone,
                location: updated.location || payload.location,
                username: payload.username,
                bio:      payload.bio,
            });

            setSavedData(formData);
            setEditMode(false);
            setMessage("Profile updated successfully ✅");
        } catch (err) {
            console.error("[Profile] save failed:", err?.response?.status, err?.response?.data, err.message);
            const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to save changes ❌";
            setMessage(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => { logout(); navigate("/login"); };

    const fields = [
        { name: "username", label: "Username",    icon: "👤", type: "text"  },
        { name: "email",    label: "Email",        icon: "✉️", type: "email" },
        { name: "fullName", label: "Full Name",    icon: "🪪", type: "text"  },
        { name: "phone",    label: "Phone Number", icon: "📞", type: "tel"   },
    ];

    const tabs = ["info", "activity", "security"];
    const avatarText = savedData.fullName
        ? savedData.fullName.substring(0, 2).toUpperCase()
        : "DU";

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
                        <h1 className="pf-hero__title">{savedData.fullName || "Your Name"}</h1>
                        <p className="pf-hero__sub">
                            @{savedData.username} · Member since {memberSince}
                        </p>
                    </div>

                    {user?.role !== "admin" && (
                        <div className="pf-hero__stats">
                            <StatMini icon="⚠️" value={stats.reports}  label="Reports"  colorClass="pf-stat--blue"   />
                            <StatMini icon="✅" value={stats.resolved} label="Resolved" colorClass="pf-stat--green"  />
                            {user?.role !== "volunteer" && (
                                <StatMini icon="👍" value={stats.votes} label="Votes" colorClass="pf-stat--purple" />
                            )}
                            <StatMini icon="🏅" value={stats.badges}   label="Badges"   colorClass="pf-stat--yellow" />
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
                            <span className="pf-role-badge">
                                🧑‍💼 {user?.role === "user" ? "Citizen" : user?.role || "user"}
                            </span>
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
                                            <div className="pf-badge-item__name">
                                                {user?.role === "volunteer" ? "First Assignment" : "First Report"}
                                            </div>
                                            <div className="pf-badge-item__desc">
                                                {user?.role === "volunteer"
                                                    ? "Received your first assignment"
                                                    : "Submitted your first civic issue"}
                                            </div>
                                        </div>
                                    </div>
                                    {user?.role !== "volunteer" && (
                                        <div className={`pf-badge-item${stats.votes < 10 ? " pf-badge-item--locked" : ""}`}>
                                            <span className="pf-badge-item__icon">{stats.votes >= 10 ? "🤝" : "🔒"}</span>
                                            <div>
                                                <div className="pf-badge-item__name">Community Helper</div>
                                                <div className="pf-badge-item__desc">
                                                    {stats.votes >= 10
                                                        ? "Voted on 10+ community issues"
                                                        : `${stats.votes}/10 votes to unlock`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`pf-badge-item${stats.resolved < 5 ? " pf-badge-item--locked" : ""}`}>
                                        <span className="pf-badge-item__icon">{stats.resolved >= 5 ? "🏆" : "🔒"}</span>
                                        <div>
                                            <div className="pf-badge-item__name">Street Champion</div>
                                            <div className="pf-badge-item__desc">
                                                {stats.resolved >= 5
                                                    ? "Got 5 issues resolved!"
                                                    : `${stats.resolved}/5 resolved to unlock`}
                                            </div>
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
                                <button
                                    key={tab}
                                    className={`pf-tab${activeTab === tab ? " pf-tab--active" : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === "info"     && "📋 Account Info"}
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
                                            <input
                                                className={`pf-input${editMode ? " pf-input--active" : ""}`}
                                                type={f.type}
                                                name={f.name}
                                                value={formData[f.name]}
                                                disabled={!editMode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ))}

                                    <div className="pf-form-group">
                                        <label className="pf-label">📍 Location</label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input
                                                className={`pf-input${editMode ? " pf-input--active" : ""}`}
                                                name="location"
                                                value={formData.location}
                                                disabled={!editMode}
                                                onChange={handleChange}
                                                style={{ flex: 1 }}
                                            />
                                            {editMode && (
                                                <button
                                                    type="button"
                                                    onClick={handleUseCurrentLocation}
                                                    disabled={locating}
                                                    style={{
                                                        whiteSpace: "nowrap", padding: "0 14px",
                                                        borderRadius: 8, border: "1px solid #e5e9f2",
                                                        background: "#f4f6fb", color: "#374151",
                                                        fontSize: 13, fontWeight: 500,
                                                        cursor: locating ? "not-allowed" : "pointer",
                                                        opacity: locating ? 0.7 : 1,
                                                    }}
                                                >
                                                    {locating ? "Locating…" : "📍 Use Current"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pf-form-group pf-form-group--full">
                                        <label className="pf-label">Bio</label>
                                        <textarea
                                            className={`pf-input pf-textarea${editMode ? " pf-input--active" : ""}`}
                                            name="bio"
                                            value={formData.bio}
                                            disabled={!editMode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={message.includes("❌") ? "pf-error" : "pf-success"}>
                                        {message}
                                    </div>
                                )}
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
                                                {user?.role === "admin"
                                                    ? "No complaints have been submitted yet."
                                                    : user?.role === "volunteer"
                                                        ? "No assignments yet. Check back once admin assigns you a complaint."
                                                        : "Start by reporting a civic issue in your area!"}
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
                                                const status  = c.status || "received";
                                                const dateStr = c.updated_at || c.updatedAt || c.created_at || c.createdAt;

                                                const STATUS_DISPLAY = {
                                                    completed:   { icon: "🏆", color: "#10b981", verb: "completed"   },
                                                    resolved:    { icon: "🎉", color: "#22c55e", verb: "resolved"    },
                                                    denied:      { icon: "🚫", color: "#ef4444", verb: "denied"      },
                                                    accepted:    { icon: "✅", color: "#16a34a", verb: "accepted"    },
                                                    in_progress: { icon: "🔄", color: "#8b5cf6", verb: "in progress" },
                                                    in_review:   { icon: "🔄", color: "#8b5cf6", verb: "in review"  },
                                                    assigned:    { icon: "👤", color: "#f59e0b", verb: "assigned"    },
                                                    received:    { icon: "➕", color: "#3b82f6", verb: "submitted"   },
                                                    pending:     { icon: "➕", color: "#3b82f6", verb: "submitted"   },
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
                                                        <div
                                                            className="pf-activity-item__icon"
                                                            style={{ background: disp.color + "18", color: disp.color }}
                                                        >
                                                            {disp.icon}
                                                        </div>
                                                        <div className="pf-activity-item__body">
                                                            <p className="pf-activity-item__text">{text}</p>
                                                            <p className="pf-activity-item__time">{timeAgo(dateStr)}</p>
                                                        </div>
                                                        <span style={{
                                                            fontSize: 10, fontWeight: 700, padding: "2px 8px",
                                                            borderRadius: 9999, background: disp.color + "18",
                                                            color: disp.color, whiteSpace: "nowrap",
                                                        }}>
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
                                <div className="pf-card" style={{ marginBottom: 16 }}>
                                    <div className="pf-card__header">
                                        <div>
                                            <h2 className="pf-card__title">Security Settings</h2>
                                            <p className="pf-card__sub">Manage your password and privacy</p>
                                        </div>
                                    </div>
                                    <div className="pf-security-list">
                                        {[
                                            { icon: "🔑", title: "Password",                  sub: "Last changed 30 days ago",       btn: "Change Password" },
                                            { icon: "📱", title: "Two-Factor Authentication", sub: "Add an extra layer of security",  btn: "Enable 2FA"      },
                                            { icon: "🛡️", title: "Privacy Settings",          sub: "Control who sees your activity", btn: "Manage"          },
                                            { icon: "🔔", title: "Notifications",             sub: "Email and push preferences",     btn: "Configure"       },
                                        ].map((item, idx) => (
                                            <div key={idx} className="pf-security-item">
                                                <div className="pf-security-item__left">
                                                    <span className="pf-security-item__icon">{item.icon}</span>
                                                    <div>
                                                        <div className="pf-security-item__title">{item.title}</div>
                                                        <div className="pf-security-item__sub">{item.sub}</div>
                                                    </div>
                                                </div>
                                                <button className="pf-btn pf-btn--outline">{item.btn}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pf-danger-card">
                                    <h3 className="pf-danger-card__title">⚠️ Danger Zone</h3>
                                    <p className="pf-danger-card__sub">These actions are permanent and cannot be undone.</p>
                                    <div className="pf-danger-card__actions">
                                        <button className="pf-btn pf-btn--danger-outline">Deactivate Account</button>
                                        <button className="pf-btn pf-btn--danger" onClick={handleLogout}>
                                            Log Out
                                        </button>
                                    </div>
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
