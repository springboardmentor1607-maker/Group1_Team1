import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../Profile.css";
import Navbar from "./Navbar";
import API from "../api";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 34 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
            <defs>
                <linearGradient id="skyGP" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
                </linearGradient>
                <linearGradient id="grassGP" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
                </linearGradient>
                <linearGradient id="roadGP" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
                </linearGradient>
                <clipPath id="ccP"><circle cx="100" cy="100" r="86" /></clipPath>
            </defs>
            <circle cx="100" cy="100" r="98" fill="white" />
            <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
            <circle cx="100" cy="100" r="87" fill="url(#skyGP)" />
            <g clipPath="url(#ccP)">
                <g fill="white">
                    <rect x="25" y="78" width="16" height="32" />
                    <rect x="27" y="80" width="3" height="3" fill="#90caf9" /><rect x="32" y="80" width="3" height="3" fill="#90caf9" />
                    <rect x="42" y="60" width="18" height="50" /><rect x="50" y="52" width="2" height="9" />
                    <rect x="44" y="64" width="4" height="4" fill="#90caf9" /><rect x="51" y="64" width="4" height="4" fill="#90caf9" />
                    <rect x="44" y="72" width="4" height="4" fill="#90caf9" /><rect x="51" y="72" width="4" height="4" fill="#90caf9" />
                    <rect x="62" y="50" width="20" height="60" /><rect x="71" y="42" width="2" height="10" />
                    <rect x="64" y="54" width="5" height="5" fill="#90caf9" /><rect x="72" y="54" width="5" height="5" fill="#90caf9" />
                    <rect x="64" y="63" width="5" height="5" fill="#90caf9" /><rect x="72" y="63" width="5" height="5" fill="#90caf9" />
                    <rect x="64" y="72" width="5" height="5" fill="#90caf9" /><rect x="72" y="72" width="5" height="5" fill="#90caf9" />
                    <rect x="84" y="58" width="18" height="52" />
                    <rect x="86" y="62" width="4" height="4" fill="#90caf9" /><rect x="93" y="62" width="4" height="4" fill="#90caf9" />
                    <rect x="86" y="70" width="4" height="4" fill="#90caf9" /><rect x="93" y="70" width="4" height="4" fill="#90caf9" />
                    <rect x="104" y="65" width="16" height="45" />
                    <rect x="106" y="68" width="4" height="4" fill="#90caf9" /><rect x="112" y="68" width="4" height="4" fill="#90caf9" />
                    <rect x="121" y="74" width="16" height="36" />
                    <rect x="123" y="78" width="3" height="3" fill="#90caf9" /><rect x="129" y="78" width="3" height="3" fill="#90caf9" />
                </g>
                <ellipse cx="100" cy="132" rx="95" ry="44" fill="#81c784" />
                <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGP)" />
                <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGP)" />
                <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
                <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
                <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
                <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
            </g>
            <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
            <path id="laP" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
            <text fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
                <textPath href="#laP" startOffset="7%">CLEAN STREETS</textPath>
            </text>
            <g transform="translate(12,106) rotate(-15)">
                <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)" />
                <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)" />
            </g>
            <g transform="translate(188,106) rotate(15) scale(-1,1)">
                <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)" />
                <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)" />
            </g>
        </svg>
    );
}

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

