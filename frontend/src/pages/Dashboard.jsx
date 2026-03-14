import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import "../Dashboard.css";
import Navbar from "./Navbar";
import API from "../api";

const STATUS_CONFIG = {
  received:    { label: "Pending",     dot: "#3b82f6", bg: "#dbeafe", color: "#1d4ed8", step: 0 },
  pending:     { label: "Pending",     dot: "#3b82f6", bg: "#dbeafe", color: "#1d4ed8", step: 0 },
  assigned:    { label: "Assigned",    dot: "#f59e0b", bg: "#fef9c3", color: "#92400e", step: 1 },
  accepted:    { label: "Accepted",    dot: "#22c55e", bg: "#dcfce7", color: "#166534", step: 2 },
  in_review:   { label: "In Progress", dot: "#8b5cf6", bg: "#ede9fe", color: "#5b21b6", step: 3 },
  in_progress: { label: "In Progress", dot: "#8b5cf6", bg: "#ede9fe", color: "#5b21b6", step: 3 },
  resolved:    { label: "Resolved",    dot: "#22c55e", bg: "#dcfce7", color: "#166534", step: 4 },
  completed:   { label: "Completed",   dot: "#10b981", bg: "#d1fae5", color: "#065f46", step: 5 },
  denied:      { label: "Denied",      dot: "#ef4444", bg: "#fee2e2", color: "#991b1b", step: -1 },
};

const PROGRESS_STEPS = [
  { key: "received",  label: "Submitted",   icon: "📥" },
  { key: "assigned",  label: "Assigned",    icon: "👤" },
  { key: "accepted",  label: "Accepted",    icon: "✅" },
  { key: "in_review", label: "In Progress", icon: "🔄" },
  { key: "resolved",  label: "Resolved",    icon: "🎉" },
  { key: "completed", label: "Completed",   icon: "🏆" },
];

const STEP_COLORS = ["#3b82f6", "#f59e0b", "#22c55e", "#8b5cf6", "#22c55e", "#10b981"];

