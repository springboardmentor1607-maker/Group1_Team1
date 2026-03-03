import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Dashboard.css";
import API from "../api";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_LABELS = { received: "Received", in_review: "In Review", resolved: "Resolved" };
const STATUS_DOT_COLORS = { received: "#3b82f6", in_review: "#f59e0b", resolved: "#22c55e" };
const PROGRESS_STEPS = ["received", "in_review", "resolved"];

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGradDB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassGradDB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadGradDB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="circleClipDB"><circle cx="100" cy="100" r="86" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyGradDB)" />
      <g clipPath="url(#circleClipDB)">
        <g fill="white">
          <rect x="25" y="78" width="16" height="32" />
          <rect x="27" y="80" width="3" height="3" fill="#90caf9" /><rect x="32" y="80" width="3" height="3" fill="#90caf9" />
          <rect x="42" y="60" width="18" height="50" /><rect x="50" y="52" width="2" height="9" fill="white" />
          <rect x="44" y="64" width="4" height="4" fill="#90caf9" /><rect x="51" y="64" width="4" height="4" fill="#90caf9" />
          <rect x="44" y="72" width="4" height="4" fill="#90caf9" /><rect x="51" y="72" width="4" height="4" fill="#90caf9" />
          <rect x="62" y="50" width="20" height="60" /><rect x="71" y="42" width="2" height="10" fill="white" />
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
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGradDB)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGradDB)" />
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="csTextArcDB" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csTextArcDB" startOffset="7%">CLEAN STREETS</textPath>
      </text>
      <g transform="translate(12,106) rotate(-15)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)" />
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)" />
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)" />
      </g>
      <g transform="translate(188,106) rotate(15) scale(-1,1)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)" />
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)" />
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)" />
      </g>
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`cs-badge cs-badge--${status}`}>
      <span className="cs-badge__dot" style={{ background: STATUS_DOT_COLORS[status] }} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function StatCard({ icon, count, label, trend }) {
  return (
    <div className="cs-stat-card">
      <div className="cs-stat-card__icon">{icon}</div>
      <div className="cs-stat-card__count">{count}</div>
      <div className="cs-stat-card__label">{label}</div>
      {trend && <div className="cs-stat-card__trend">{trend}</div>}
    </div>
  );
}