// ─── Profile Page ─────────────────────────────────────────────────────────────
function Profile() {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();

    // ── Real stats + activity ──────────────────────────────────────────────────
    const [stats,    setStats]    = useState({ reports: 0, resolved: 0, votes: 0, badges: 0 });
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const isVolunteer = user?.role === "volunteer";
                const isAdmin     = user?.role === "admin";
                const endpoint    = isVolunteer ? "/api/complaints/my-assignments"
                                  : isAdmin     ? "/api/complaints"
                                  :               "/api/complaints/my";
                const res        = await API.get(endpoint);
                const complaints = Array.isArray(res.data) ? res.data : res.data?.complaints || [];
                const reports    = complaints.length;
                const resolved   = complaints.filter(c => c.status === "resolved" || c.status === "completed").length;
                const votes      = complaints.reduce((sum, c) => sum + (Number(c.upvotes) || 0), 0);
                let badges = 0;
                if (isVolunteer)    { if (reports >= 1) badges++; if (resolved >= 5) badges++; }
                else if (!isAdmin)  { if (reports >= 1) badges++; if (votes >= 10) badges++; if (resolved >= 5) badges++; }
                setStats({ reports, resolved, votes, badges });
                const META = {
                    completed:   { icon: "✅", verb: isVolunteer ? "completed"         : isAdmin ? "approved"          : "resolved", color: "#10b981" },
                    resolved:    { icon: "🎉", verb: "resolved",                                                                      color: "#22c55e" },
                    in_progress: { icon: "🔄", verb: "updated to in progress",                                                        color: "#f59e0b" },
                    in_review:   { icon: "🔄", verb: "updated",                                                                       color: "#f59e0b" },
                    accepted:    { icon: "✔️", verb: "accepted",                                                                      color: "#2563eb" },
                    assigned:    { icon: "👤", verb: isVolunteer ? "assigned to you"   : isAdmin ? "assigned volunteer" : "assigned", color: "#f59e0b" },
                    denied:      { icon: "🚫", verb: "denied",                                                                        color: "#ef4444" },
                    received:    { icon: "➕", verb: isAdmin ? "received"              : "reported",                                  color: "#3b82f6" },
                    pending:     { icon: "➕", verb: isAdmin ? "received"              : "reported",                                  color: "#3b82f6" },
                };
                const timeAgo = (d) => {
                    if (!d) return "Recently";
                    const s = Math.floor((Date.now() - new Date(d)) / 1000);
                    if (s < 60) return "Just now"; if (s < 3600) return `${Math.floor(s/60)}m ago`;
                    if (s < 86400) return `${Math.floor(s/3600)}h ago`; if (s < 172800) return "Yesterday";
                    return `${Math.floor(s/86400)}d ago`;
                };
                setActivity(complaints.slice().sort((a,b) => new Date(b.updated_at||b.updatedAt||b.created_at||b.createdAt) - new Date(a.updated_at||a.updatedAt||a.created_at||a.createdAt)).slice(0,8).map(c => { const m = META[c.status]||META.pending; return { icon:m.icon, color:m.color, text:`${c.title||"Complaint"} ${m.verb}`, time:timeAgo(c.updated_at||c.updatedAt||c.created_at||c.createdAt) }; }));
            } catch (err) { console.error("[Profile] fetch failed:", err?.response?.status, err?.message); }
        };
        if (user?.username || user?._id || user?.id) fetchStats();
    }, [user]);

    // Dynamic data from AuthContext with fallbacks
    const initialData = {
        username: user?.username || "",
        email: user?.email || "",
        fullName: user?.name || "",
        phone: user?.phone || "",
        location: user?.location || "",
        bio: user?.bio || "",
    };

    const [formData, setFormData]   = useState(initialData);
    const [savedData, setSavedData] = useState(initialData);
    const [editMode, setEditMode]   = useState(false);
    const [message, setMessage]     = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [locating, setLocating]   = useState(false);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) return setMessage("Geolocation not supported by your browser ❌");
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude: lat, longitude: lng } = pos.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
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

    const handleChange  = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleEdit    = () => { setEditMode(true); setMessage(""); };
    const handleCancel  = () => { setFormData(savedData); setEditMode(false); setMessage(""); };
    const handleSave    = async () => {
        try {
            await API.put("/api/users/profile", {
                name: formData.fullName, username: formData.username,
                email: formData.email,   phone: formData.phone,
                location: formData.location, bio: formData.bio,
            });
            updateUser({
                name: formData.fullName, username: formData.username,
                email: formData.email,   phone: formData.phone,
                location: formData.location, bio: formData.bio,
            });
            setSavedData(formData);
            setEditMode(false);
            setMessage("Profile updated successfully ✅");
        } catch (err) {
            setMessage("Failed to save profile. Please try again ❌");
        }
    };
    const handleLogout  = () => { logout(); navigate("/login"); };

    const fields = [
        { name: "username", label: "Username",     icon: "👤", type: "text"  },
        { name: "email",    label: "Email",         icon: "✉️", type: "email" },
        { name: "fullName", label: "Full Name",     icon: "🪪", type: "text"  },
        { name: "phone",    label: "Phone Number",  icon: "📞", type: "tel"   },
    ];

    const tabs = ["info", "activity", "security"];
    const avatarText = savedData.fullName
        ? savedData.fullName.substring(0, 2).toUpperCase()
        : "DU";

    // Format member since date
    const memberSince = user?.createdAt || user?.memberSince
        ? new Date(user.createdAt || user.memberSince).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "July 2025";

    return (
        <div className="pf-page">

            {/* ── Navbar ── */}
            <Navbar />

            {/* ── Page body ── */}
            <div className="pf-body">

                {/* ── Hero strip ── */}
                <div className="pf-hero">
                    <div className="pf-hero__text">
                        <p className="pf-hero__eyebrow">👤 My Profile</p>
                        <h1 className="pf-hero__title">{savedData.fullName}</h1>
                        <p className="pf-hero__sub">
                            @{savedData.username} · Member since {memberSince}
                        </p>
                    </div>

                    {/* ── Live stats from API — hidden for admin ── */}
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

                        {/* Avatar card */}
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
                                <span>📍 {savedData.location}</span>
                                <span>📞 {savedData.phone}</span>
                                <span>✉️ {savedData.email}</span>
                            </div>
                            <p className="pf-avatar-card__since">Member since {memberSince}</p>
                        </div>

                        {/* Badges card — hidden for admin */}
                        {user?.role !== "admin" && <div className="pf-badges-card">
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
                        </div>}

                    </aside>

                    {/* ─── RIGHT MAIN PANEL ─── */}
                    <div className="pf-main">

                        {/* Tabs */}
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
                                        <button className="pf-btn pf-btn--primary" onClick={handleEdit}>✏️ Edit Profile</button>
                                    ) : (
                                        <div className="pf-btn-group">
                                            <button className="pf-btn pf-btn--outline" onClick={handleCancel}>Cancel</button>
                                            <button className="pf-btn pf-btn--primary" onClick={handleSave}>💾 Save Changes</button>
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
                                                    style={{ whiteSpace: "nowrap", padding: "0 14px", borderRadius: 8, border: "1px solid #e5e9f2", background: "#f4f6fb", color: "#374151", fontSize: 13, fontWeight: 500, cursor: locating ? "not-allowed" : "pointer", opacity: locating ? 0.7 : 1 }}
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
                                    {activity.length === 0 ? (
                                        <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "32px 0" }}>
                                            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                                            <div>No activity yet.</div>
                                        </div>
                                    ) : activity.map((a, i) => (
                                        <div key={i} className="pf-activity-item">
                                            <div className="pf-activity-item__icon" style={{ background: a.color + "18" }}>{a.icon}</div>
                                            <div className="pf-activity-item__body">
                                                <p className="pf-activity-item__text">{a.text}</p>
                                                <p className="pf-activity-item__time">{a.time}</p>
                                            </div>
                                        </div>
                                    ))}
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
                                            { icon: "🔑", title: "Password",                  sub: "Last changed 30 days ago",          btn: "Change Password" },
                                            { icon: "📱", title: "Two-Factor Authentication", sub: "Add an extra layer of security",     btn: "Enable 2FA"      },
                                            { icon: "🛡️", title: "Privacy Settings",          sub: "Control who sees your activity",    btn: "Manage"          },
                                            { icon: "🔔", title: "Notifications",             sub: "Email and push preferences",        btn: "Configure"       },
                                        ].map((item, i) => (
                                            <div key={i} className="pf-security-item">
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
                                        <button className="pf-btn pf-btn--danger">Delete Account</button>
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