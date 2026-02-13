import { useState } from "react";
import "../cleanstreet.css"; // adjust path based on your folder structure

// ─── Mock Data (replace with API calls) ──────────────────────────────────────
const MOCK_USER = {
  name: "Demo User",
  username: "@demo_user",
  role: "Citizen",
  avatar: "DU",
};

const MOCK_COMPLAINTS = [
  {
    id: 1,
    title: "Large pothole on Main Street",
    type: "Pothole",
    typeIcon: "🕳️",
    status: "in_review",
    location: "Main Street & Oak Avenue",
    description: "Deep pothole causing vehicle damage near the intersection.",
    createdAt: "2025-07-10T08:00:00Z",
    updatedAt: "2025-07-11T10:00:00Z",
    votes: 12,
    comments: 3,
  },
  {
    id: 2,
    title: "Broken streetlight on Elm Ave",
    type: "Streetlight",
    typeIcon: "💡",
    status: "received",
    location: "Elm Avenue near Park",
    description: "Streetlight has been out for 2 weeks creating safety issues.",
    createdAt: "2025-07-08T14:00:00Z",
    updatedAt: "2025-07-08T14:00:00Z",
    votes: 7,
    comments: 1,
  },
  {
    id: 3,
    title: "Garbage dump near school",
    type: "Garbage",
    typeIcon: "🗑️",
    status: "resolved",
    location: "Westfield School, Back Road",
    description: "Illegal garbage dump attracting pests near school premises.",
    createdAt: "2025-07-01T09:00:00Z",
    updatedAt: "2025-07-12T16:00:00Z",
    votes: 24,
    comments: 8,
  },
  {
    id: 4,
    title: "Water leakage on 5th Street",
    type: "Water Leak",
    typeIcon: "💧",
    status: "received",
    location: "5th Street between Elm & Oak",
    description: "Main water pipe leaking and flooding the sidewalk.",
    createdAt: "2025-07-13T07:30:00Z",
    updatedAt: "2025-07-13T07:30:00Z",
    votes: 5,
    comments: 0,
  },
];

const ACTIVITY = [
  { icon: "✅", text: "Pothole on Main Street resolved",       time: "2 hours ago", colorHex: "#22c55e" },
  { icon: "➕", text: "New streetlight issue reported",         time: "4 hours ago", colorHex: "#3b82f6" },
  { icon: "🔄", text: "Garbage dump complaint updated",         time: "6 hours ago", colorHex: "#f59e0b" },
  { icon: "💬", text: "New comment on your water leak report",  time: "1 day ago",   colorHex: "#8b5cf6" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  received:  "Received",
  in_review: "In Review",
  resolved:  "Resolved",
};

const STATUS_DOT_COLORS = {
  received:  "#3b82f6",
  in_review: "#f59e0b",
  resolved:  "#22c55e",
};

const PROGRESS_STEPS = ["received", "in_review", "resolved"];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`cs-badge cs-badge--${status}`}>
      <span
        className="cs-badge__dot"
        style={{ background: STATUS_DOT_COLORS[status] }}
      />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon, count, label, iconBgClass }) {
  return (
    <div className="cs-stat-card">
      <div className={`cs-stat-card__icon ${iconBgClass}`}>{icon}</div>
      <div className="cs-stat-card__count">{count}</div>
      <div className="cs-stat-card__label">{label}</div>
    </div>
  );
}

// ─── ComplaintCard ────────────────────────────────────────────────────────────
function ComplaintCard({ complaint, onView }) {
  return (
    <div className="cs-complaint-card" onClick={() => onView(complaint)}>
      <div className="cs-complaint-card__header">
        <div className="cs-complaint-card__title-row">
          <span style={{ fontSize: 20 }}>{complaint.typeIcon}</span>
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
  );
}

