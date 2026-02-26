import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../Profile.css";

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

    // Dynamic data from AuthContext with fallbacks
    const initialData = {
        username: user?.username || "demo_user",
        email: user?.email || "demo@cleanstreet.com",
        fullName: user?.name || "Demo User",
        phone: user?.phone || "+1-555-123-4567",
        location: user?.location || "Downtown District",
        bio: user?.bio || "Active citizen helping to improve our community through CleanStreet reporting.",
    };

    const [formData, setFormData] = useState(initialData);
    const [savedData, setSavedData] = useState(initialData);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("info");

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleEdit = () => { setEditMode(true); setMessage(""); };
    const handleCancel = () => { setFormData(savedData); setEditMode(false); setMessage(""); };
    const handleSave = () => {
        setSavedData(formData);
        updateUser({ name: formData.fullName, username: formData.username, email: formData.email, phone: formData.phone, location: formData.location, bio: formData.bio });
        setEditMode(false);
        setMessage("Profile updated successfully ✅");
    };
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fields = [
        { name: "username", label: "Username", icon: "👤", type: "text" },
        { name: "email", label: "Email", icon: "✉️", type: "email" },
        { name: "fullName", label: "Full Name", icon: "🪪", type: "text" },
        { name: "phone", label: "Phone Number", icon: "📞", type: "tel" },
    ];

    const tabs = ["info", "activity", "security"];

    // Avatar initials from name
    const avatarText = savedData.fullName ? savedData.fullName.substring(0, 2).toUpperCase() : "DU";

    return (
        <div className="pf-page">

            {/* ── Navbar ── */}
            <nav className="pf-navbar">
                <div className="pf-navbar__brand">
                    <CleanStreetLogo size={42} />
                    <span className="pf-navbar__name">CleanStreet</span>
                </div>
                <div className="pf-navbar__links">
                    <span className="pf-navbar__link" onClick={() => navigate('/dashboard')} style={{ cursor: "pointer" }}>Dashboard</span>
                    <span className="pf-navbar__link" onClick={() => navigate('/submit-complaint')} style={{ cursor: "pointer" }}>Report Issue</span>
                    <span className="pf-navbar__link" onClick={() => navigate('/complaints')} style={{ cursor: "pointer" }}>View Complaints</span>
                </div>
                <div className="pf-navbar__actions">
                    {/* Logout when logged in, Login+Register when not */}
                    {user ? (
                        <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={handleLogout} style={{ background: '#2563eb', color: '#fff', borderColor: '#2563eb' }}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <button className="pf-btn pf-btn--outline" onClick={() => navigate('/login')} style={{ fontSize: 13, padding: "6px 14px" }}>Login</button>
                            <button className="pf-btn pf-btn--primary" onClick={() => navigate('/signup')} style={{ fontSize: 13, padding: "6px 14px" }}>Register</button>
                        </>
                    )}
                    <div
                        className="pf-navbar__avatar"
                        onClick={() => navigate('/profile')}
                        title="My Profile"
                        style={{ cursor: "pointer", outline: "2px solid #2563eb", outlineOffset: "2px" }}
                    >
                        {avatarText}
                    </div>
                </div>
            </nav>

            {/* ── Page body ── */}
            <div className="pf-body">

                {/* ── Hero strip ── */}
                <div className="pf-hero">
                    <div className="pf-hero__text">
                        <p className="pf-hero__eyebrow">👤 My Profile</p>
                        <h1 className="pf-hero__title">{savedData.fullName}</h1>
                        <p className="pf-hero__sub">@{savedData.username} · Member since {user?.memberSince || "July 2025"}</p>
                    </div>
                    <div className="pf-hero__stats">
                        <StatMini icon="⚠️" value="4" label="Reports" colorClass="pf-stat--blue" />
                        <StatMini icon="✅" value="1" label="Resolved" colorClass="pf-stat--green" />
                        <StatMini icon="👍" value="24" label="Votes" colorClass="pf-stat--purple" />
                        <StatMini icon="🏅" value="3" label="Badges" colorClass="pf-stat--yellow" />
                    </div>
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
                            <span className="pf-role-badge">🧑‍💼 {user?.role || "Citizen"}</span>
                            <p className="pf-avatar-card__bio">{savedData.bio}</p>
                            <div className="pf-avatar-card__divider" />
                            <div className="pf-avatar-card__meta">
                                <span>📍 {savedData.location}</span>
                                <span>📞 {savedData.phone}</span>
                                <span>✉️ {savedData.email}</span>
                            </div>
                            <p className="pf-avatar-card__since">Member since {user?.memberSince || "July 3, 2025"}</p>
                        </div>

                        {/* Badges card */}
                        <div className="pf-badges-card">
                            <div className="pf-badges-card__title">🏅 Civic Badges</div>
                            <div className="pf-badges-list">
                                <div className="pf-badge-item">
                                    <span className="pf-badge-item__icon">🌟</span>
                                    <div>
                                        <div className="pf-badge-item__name">First Report</div>
                                        <div className="pf-badge-item__desc">Submitted your first civic issue</div>
                                    </div>
                                </div>
                                <div className="pf-badge-item">
                                    <span className="pf-badge-item__icon">🤝</span>
                                    <div>
                                        <div className="pf-badge-item__name">Community Helper</div>
                                        <div className="pf-badge-item__desc">Voted on 10+ community issues</div>
                                    </div>
                                </div>
                                <div className="pf-badge-item pf-badge-item--locked">
                                    <span className="pf-badge-item__icon">🔒</span>
                                    <div>
                                        <div className="pf-badge-item__name">Street Champion</div>
                                        <div className="pf-badge-item__desc">Get 5 issues resolved</div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                        <input
                                            className={`pf-input${editMode ? " pf-input--active" : ""}`}
                                            name="location"
                                            value={formData.location}
                                            disabled={!editMode}
                                            onChange={handleChange}
                                        />
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
                                    {[
                                        { icon: "✅", text: "Pothole on Main Street resolved", time: "2 hours ago", color: "#22c55e" },
                                        { icon: "➕", text: "Reported broken streetlight on Elm Ave", time: "4 hours ago", color: "#3b82f6" },
                                        { icon: "🔄", text: "Garbage dump complaint updated", time: "6 hours ago", color: "#f59e0b" },
                                        { icon: "💬", text: "New comment on water leak report", time: "1 day ago", color: "#8b5cf6" },
                                        { icon: "👍", text: "Voted on 3 community issues", time: "2 days ago", color: "#06b6d4" },
                                    ].map((a, i) => (
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
                                            { icon: "🔑", title: "Password", sub: "Last changed 30 days ago", btn: "Change Password" },
                                            { icon: "📱", title: "Two-Factor Authentication", sub: "Add an extra layer of security", btn: "Enable 2FA" },
                                            { icon: "🛡️", title: "Privacy Settings", sub: "Control who sees your activity", btn: "Manage" },
                                            { icon: "🔔", title: "Notifications", sub: "Email and push preferences", btn: "Configure" },
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