function getStepIndex(status) {
  if (!status) return 0;
  if (status === "in_progress") return PROGRESS_STEPS.findIndex(s => s.key === "in_review");
  if (status === "completed")   return PROGRESS_STEPS.length - 1;
  if (status === "pending")     return 0;
  return PROGRESS_STEPS.findIndex(s => s.key === status) ?? 0;
}

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.received;
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
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
    <div
      className="cs-complaint-card"
      onClick={() => onView(complaint)}
      style={{
        borderLeft: complaint.status === "denied"
          ? "3px solid #ef4444"
          : complaint.status === "completed"
          ? "3px solid #10b981"
          : "none",
      }}
    >
      {complaint.photo && (
        <div className="cs-complaint-card__img-wrap">
          <img src={`http://localhost:5001${complaint.photo}`} alt={complaint.type} className="cs-complaint-card__img" />
          <div className="cs-complaint-card__img-overlay" />
        </div>
      )}
      <div className="cs-complaint-card__body">
        <div className="cs-complaint-card__header">
          <span className="cs-complaint-card__title">{complaint.title}</span>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="cs-complaint-card__desc">{complaint.description}</p>
        <div className="cs-complaint-card__location"><span>📍</span><span>{complaint.location}</span></div>
        {complaint.assigned_to?.name && (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            👤 {complaint.status === "denied" ? "Denied by" : "Volunteer:"} <strong>{complaint.assigned_to.name}</strong>
          </div>
        )}
        <div className="cs-complaint-card__footer">
          <div className="cs-complaint-card__meta">
            <span className="cs-complaint-card__meta-item">👍 {complaint.upvotes || 0}</span>
            <span className="cs-complaint-card__meta-item">💬 {complaint.comments || 0}</span>
          </div>
          <span className="cs-complaint-card__time">🕐 {timeAgo(complaint.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;

  const isDenied    = complaint.status === "denied";
  const currentIdx  = isDenied ? -1 : getStepIndex(complaint.status);

  return (
    <div className="cs-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cs-modal">
        <button className="cs-modal__close" onClick={onClose}>×</button>

        {complaint.photo && (
          <div className="cs-modal__img-wrap">
            <img src={`http://localhost:5001${complaint.photo}`} alt={complaint.type} className="cs-modal__img" />
            <div className="cs-modal__img-overlay" />
            <div className="cs-modal__img-badge"><StatusBadge status={complaint.status} /></div>
          </div>
        )}

        <div className="cs-modal__header">
          <div>
            <div className="cs-modal__title">{complaint.title}</div>
            <div className="cs-modal__subtitle">
              #{String(complaint._id || complaint.id).slice(-6).toUpperCase()} · {complaint.type}
            </div>
          </div>
        </div>

        {!complaint.photo && (
          <div style={{ padding: "0 24px 8px" }}>
            <StatusBadge status={complaint.status} />
          </div>
        )}

        {/* Denied banner */}
        {isDenied && (
          <div style={{
            margin: "0 24px 16px", padding: "14px 16px",
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🚫</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#991b1b" }}>Volunteer Denied This Complaint</div>
                <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 2 }}>
                  {complaint.assigned_to?.name
                    ? `${complaint.assigned_to.name} declined this.`
                    : "The volunteer declined."} Admin will reassign shortly.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed banner */}
        {complaint.status === "completed" && (
          <div style={{
            margin: "0 24px 16px", padding: "14px 16px",
            background: "#ecfdf5", border: "1px solid #6ee7b7",
            borderRadius: 12, textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#065f46" }}>Issue Completed!</div>
            <div style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>Resolved and approved by admin. Thank you!</div>
          </div>
        )}

        {/* Progress Tracker */}
        {!isDenied && (
          <div style={{ padding: "16px 24px 0" }}>
            <div className="cs-progress">
              {PROGRESS_STEPS.map((step, i) => {
                const isActive  = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={step.key} style={{ display: "contents" }}>
                    <div className="cs-progress__step">
                      <div
                        className={`cs-progress__circle${isActive ? " cs-progress__circle--active" : ""}`}
                        style={
                          isActive
                            ? {
                                background: STEP_COLORS[i],
                                color: "#fff",
                                fontSize: 16,
                                boxShadow: isCurrent ? `0 0 0 4px ${STEP_COLORS[i]}30` : "none",
                                transform: isCurrent ? "scale(1.15)" : "scale(1)",
                                transition: "all 0.2s",
                              }
                            : {
                                background: "#f3f4f6",
                                color: "#9ca3af",
                                fontSize: 13,
                                border: "2px solid #e5e7eb",
                              }
                        }
                      >
                        {isActive ? step.icon : i + 1}
                      </div>
                      <span
                        className={`cs-progress__label${isActive ? " cs-progress__label--active" : ""}`}
                        style={{
                          color: isActive ? STEP_COLORS[i] : "#9ca3af",
                          fontWeight: isCurrent ? 700 : isActive ? 600 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < PROGRESS_STEPS.length - 1 && (
                      <div
                        className={`cs-progress__line${i < currentIdx ? " cs-progress__line--active" : ""}`}
                        style={i < currentIdx ? { background: STEP_COLORS[i] } : {}}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              <div className="cs-modal__field-label">Assigned To</div>
              <div className="cs-modal__field-value">
                {complaint.assigned_to?.name ? `👤 ${complaint.assigned_to.name}` : "Not yet assigned"}
              </div>
            </div>
            <div>
              <div className="cs-modal__field-label">Priority</div>
              <div className="cs-modal__field-value" style={{ textTransform: "capitalize" }}>
                🚨 {complaint.priority || "medium"}
              </div>
            </div>
            <div>
              <div className="cs-modal__field-label">Community</div>
              <div className="cs-modal__field-value">👍 {complaint.upvotes || 0} · 💬 {complaint.comments || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! 👋 I'm the CleanStreet assistant. How can I help you today?" }]);
  const [input, setInput]     = useState("");

  const QUICK_REPLIES = ["Take a tour 🗺️", "How do I report an issue?", "Track my complaint"];
  const BOT_RESPONSES = {
    "take a tour":             "🗺️ Welcome!\n\n1️⃣ Dashboard — See your complaints.\n2️⃣ Report Issue — File complaints.\n3️⃣ Track Progress — Submitted → Assigned → In Progress → Resolved → Completed.",
    "how do i report an issue": "Click '➕ Report New Issue' to submit a new civic complaint!",
    "track my complaint":       "Click any complaint card to see its full progress and the volunteer working on it.",
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const key     = text.toLowerCase().replace(/[^a-z\s]/g, "").trim();
    const matched = Object.keys(BOT_RESPONSES).find(k => key.includes(k));
    setMessages(prev => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: matched ? BOT_RESPONSES[matched] : "Try 'Take a tour' to learn about CleanStreet!" },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          border: "none", cursor: "pointer", fontSize: 24,
          boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 998,
          width: 320, background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)", border: "1px solid #e5e7eb",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
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
              <button key={i} onClick={() => sendMessage(q)} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "4px 10px", fontSize: 11.5, color: "#2563eb", cursor: "pointer", fontFamily: "inherit" }}>{q}</button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 12px", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
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

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, getInitials } = useAuth();

  const MOCK_USER = {
    name:     user?.name     || "Demo User",
    username: user?.username ? `@${user.username}` : "@demo_user",
    role:     user?.role     || "user",
    avatar:   user?.name     ? getInitials(user.name) : "DU",
  };

  const [complaints, setComplaints]               = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [refreshing, setRefreshing]               = useState(false);
  const [activeFilter, setActiveFilter]           = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery]             = useState("");

  const fetchComplaints = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true); else setRefreshing(true);
      const res = await API.get("/api/complaints/my");
      const raw = Array.isArray(res.data) ? res.data : res.data.complaints || [];
      setComplaints(raw.map(c => ({
        ...c,
        id:           c._id || c.id,
        location:     c.address || c.location || "No location",
        type:         c.type || c.issueType || "General",
        upvotes:      c.upvotes   || 0,
        downvotes:    c.downvotes || 0,
        commentsList: c.commentsList || [],
        comments:     c.comments  || 0,
        createdAt:    c.created_at || c.createdAt || new Date().toISOString(),
        updatedAt:    c.updated_at || c.updatedAt || new Date().toISOString(),
      })));
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(false); }, [fetchComplaints]);

  const total    = complaints.length;
  const pending  = complaints.filter(c => ["received", "pending"].includes(c.status)).length;
  const inProg   = complaints.filter(c => ["assigned", "accepted", "in_review", "in_progress"].includes(c.status)).length;
  const resolved = complaints.filter(c => ["resolved", "completed"].includes(c.status)).length;
  const denied   = complaints.filter(c => c.status === "denied").length;

  const filters = [
    { key: "all",       label: "All",         count: total    },
    { key: "received",  label: "Pending",     count: pending  },
    { key: "in_review", label: "In Progress", count: inProg   },
    { key: "resolved",  label: "Resolved",    count: resolved },
    ...(denied > 0 ? [{ key: "denied", label: "Denied", count: denied }] : []),
  ];

  const filtered = complaints.filter(c => {
    const groups = {
      all:       true,
      received:  ["received", "pending"].includes(c.status),
      in_review: ["assigned", "accepted", "in_review", "in_progress"].includes(c.status),
      resolved:  ["resolved", "completed"].includes(c.status),
      denied:    c.status === "denied",
    };
    return (groups[activeFilter] ?? true) && (
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const recentActivity = complaints.slice(0, 5).map(c => ({
    icon:  c.status === "completed" ? "🏆" : c.status === "resolved" ? "🎉" : c.status === "denied" ? "🚫" : c.status === "accepted" ? "✅" : ["in_review", "in_progress"].includes(c.status) ? "🔄" : c.status === "assigned" ? "👤" : "➕",
    text:  c.title,
    time:  timeAgo(c.createdAt),
    color: c.status === "completed" ? "#10b981" : c.status === "resolved" ? "#22c55e" : c.status === "denied" ? "#ef4444" : c.status === "accepted" ? "#16a34a" : ["in_review", "in_progress"].includes(c.status) ? "#8b5cf6" : c.status === "assigned" ? "#f59e0b" : "#3b82f6",
  }));

  return (
    <div className="cs-page">
      <Navbar />
      <div className="cs-main-content">

        {/* Hero */}
        <div className="cs-hero">
          <div className="cs-hero__content">
            <div className="cs-hero__eyebrow">🏙️ Civic Dashboard</div>
            <h1 className="cs-hero__title">Welcome back, {MOCK_USER.name} 👋</h1>
            <p className="cs-hero__subtitle">Report civic issues, track their progress, and see the impact of your action.</p>
            <button className="cs-btn cs-btn--primary" onClick={() => navigate("/submit-complaint")}>➕ Report New Issue</button>
          </div>
          <div className="cs-hero__img-wrap">
            <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" alt="City skyline" className="cs-hero__img" />
            <div className="cs-hero__img-overlay" />
            <div className="cs-hero__img-stats">
              <div className="cs-hero__img-stat"><span className="cs-hero__img-stat-num">{resolved}</span><span className="cs-hero__img-stat-label">Issues Resolved</span></div>
              <div className="cs-hero__img-stat-divider" />
              <div className="cs-hero__img-stat"><span className="cs-hero__img-stat-num">{total}</span><span className="cs-hero__img-stat-label">Total Reports</span></div>
            </div>
          </div>
        </div>

        {/* Denied Alert */}
        {denied > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🚫</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#991b1b" }}>{denied} of your complaint{denied > 1 ? "s were" : " was"} denied by a volunteer</div>
              <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 2 }}>Don't worry — admin will reassign it to another volunteer shortly.</div>
            </div>
          </div>
        )}

        <div className="cs-grid-sidebar">
          <div>
            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <StatCard icon="⚠️" count={total}   label="Total Issues"  />
              <StatCard icon="⏳" count={pending}  label="Pending"       />
              <StatCard icon="🔄" count={inProg}   label="In Progress"   />
              <StatCard icon="✅" count={resolved} label="Resolved"      />
              {denied > 0 && <StatCard icon="🚫" count={denied} label="Denied" />}
            </div>

            {/* Filter Bar */}
            <div className="cs-filter-bar">
              <div className="cs-filter-tabs">
                {filters.map(f => (
                  <button
                    key={f.key}
                    className={`cs-filter-tab${activeFilter === f.key ? " cs-filter-tab--active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}<span className="cs-filter-tab__count">{f.count}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  className="cs-input cs-search-input"
                  placeholder="🔍 Search complaints..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => fetchComplaints(true)}
                  title="Refresh"
                  style={{ background: "#f4f6fb", border: "1px solid #e5e9f2", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 14, color: "#64748b" }}
                >
                  <span style={{ display: "inline-block", animation: refreshing ? "spin-r 0.7s linear infinite" : "none" }}>🔄</span>
                  <style>{`@keyframes spin-r { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                </button>
              </div>
            </div>

            {/* Complaints Grid */}
            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                <div>Loading complaints…</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="cs-empty"><div className="cs-empty__icon">📭</div><div className="cs-empty__title">No complaints found</div><div className="cs-empty__desc">Try adjusting your search or filter.</div></div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                {filtered.map(c => <ComplaintCard key={c._id || c.id} complaint={c} onView={setSelectedComplaint} />)}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Profile Card */}
            <div className="cs-profile-card">
              <div className="cs-avatar cs-avatar--lg">{MOCK_USER.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a8a" }}>{MOCK_USER.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{MOCK_USER.username}</div>
                <span className="cs-badge cs-badge--role" style={{ marginTop: 4 }}>🧑‍💼 {MOCK_USER.role}</span>
              </div>
            </div>

            {/* How It Works */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">📋 How It Works</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {[
                  { icon: "📥", label: "Submitted",   desc: "Your complaint is logged",          color: "#3b82f6" },
                  { icon: "👤", label: "Assigned",    desc: "Volunteer assigned by admin",        color: "#f59e0b" },
                  { icon: "✅", label: "Accepted",    desc: "Volunteer accepted the task",        color: "#22c55e" },
                  { icon: "🔄", label: "In Progress", desc: "Volunteer started working",          color: "#8b5cf6" },
                  { icon: "🎉", label: "Resolved",    desc: "Work done, awaiting admin approval", color: "#22c55e" },
                  { icon: "🏆", label: "Completed",   desc: "Admin approved — all done!",         color: "#10b981" },
                  { icon: "🚫", label: "Denied",      desc: "Volunteer declined, will reassign",  color: "#ef4444" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* City Health Score */}
            <div className="cs-health-card">
              <div className="cs-health-card__label">📊 City Health Score</div>
              <div className="cs-health-card__score">{total > 0 ? Math.round((resolved / total) * 100) : 0}<span>/100</span></div>
              <div className="cs-health-bar">
                <div className="cs-health-bar__fill" style={{ width: total > 0 ? `${Math.round((resolved / total) * 100)}%` : "0%" }} />
              </div>
              <div className="cs-health-card__note">{total > 0 ? `${resolved} of ${total} issues resolved` : "No issues reported yet"}</div>
            </div>

            {/* Quick Actions */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">⚡ Quick Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                <button className="cs-btn cs-btn--primary cs-btn--full" onClick={() => navigate("/submit-complaint")}>➕ Report New Issue</button>
                <button className="cs-btn cs-btn--outline cs-btn--full" onClick={() => navigate("/complaints")}>🗂️ View All Complaints</button>
                <button className="cs-btn cs-btn--outline cs-btn--full" onClick={() => navigate("/map")}>🗺️ Issue Map</button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">🕐 Recent Activity</div>
              <div className="cs-activity-list" style={{ marginTop: 12 }}>
                {recentActivity.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No recent activity yet.</div>
                ) : (
                  recentActivity.map((a, i) => (
                    <div key={i} className="cs-activity-item">
                      <div className="cs-activity-item__icon" style={{ background: a.color + "20" }}>{a.icon}</div>
                      <div>
                        <div className="cs-activity-item__text">{a.text}</div>
                        <div className="cs-activity-item__time">{a.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
      <Chatbot />
    </div>
  );
}