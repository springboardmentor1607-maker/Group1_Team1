import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Dashboard.css";

// Status constants
const STATUS_LABELS = { received: "Received", in_review: "In Review", resolved: "Resolved" };
const STATUS_DOT_COLORS = { received: "#3b82f6", in_review: "#f59e0b", resolved: "#22c55e" };
const PROGRESS_STEPS = ["received", "in_review", "resolved"];

// Utility functions
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Components ──────────────────────────────────────────────────────────────

function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <circle cx="100" cy="100" r="98" fill="#4caf50" />
      <text x="50%" y="50%" textAnchor="middle" fill="#fff" fontSize="32" dy=".3em">CS</text>
    </svg>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`cs-badge cs-badge--${status}`}>
      <span className="cs-badge__dot" style={{ background: STATUS_DOT_COLORS[status] }} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function StatCard({ icon, count, label }) {
  return (
    <div className="cs-stat-card">
      <div className="cs-stat-card__icon">{icon}</div>
      <div className="cs-stat-card__count">{count}</div>
      <div className="cs-stat-card__label">{label}</div>
    </div>
  );
}

function ComplaintCard({ complaint, onView }) {
  return (
    <div className="cs-complaint-card" onClick={() => onView(complaint)}>
      {complaint.image && (
        <div className="cs-complaint-card__img-wrap">
          <img src={complaint.image} alt={complaint.type} className="cs-complaint-card__img" />
          <div className="cs-complaint-card__img-overlay" />
        </div>
      )}
      <div className="cs-complaint-card__body">
        <div className="cs-complaint-card__header">
          <div className="cs-complaint-card__title-row">
            <span style={{ fontSize: 18 }}>{complaint.typeIcon}</span>
            <span className="cs-complaint-card__title">{complaint.title}</span>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="cs-complaint-card__desc">{complaint.description}</p>
        <div className="cs-complaint-card__location">
          <span>📍</span>
          <span>{complaint.location}</span>
        </div>
        <div className="cs-complaint-card__footer">
          <div className="cs-complaint-card__meta">
            <span className="cs-complaint-card__meta-item">👍 {complaint.votes}</span>
            <span className="cs-complaint-card__meta-item">💬 {complaint.comments}</span>
          </div>
          <span className="cs-complaint-card__time">🕐 {timeAgo(complaint.createdAt)}</span>
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
        <div className="cs-modal__header">
          <span style={{ fontSize: 28 }}>{complaint.typeIcon}</span>
          <div>
            <div className="cs-modal__title">{complaint.title}</div>
            <div className="cs-modal__subtitle">#{complaint.id} · {complaint.type}</div>
          </div>
        </div>
        <StatusBadge status={complaint.status} />
        <div className="cs-modal__body">
          <div>
            <div className="cs-modal__field-label">Description</div>
            <div className="cs-modal__field-value">{complaint.description}</div>
          </div>
          <div className="cs-modal__grid">
            <div>
              <div className="cs-modal__field-label">Location</div>
              <div className="cs-modal__field-value">📍 {complaint.location}</div>
            </div>
            <div>
              <div className="cs-modal__field-label">Reported On</div>
              <div className="cs-modal__field-value">🕐 {formatDate(complaint.createdAt)}</div>
            </div>
            <div>
              <div className="cs-modal__field-label">Last Updated</div>
              <div className="cs-modal__field-value">🔄 {formatDate(complaint.updatedAt)}</div>
            </div>
            <div>
              <div className="cs-modal__field-label">Community</div>
              <div className="cs-modal__field-value">👍 {complaint.votes} votes · 💬 {complaint.comments} comments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const MOCK_USER = {
    name: user?.name || "Demo User",
    username: user?.username ? `@${user.username}` : "@demo_user",
    role: user?.role || "Citizen",
    avatar: user?.name ? getInitials(user.name) : "DU",
  };

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    }
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "received").length;
  const inProg = complaints.filter(c => c.status === "in_review").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  const filtered = complaints.filter(c => {
    const matchStatus = activeFilter === "all" || c.status === activeFilter;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filters = [
    { key: "all", label: "All", count: total },
    { key: "received", label: "Received", count: pending },
    { key: "in_review", label: "In Review", count: inProg },
    { key: "resolved", label: "Resolved", count: resolved },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cs-page">
      {/* Navbar */}
      <nav className="cs-navbar">
        <div className="cs-navbar__brand">
          <CleanStreetLogo size={42} />
          <span className="cs-navbar__name">CleanStreet</span>
        </div>
        <div className="cs-navbar__links">
          {["Dashboard", "Report Issue", "View Complaints"].map(label => (
            <span
              key={label}
              className={`cs-navbar__link ${label === "Dashboard" ? "cs-navbar__link--active" : ""}`}
              onClick={() => navigate(label === "Dashboard" ? "/dashboard" : label === "Report Issue" ? "/submit-complaint" : "/complaints")}
              style={{ cursor: "pointer" }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="cs-navbar__actions">
          <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={handleLogout} style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}>
            Logout
          </button>
          <div className="cs-avatar" onClick={() => navigate("/profile")} title="My Profile" style={{ cursor: "pointer" }}>
            {MOCK_USER.avatar}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="cs-main-content">
        {/* Hero */}
        <div className="cs-hero">
          <div className="cs-hero__content">
            <div className="cs-hero__eyebrow">🏙️ Civic Dashboard</div>
            <h1 className="cs-hero__title">Welcome back, {MOCK_USER.name} 👋</h1>
            <p className="cs-hero__subtitle">
              Help keep your community clean and safe. Report issues, track progress, and see the impact of your civic action.
            </p>
            <button className="cs-btn cs-btn--primary" onClick={() => navigate("/submit-complaint")}>➕ Report New Issue</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="cs-flex cs-gap-md cs-flex-wrap cs-mb-lg">
          <StatCard icon="⚠️" count={total} label="Total Issues" />
          <StatCard icon="⏳" count={pending} label="Pending" />
          <StatCard icon="🔄" count={inProg} label="In Progress" />
          <StatCard icon="✅" count={resolved} label="Resolved" />
        </div>

        {/* Filters */}
        <div className="cs-flex cs-gap-sm cs-mb-md">
          {filters.map(f => (
            <button
              key={f.key}
              className={`cs-btn cs-btn--sm ${activeFilter === f.key ? "cs-btn--active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label} ({f.count})
            </button>
          ))}
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="cs-input cs-input--sm"
            style={{ marginLeft: "auto" }}
          />
        </div>

        {/* Complaints List */}
        <div className="cs-grid cs-gap-md">
          {filtered.map(c => (
            <ComplaintCard key={c.id} complaint={c} onView={setSelectedComplaint} />
          ))}
        </div>
      </div>

      {/* Complaint Modal */}
      <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />

      {/* Chatbot */}
      <Chatbot />
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

  const QUICK_REPLIES = [
    "Take a tour 🗺️",
    "How do I report an issue?",
    "Track my complaint",
  ];

  const BOT_RESPONSES = {
    "take a tour": `🗺️ Welcome to CleanStreet! Here's a quick tour:\n\n1️⃣ **Dashboard** — See all your complaints, stats, and city health score at a glance.\n\n2️⃣ **Report Issue** — Spotted a pothole, broken light, or garbage dump? Click ➕ to file a complaint instantly.\n\n3️⃣ **Track Progress** — Each complaint moves through 3 stages: Received → In Review → Resolved.\n\n4️⃣ **Community** — Vote on issues, leave comments, and see what your neighbors are reporting.\n\n5️⃣ **Profile** — Manage your account, earn civic badges, and view your activity history.\n\nType anything below or pick a quick reply! 😊`,
    "how do i report an issue": "Click '➕ Report New Issue' in the navbar or hero section to submit a new civic complaint!",
    "track my complaint": "Go to 'View Complaints' in the navbar to see the status of all your reports.",
    "what issues are near me": "Use the '🗺️ Issue Map' in Quick Actions to see complaints in your area.",
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text };
    const key = text.toLowerCase().replace(/[^a-z\s]/g, "").trim();
    const matched = Object.keys(BOT_RESPONSES).find(k => key.includes(k));
    const botReply = matched
      ? BOT_RESPONSES[matched]
      : "I'm not sure about that. Try typing 'Take a tour' to learn about CleanStreet!";
    setMessages(prev => [...prev, userMsg, { from: "bot", text: botReply }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          border: "none", cursor: "pointer", fontSize: 24,
          boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s ease",
        }}
        title="Chat with us"
      >
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
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>CleanStreet Bot</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>● Online</div>
            </div>
          </div>

          <div style={{
            padding: "12px 14px", overflowY: "auto", height: 260,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "78%", padding: "8px 12px", borderRadius: 12,
                  fontSize: 13, lineHeight: 1.5,
                  background: m.from === "user" ? "#2563eb" : "#f1f5f9",
                  color: m.from === "user" ? "#fff" : "#111827",
                  borderBottomRightRadius: m.from === "user" ? 4 : 12,
                  borderBottomLeftRadius: m.from === "bot" ? 4 : 12,
                }}>
                  {m.text.split("\n").map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
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
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Type a message..."
              style={{
                flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 8,
                padding: "8px 12px", fontSize: 13, outline: "none", fontFamily: "inherit",
              }}
            />
            <button onClick={() => sendMessage(input)} style={{
              background: "#2563eb", border: "none", borderRadius: 8,
              color: "#fff", padding: "0 14px", cursor: "pointer", fontSize: 16,
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}