function ComplaintCard({ complaint, onView }) {
  return (
    <div className="cs-complaint-card" onClick={() => onView(complaint)}>
      {complaint.photo && (
        <div className="cs-complaint-card__img-wrap">
          <img
            src={`http://localhost:5000${complaint.photo}`}
            alt={complaint.title}
            className="cs-complaint-card__img"
          />
          <div className="cs-complaint-card__img-overlay" />
        </div>
      )}
      <div className="cs-complaint-card__body">
        <div className="cs-complaint-card__header">
          <div className="cs-complaint-card__title-row">
            <span className="cs-complaint-card__title">{complaint.title}</span>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="cs-complaint-card__desc">{complaint.description}</p>
        <div className="cs-complaint-card__location">
          <span>📍</span>
          <span>{complaint.address}</span>
        </div>
        <div className="cs-complaint-card__footer">
          <span className="cs-complaint-card__time">🕐 {timeAgo(complaint.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;
  const currentIdx = PROGRESS_STEPS.indexOf(complaint.status);
  return (
    <div className="cs-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cs-modal">
        <button className="cs-modal__close" onClick={onClose}>×</button>
        {complaint.photo && (
          <div className="cs-modal__img-wrap">
            <img src={`http://localhost:5000${complaint.photo}`} alt={complaint.title} className="cs-modal__img" />
            <div className="cs-modal__img-overlay" />
            <div className="cs-modal__img-badge"><StatusBadge status={complaint.status} /></div>
          </div>
        )}
        <div className="cs-modal__header">
          <div>
            <div className="cs-modal__title">{complaint.title}</div>
            <div className="cs-modal__subtitle">Type: {complaint.type || "—"} · Priority: {complaint.priority || "—"}</div>
          </div>
        </div>
        {!complaint.photo && <div style={{ padding: "0 24px" }}><StatusBadge status={complaint.status} /></div>}

        {/* Progress tracker */}
        <div style={{ padding: "16px 24px 0" }}>
          <div className="cs-progress">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <div className="cs-progress__step">
                  <div className={`cs-progress__circle${i <= currentIdx ? " cs-progress__circle--active" : ""}`}
                    style={i <= currentIdx ? { background: i === 0 ? "#3b82f6" : i === 1 ? "#f59e0b" : "#22c55e" } : {}}>
                    {i <= currentIdx ? "✓" : i + 1}
                  </div>
                  <span className={`cs-progress__label${i <= currentIdx ? " cs-progress__label--active" : ""}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
                {i < PROGRESS_STEPS.length - 1 && (
                  <div className={`cs-progress__line${i < currentIdx ? " cs-progress__line--active" : ""}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="cs-modal__body">
          <div>
            <div className="cs-modal__field-label">Description</div>
            <div className="cs-modal__field-value">{complaint.description}</div>
          </div>
          <div className="cs-modal__grid">
            <div>
              <div className="cs-modal__field-label">Location</div>
              <div className="cs-modal__field-value">📍 {complaint.address}</div>
            </div>
            <div>
              <div className="cs-modal__field-label">Reported On</div>
              <div className="cs-modal__field-value">🕐 {formatDate(complaint.created_at)}</div>
            </div>
            <div>
              <div className="cs-modal__field-label">Last Updated</div>
              <div className="cs-modal__field-value">🔄 {formatDate(complaint.updated_at)}</div>
            </div>
            <div>
              <div className="cs-modal__field-label">Assigned To</div>
              <div className="cs-modal__field-value">{complaint.assigned_to || "Not yet assigned"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I'm the CleanStreet assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const QUICK_REPLIES = ["Take a tour 🗺️", "How do I report an issue?", "Track my complaint"];
  const BOT_RESPONSES = {
    "take a tour": "🗺️ Welcome to CleanStreet!\n\n1️⃣ Dashboard — See all complaints & stats.\n2️⃣ Report Issue — File a complaint instantly.\n3️⃣ Track Progress — Received → In Review → Resolved.",
    "how do i report an issue": "Click '➕ Report New Issue' in the navbar to submit a new civic complaint with photo and location!",
    "track my complaint": "Click on any complaint card to see its progress tracker — from Received all the way to Resolved.",
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const key = text.toLowerCase().replace(/[^a-z\s]/g, "").trim();
    const matched = Object.keys(BOT_RESPONSES).find(k => key.includes(k));
    const botReply = matched ? BOT_RESPONSES[matched] : "Try typing 'Take a tour' to learn about CleanStreet!";
    setMessages(prev => [...prev, { from: "user", text }, { from: "bot", text: botReply }]);
    setInput("");
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 999,
        width: 56, height: 56, borderRadius: "50%",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        border: "none", cursor: "pointer", fontSize: 24,
        boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 998,
          width: 320, background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          border: "1px solid #e5e7eb", display: "flex",
          flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>CleanStreet Bot</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>● Online</div>
            </div>
          </div>
          <div style={{ padding: "12px 14px", overflowY: "auto", height: 260, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "78%", padding: "8px 12px", borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                  background: m.from === "user" ? "#2563eb" : "#f1f5f9",
                  color: m.from === "user" ? "#fff" : "#111827",
                }}>
                  {m.text.split("\n").map((line, j) => <span key={j}>{line}<br /></span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0 12px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_REPLIES.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{
                background: "#eff6ff", border: "1px solid #bfdbfe",
                borderRadius: 20, padding: "4px 10px", fontSize: 11.5,
                color: "#2563eb", cursor: "pointer", fontFamily: "inherit",
              }}>{q}</button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 12px", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Type a message..."
              style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => sendMessage(input)} style={{ background: "#2563eb", border: "none", borderRadius: 8, color: "#fff", padding: "0 14px", cursor: "pointer", fontSize: 16 }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const MOCK_USER = {
    name: user?.name || "Demo User",
    username: user?.username ? `@${user.username}` : "@demo_user",
    role: user?.role || "Citizen",
    avatar: user?.name ? getInitials(user.name) : "DU",
  };

  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ── Fetch complaints from API with auth token ──────────────────────────────
  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const res = await API.get("/api/complaints");
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === "received").length;
  const inProg   = complaints.filter(c => c.status === "in_review").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  const filtered = complaints.filter(c => {
    const matchStatus = activeFilter === "all" || c.status === activeFilter;
    const matchSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filters = [
    { key: "all",       label: "All",       count: total    },
    { key: "received",  label: "Received",  count: pending  },
    { key: "in_review", label: "In Review", count: inProg   },
    { key: "resolved",  label: "Resolved",  count: resolved },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cs-page">
      {/* ── Navbar ── */}
      <nav className="cs-navbar">
        <div className="cs-navbar__brand">
          <CleanStreetLogo size={42} />
          <span className="cs-navbar__name">CleanStreet</span>
        </div>
        <div className="cs-navbar__links">
          {[
            { label: "Dashboard",        path: "/dashboard"         },
            { label: "Report Issue",     path: "/submit-complaint"  },
            { label: "View Complaints",  path: "/complaints"        },
          ].map(item => (
            <span key={item.label}
              className={`cs-navbar__link ${item.label === "Dashboard" ? "cs-navbar__link--active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="cs-navbar__actions">
          {user ? (
            <button
              className="cs-btn cs-btn--outline cs-btn--sm"
              onClick={handleLogout}
              style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}
            >Logout</button>
          ) : (
            <>
              <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => navigate("/login")}>Login</button>
              <button className="cs-btn--register" onClick={() => navigate("/signup")}>Register</button>
            </>
          )}
          <div className="cs-avatar" onClick={() => navigate("/profile")} title="My Profile">
            {MOCK_USER.avatar}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="cs-main-content">

        {/* ── Hero ── */}
        <div className="cs-hero">
          <div className="cs-hero__content">
            <div className="cs-hero__eyebrow">🏙️ Civic Dashboard</div>
            <h1 className="cs-hero__title">Welcome back, {MOCK_USER.name} 👋</h1>
            <p className="cs-hero__subtitle">
              Help keep your community clean and safe. Report issues, track progress, and see the impact of your civic action.
            </p>
            <button className="cs-btn cs-btn--primary" onClick={() => navigate("/submit-complaint")}>
              ➕ Report New Issue
            </button>
          </div>
          <div className="cs-hero__img-wrap">
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"
              alt="City skyline"
              className="cs-hero__img"
            />
            <div className="cs-hero__img-overlay" />
            <div className="cs-hero__img-stats">
              <div className="cs-hero__img-stat">
                <span className="cs-hero__img-stat-num">{resolved}</span>
                <span className="cs-hero__img-stat-label">Issues Resolved</span>
              </div>
              <div className="cs-hero__img-stat-divider" />
              <div className="cs-hero__img-stat">
                <span className="cs-hero__img-stat-num">{total}</span>
                <span className="cs-hero__img-stat-label">Total Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="cs-grid-sidebar">

          {/* ── Left: Stats + Complaints ── */}
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <StatCard icon="⚠️" count={total}    label="Total Issues" />
              <StatCard icon="⏳" count={pending}  label="Pending"      />
              <StatCard icon="🔄" count={inProg}   label="In Progress"  />
              <StatCard icon="✅" count={resolved} label="Resolved"     />
            </div>

            {/* Filter bar */}
            <div className="cs-filter-bar">
              <div className="cs-filter-tabs">
                {filters.map(f => (
                  <button
                    key={f.key}
                    className={`cs-filter-tab${activeFilter === f.key ? " cs-filter-tab--active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                    <span className="cs-filter-tab__count">{f.count}</span>
                  </button>
                ))}
              </div>
              <input
                className="cs-input cs-search-input"
                placeholder="🔍 Search complaints..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Complaints grid */}
            {loading ? (
              <div className="cs-empty">
                <div className="cs-empty__icon">⏳</div>
                <div className="cs-empty__title">Loading complaints...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="cs-empty">
                <div className="cs-empty__icon">📭</div>
                <div className="cs-empty__title">No complaints found</div>
                <div className="cs-empty__desc">
                  {total === 0
                    ? "No reports submitted yet. Be the first to report an issue!"
                    : "Try adjusting your search or filter."}
                </div>
                {total === 0 && (
                  <button className="cs-btn cs-btn--primary" style={{ marginTop: 16 }} onClick={() => navigate("/submit-complaint")}>
                    ➕ Report an Issue
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map(c => (
                  <ComplaintCard key={c._id} complaint={c} onView={setSelectedComplaint} />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Profile card */}
            <div className="cs-profile-card">
              <div className="cs-avatar cs-avatar--lg">{MOCK_USER.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a8a" }}>{MOCK_USER.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{MOCK_USER.username}</div>
                <span className="cs-badge cs-badge--role" style={{ marginTop: 4 }}>🧑‍💼 {MOCK_USER.role}</span>
              </div>
            </div>

            {/* City Health */}
            <div className="cs-health-card">
              <div className="cs-health-card__label">📊 City Health Score</div>
              <div className="cs-health-card__score">
                {total === 0 ? "—" : Math.round((resolved / total) * 100)}<span>/100</span>
              </div>
              <div className="cs-health-bar">
                <div className="cs-health-bar__fill" style={{ width: total === 0 ? "0%" : `${Math.round((resolved / total) * 100)}%` }} />
              </div>
              <div className="cs-health-card__note">{resolved} of {total} issues resolved</div>
            </div>

            {/* Quick Actions */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">⚡ Quick Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                <button className="cs-btn cs-btn--primary cs-btn--full" onClick={() => navigate("/submit-complaint")}>
                  ➕ Report New Issue
                </button>
                <button className="cs-btn cs-btn--outline cs-btn--full" onClick={() => navigate("/complaints")}>
                  🗂️ View All Complaints
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