// ─── ComplaintDetailModal ─────────────────────────────────────────────────────
function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;
  const currentIdx = PROGRESS_STEPS.indexOf(complaint.status);

  return (
    <div
      className="cs-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
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
            <div className="cs-modal__field-value" style={{ lineHeight: 1.6 }}>
              {complaint.description}
            </div>
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
              <div className="cs-modal__field-value">
                👍 {complaint.votes} votes · 💬 {complaint.comments} comments
              </div>
            </div>
          </div>

          {/* Status Progress Tracker */}
          <div>
            <div className="cs-modal__field-label" style={{ marginBottom: 10 }}>Progress</div>
            <div className="cs-progress">
              {PROGRESS_STEPS.map((step, i) => {
                const active = i <= currentIdx;
                const dotColor = STATUS_DOT_COLORS[step];
                return (
                  <div key={step} className="cs-flex cs-items-center cs-flex-1">
                    <div className="cs-progress__step">
                      <div
                        className={`cs-progress__circle ${active ? "cs-progress__circle--active" : ""}`}
                        style={active ? { background: dotColor } : {}}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`cs-progress__label ${active ? "cs-progress__label--active" : ""}`}
                        style={active ? { color: dotColor } : {}}
                      >
                        {STATUS_LABELS[step]}
                      </span>
                    </div>
                    {i < PROGRESS_STEPS.length - 1 && (
                      <div
                        className={`cs-progress__line ${i < currentIdx ? "cs-progress__line--active" : ""}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [activeFilter, setActiveFilter]           = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery]             = useState("");

  const total    = MOCK_COMPLAINTS.length;
  const pending  = MOCK_COMPLAINTS.filter(c => c.status === "received").length;
  const inProg   = MOCK_COMPLAINTS.filter(c => c.status === "in_review").length;
  const resolved = MOCK_COMPLAINTS.filter(c => c.status === "resolved").length;

  const filtered = MOCK_COMPLAINTS.filter(c => {
    const matchStatus = activeFilter === "all" || c.status === activeFilter;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filters = [
    { key: "all",       label: "All",       count: total    },
    { key: "received",  label: "Received",  count: pending  },
    { key: "in_review", label: "In Review", count: inProg   },
    { key: "resolved",  label: "Resolved",  count: resolved },
  ];

  return (
    <div className="cs-page">

      {/* ── Navbar ── */}
      <nav className="cs-navbar">
        <div className="cs-navbar__brand">
          <div className="cs-navbar__logo">🔁</div>
          <span className="cs-navbar__name">CleanStreet</span>
        </div>

        <div className="cs-navbar__links">
          {["Dashboard", "Report Issue", "View Complaints"].map(item => (
            <span
              key={item}
              className={`cs-navbar__link ${item === "Dashboard" ? "cs-navbar__link--active" : ""}`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="cs-navbar__actions">
          <button className="cs-btn cs-btn--outline cs-btn--sm">Login</button>
          <button className="cs-btn--register">Register</button>
          <div className="cs-avatar">{MOCK_USER.avatar}</div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="cs-main-content">

        {/* ── Welcome Row ── */}
        <div className="cs-section-header">
          <div>
            <h1 className="cs-section-header__title">
              Welcome back, {MOCK_USER.name} 👋
            </h1>
            <p className="cs-section-header__subtitle">
              Here's an overview of your civic reports and activity.
            </p>
          </div>
          <button className="cs-btn cs-btn--primary">
            ➕ Report New Issue
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="cs-flex cs-gap-md cs-flex-wrap cs-mb-lg">
          <StatCard icon="⚠️" count={total}    label="Total Issues"  iconBgClass="cs-icon-bg-blue"   />
          <StatCard icon="🕐" count={pending}   label="Pending"       iconBgClass="cs-icon-bg-yellow" />
          <StatCard icon="🔄" count={inProg}    label="In Progress"   iconBgClass="cs-icon-bg-purple" />
          <StatCard icon="✅" count={resolved}   label="Resolved"      iconBgClass="cs-icon-bg-green"  />
        </div>

        {/* ── Two-column Layout ── */}
        <div className="cs-grid-sidebar">

          {/* ── Complaints Section ── */}
          <div>
            {/* Filter Bar */}
            <div className="cs-filter-bar">
              <div className="cs-filter-tabs">
                {filters.map(f => (
                  <button
                    key={f.key}
                    className={`cs-filter-tab ${activeFilter === f.key ? "cs-filter-tab--active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                    <span className="cs-filter-tab__count">{f.count}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="cs-input cs-search-input"
                placeholder="🔍 Search complaints..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Complaint Cards */}
            {filtered.length > 0 ? (
              <div className="cs-flex-col cs-gap-sm">
                {filtered.map(c => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    onView={setSelectedComplaint}
                  />
                ))}
              </div>
            ) : (
              <div className="cs-empty">
                <div className="cs-empty__icon">📭</div>
                <div className="cs-empty__title">No complaints found</div>
                <div className="cs-empty__desc">
                  Try changing filters or submit a new report.
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="cs-flex-col cs-gap-md">

            {/* Quick Actions */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">⚡ Quick Actions</div>
              <div className="cs-flex-col cs-gap-sm">
                <button className="cs-btn cs-btn--primary cs-btn--full">
                  ➕ Report New Issue
                </button>
                <button className="cs-btn cs-btn--secondary cs-btn--full" style={{ textAlign: "left" }}>
                  📋 View All Complaints
                </button>
                <button className="cs-btn cs-btn--secondary cs-btn--full" style={{ textAlign: "left" }}>
                  🗺️ Issue Map
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">🕐 Recent Activity</div>
              <div className="cs-activity-list">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="cs-activity-item">
                    <div
                      className="cs-activity-item__icon"
                      style={{ background: a.colorHex + "18" }}
                    >
                      {a.icon}
                    </div>
                    <div>
                      <div className="cs-activity-item__text">{a.text}</div>
                      <div className="cs-activity-item__time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Snapshot */}
            <div className="cs-profile-card">
              <div className="cs-avatar cs-avatar--lg">{MOCK_USER.avatar}</div>
              <div>
                <div className="cs-font-bold cs-text-md">{MOCK_USER.name}</div>
                <div className="cs-text-sm cs-text-muted">{MOCK_USER.username}</div>
                <span className="cs-badge cs-badge--role cs-mt-sm" style={{ display: "inline-block" }}>
                  {MOCK_USER.role}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
}
