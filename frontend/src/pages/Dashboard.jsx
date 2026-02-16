import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Dashboard.css";
// adjust path based on your folder structure

// ─── Mock Data ────────────────────────────────────────────────────────────────
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
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
  },
];

const ACTIVITY = [
  { icon: "✅", text: "Pothole on Main Street resolved", time: "2 hours ago", colorHex: "#22c55e" },
  { icon: "➕", text: "New streetlight issue reported", time: "4 hours ago", colorHex: "#3b82f6" },
  { icon: "🔄", text: "Garbage dump complaint updated", time: "6 hours ago", colorHex: "#f59e0b" },
  { icon: "💬", text: "New comment on your water leak report", time: "1 day ago", colorHex: "#8b5cf6" },
];

const STATUS_LABELS = { received: "Received", in_review: "In Review", resolved: "Resolved" };
const STATUS_DOT_COLORS = { received: "#3b82f6", in_review: "#f59e0b", resolved: "#22c55e" };
const PROGRESS_STEPS = ["received", "in_review", "resolved"];

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

// ─── Custom SVG Logo ──────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6"/>
          <stop offset="100%" stopColor="#81d4fa"/>
        </linearGradient>
        <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a"/>
          <stop offset="100%" stopColor="#388e3c"/>
        </linearGradient>
        <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c"/>
          <stop offset="100%" stopColor="#546e7a"/>
        </linearGradient>
        <clipPath id="circleClip">
          <circle cx="100" cy="100" r="86"/>
        </clipPath>
      </defs>

      {/* Outer rings */}
      <circle cx="100" cy="100" r="98" fill="white"/>
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2"/>

      {/* Sky */}
      <circle cx="100" cy="100" r="87" fill="url(#skyGrad)"/>

      <g clipPath="url(#circleClip)">
        {/* Buildings */}
        <g fill="white">
          <rect x="25" y="78" width="16" height="32"/>
          <rect x="27" y="80" width="3" height="3" fill="#90caf9"/><rect x="32" y="80" width="3" height="3" fill="#90caf9"/>
          <rect x="27" y="86" width="3" height="3" fill="#90caf9"/><rect x="32" y="86" width="3" height="3" fill="#90caf9"/>

          <rect x="42" y="60" width="18" height="50"/>
          <rect x="50" y="52" width="2" height="9" fill="white"/>
          <rect x="44" y="64" width="4" height="4" fill="#90caf9"/><rect x="51" y="64" width="4" height="4" fill="#90caf9"/>
          <rect x="44" y="72" width="4" height="4" fill="#90caf9"/><rect x="51" y="72" width="4" height="4" fill="#90caf9"/>
          <rect x="44" y="80" width="4" height="4" fill="#90caf9"/><rect x="51" y="80" width="4" height="4" fill="#90caf9"/>

          <rect x="62" y="50" width="20" height="60"/>
          <rect x="71" y="42" width="2" height="10" fill="white"/>
          <rect x="64" y="54" width="5" height="5" fill="#90caf9"/><rect x="72" y="54" width="5" height="5" fill="#90caf9"/>
          <rect x="64" y="63" width="5" height="5" fill="#90caf9"/><rect x="72" y="63" width="5" height="5" fill="#90caf9"/>
          <rect x="64" y="72" width="5" height="5" fill="#90caf9"/><rect x="72" y="72" width="5" height="5" fill="#90caf9"/>
          <rect x="64" y="81" width="5" height="5" fill="#90caf9"/><rect x="72" y="81" width="5" height="5" fill="#90caf9"/>

          <rect x="84" y="58" width="18" height="52"/>
          <rect x="86" y="62" width="4" height="4" fill="#90caf9"/><rect x="93" y="62" width="4" height="4" fill="#90caf9"/>
          <rect x="86" y="70" width="4" height="4" fill="#90caf9"/><rect x="93" y="70" width="4" height="4" fill="#90caf9"/>
          <rect x="86" y="78" width="4" height="4" fill="#90caf9"/><rect x="93" y="78" width="4" height="4" fill="#90caf9"/>

          <rect x="104" y="65" width="16" height="45"/>
          <rect x="106" y="68" width="4" height="4" fill="#90caf9"/><rect x="112" y="68" width="4" height="4" fill="#90caf9"/>
          <rect x="106" y="76" width="4" height="4" fill="#90caf9"/><rect x="112" y="76" width="4" height="4" fill="#90caf9"/>
          <rect x="106" y="84" width="4" height="4" fill="#90caf9"/>

          <rect x="121" y="74" width="16" height="36"/>
          <rect x="123" y="78" width="3" height="3" fill="#90caf9"/><rect x="129" y="78" width="3" height="3" fill="#90caf9"/>
          <rect x="123" y="85" width="3" height="3" fill="#90caf9"/><rect x="129" y="85" width="3" height="3" fill="#90caf9"/>
        </g>

        {/* Back hill */}
        <ellipse cx="100" cy="132" rx="95" ry="44" fill="#81c784"/>

        {/* Front hill */}
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGrad)"/>

        {/* Road */}
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGrad)"/>
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3"/>
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3"/>
        <line x1="100" y1="150" x2="100" y2="140" stroke="white" strokeWidth="1.5" strokeDasharray="3,3"/>

        {/* Trees */}
        <circle cx="48" cy="130" r="10" fill="#2e7d32"/>
        <circle cx="42" cy="136" r="9" fill="#43a047"/>
        <circle cx="54" cy="136" r="9" fill="#43a047"/>
        <rect x="47" y="142" width="3" height="7" fill="#5d4037"/>

        <circle cx="152" cy="130" r="10" fill="#2e7d32"/>
        <circle cx="146" cy="136" r="9" fill="#43a047"/>
        <circle cx="158" cy="136" r="9" fill="#43a047"/>
        <rect x="151" y="142" width="3" height="7" fill="#5d4037"/>

        <circle cx="70" cy="140" r="7" fill="#1b5e20"/>
        <circle cx="64" cy="145" r="6" fill="#2e7d32"/>
        <circle cx="76" cy="145" r="6" fill="#2e7d32"/>
        <rect x="69" y="150" width="2" height="5" fill="#5d4037"/>

        <circle cx="130" cy="140" r="7" fill="#1b5e20"/>
        <circle cx="124" cy="145" r="6" fill="#2e7d32"/>
        <circle cx="136" cy="145" r="6" fill="#2e7d32"/>
        <rect x="129" y="150" width="2" height="5" fill="#5d4037"/>

        {/* Birds */}
        <path d="M132,44 Q134,41 136,44" stroke="#37474f" strokeWidth="1.2" fill="none"/>
        <path d="M142,37 Q144,34 146,37" stroke="#37474f" strokeWidth="1.2" fill="none"/>
        <path d="M150,46 Q152,43 154,46" stroke="#37474f" strokeWidth="1.2" fill="none"/>
      </g>

      {/* Green border ring */}
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3"/>

      {/* Curved "CLEAN STREETS" text */}
      <path id="csTextArc" d="M 26,100 A 74,74 0 0,1 174,100" fill="none"/>
      <text fontFamily="'Arial Rounded MT Bold', Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csTextArc" startOffset="7%">CLEAN STREETS</textPath>
      </text>

      {/* Left leaf */}
      <g transform="translate(12,106) rotate(-15)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)"/>
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)"/>
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)"/>
      </g>
      {/* Right leaf */}
      <g transform="translate(188,106) rotate(15) scale(-1,1)">
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="#4caf50" transform="rotate(-35)"/>
        <ellipse cx="6" cy="-4" rx="6" ry="2.5" fill="#66bb6a" transform="rotate(-65)"/>
        <ellipse cx="-2" cy="5" rx="5" ry="2.5" fill="#388e3c" transform="rotate(5)"/>
      </g>
    </svg>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`cs-badge cs-badge--${status}`}>
      <span className="cs-badge__dot" style={{ background: STATUS_DOT_COLORS[status] }} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon, count, label, iconBgClass, trend }) {
  return (
    <div className="cs-stat-card">
      <div className={`cs-stat-card__icon ${iconBgClass}`}>{icon}</div>
      <div className="cs-stat-card__count">{count}</div>
      <div className="cs-stat-card__label">{label}</div>
      {trend && <div className="cs-stat-card__trend">{trend}</div>}
    </div>
  );
}

// ─── ComplaintCard ────────────────────────────────────────────────────────────
function ComplaintCard({ complaint, onView }) {
  return (
    <div className="cs-complaint-card" onClick={() => onView(complaint)}>
      {complaint.image && (
        <div className="cs-complaint-card__img-wrap">
          <img
            src={complaint.image}
            alt={complaint.type}
            className="cs-complaint-card__img"
            onError={e => { e.target.parentNode.style.display = 'none'; }}
          />
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

// ─── ComplaintDetailModal ─────────────────────────────────────────────────────
function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;
  const currentIdx = PROGRESS_STEPS.indexOf(complaint.status);

  return (
    <div className="cs-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cs-modal">
        <button className="cs-modal__close" onClick={onClose}>×</button>

        {complaint.image ? (
          <div className="cs-modal__img-wrap">
            <img src={complaint.image} alt={complaint.type} className="cs-modal__img" onError={e => { e.target.parentNode.style.display = 'none'; }} />
            <div className="cs-modal__img-overlay" />
            <div className="cs-modal__img-badge">
              <span style={{ fontSize: 24 }}>{complaint.typeIcon}</span>
              <div>
                <div className="cs-modal__title" style={{ color: '#fff' }}>{complaint.title}</div>
                <div className="cs-modal__subtitle" style={{ color: 'rgba(255,255,255,0.75)' }}>#{complaint.id} · {complaint.type}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cs-modal__header">
            <span style={{ fontSize: 28 }}>{complaint.typeIcon}</span>
            <div>
              <div className="cs-modal__title">{complaint.title}</div>
              <div className="cs-modal__subtitle">#{complaint.id} · {complaint.type}</div>
            </div>
          </div>
        )}

        <div style={{ margin: '12px 0 4px' }}>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="cs-modal__body">
          <div>
            <div className="cs-modal__field-label">Description</div>
            <div className="cs-modal__field-value" style={{ lineHeight: 1.6 }}>{complaint.description}</div>
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
          <div>
            <div className="cs-modal__field-label" style={{ marginBottom: 10 }}>Progress</div>
            <div className="cs-progress">
              {PROGRESS_STEPS.map((step, i) => {
                const active = i <= currentIdx;
                const dotColor = STATUS_DOT_COLORS[step];
                return (
                  <div key={step} className="cs-flex cs-items-center cs-flex-1">
                    <div className="cs-progress__step">
                      <div className={`cs-progress__circle ${active ? "cs-progress__circle--active" : ""}`} style={active ? { background: dotColor } : {}}>
                        {i + 1}
                      </div>
                      <span className={`cs-progress__label ${active ? "cs-progress__label--active" : ""}`} style={active ? { color: dotColor } : {}}>
                        {STATUS_LABELS[step]}
                      </span>
                    </div>
                    {i < PROGRESS_STEPS.length - 1 && (
                      <div className={`cs-progress__line ${i < currentIdx ? "cs-progress__line--active" : ""}`} />
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
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const total = MOCK_COMPLAINTS.length;
  const pending = MOCK_COMPLAINTS.filter(c => c.status === "received").length;
  const inProg = MOCK_COMPLAINTS.filter(c => c.status === "in_review").length;
  const resolved = MOCK_COMPLAINTS.filter(c => c.status === "resolved").length;

  const filtered = MOCK_COMPLAINTS.filter(c => {
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
            { label: "Dashboard",       path: "/dashboard" },
            { label: "Report Issue",    path: "/report"    },
            { label: "View Complaints", path: "/complaints"},
          ].map(item => (
            <span
              key={item.label}
              className={`cs-navbar__link ${item.label === "Dashboard" ? "cs-navbar__link--active" : ""}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="cs-navbar__actions">
          <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => navigate('/login')}>Login</button>
          <button className="cs-btn--register" onClick={() => navigate('/signup')}>Register</button>
          <div className="cs-avatar" onClick={() => navigate('/profile')} title="My Profile" style={{ cursor: "pointer" }}>
            {MOCK_USER.avatar}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="cs-main-content">

        {/* ── Hero Banner ── */}
        <div className="cs-hero">
          <div className="cs-hero__content">
            <div className="cs-hero__eyebrow">🏙️ Civic Dashboard</div>
            <h1 className="cs-hero__title">Welcome back, {MOCK_USER.name} 👋</h1>
            <p className="cs-hero__subtitle">
              Help keep your community clean and safe. Report issues, track
              progress, and see the impact of your civic action.
            </p>
            <button className="cs-btn cs-btn--primary" onClick={() => navigate('/report')}>
              ➕ Report New Issue
            </button>
          </div>
          <div className="cs-hero__img-wrap">
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80"
              alt="Clean city skyline"
              className="cs-hero__img"
              onError={e => { e.target.parentNode.style.display = 'none'; }}
            />
            <div className="cs-hero__img-overlay" />
            <div className="cs-hero__img-stats">
              <div className="cs-hero__img-stat">
                <span className="cs-hero__img-stat-num">248</span>
                <span className="cs-hero__img-stat-label">Issues Resolved</span>
              </div>
              <div className="cs-hero__img-stat-divider" />
              <div className="cs-hero__img-stat">
                <span className="cs-hero__img-stat-num">1.2k</span>
                <span className="cs-hero__img-stat-label">Active Citizens</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="cs-flex cs-gap-md cs-flex-wrap cs-mb-lg">
          <StatCard icon="⚠️" count={total} label="Total Issues" iconBgClass="cs-icon-bg-blue" trend="↑ 2 this week" />
          <StatCard icon="🕐" count={pending} label="Pending" iconBgClass="cs-icon-bg-yellow" trend="Awaiting review" />
          <StatCard icon="🔄" count={inProg} label="In Progress" iconBgClass="cs-icon-bg-purple" trend="Being handled" />
          <StatCard icon="✅" count={resolved} label="Resolved" iconBgClass="cs-icon-bg-green" trend="↑ 1 today" />
        </div>

        {/* ── Two-column Layout ── */}
        <div className="cs-grid-sidebar">

          {/* ── Complaints Section ── */}
          <div>
            <div className="cs-filter-bar">
              <div className="cs-filter-tabs">
                {filters.map(f => (
                  <button key={f.key} className={`cs-filter-tab ${activeFilter === f.key ? "cs-filter-tab--active" : ""}`} onClick={() => setActiveFilter(f.key)}>
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

            {filtered.length > 0 ? (
              <div className="cs-flex-col cs-gap-sm">
                {filtered.map(c => <ComplaintCard key={c.id} complaint={c} onView={setSelectedComplaint} />)}
              </div>
            ) : (
              <div className="cs-empty">
                <div className="cs-empty__icon">📭</div>
                <div className="cs-empty__title">No complaints found</div>
                <div className="cs-empty__desc">Try changing filters or submit a new report.</div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="cs-flex-col cs-gap-md">

            {/* City Health Score */}
            <div className="cs-health-card">
              <div className="cs-health-card__label">🏙️ City Health Score</div>
              <div className="cs-health-card__score">74<span>/100</span></div>
              <div className="cs-health-bar">
                <div className="cs-health-bar__fill" style={{ width: '74%' }} />
              </div>
              <div className="cs-health-card__note">↑ 3 points from last month</div>
            </div>

            {/* Quick Actions */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">⚡ Quick Actions</div>
              <div className="cs-flex-col cs-gap-sm">
                <button className="cs-btn cs-btn--primary cs-btn--full" onClick={() => navigate('/report')}>➕ Report New Issue</button>
                <button className="cs-btn cs-btn--secondary cs-btn--full" style={{ textAlign: "left" }} onClick={() => navigate('/complaints')}>📋 View All Complaints</button>
                <button className="cs-btn cs-btn--secondary cs-btn--full" style={{ textAlign: "left" }} onClick={() => navigate('/map')}>🗺️ Issue Map</button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cs-sidebar-card">
              <div className="cs-sidebar-card__title">🕐 Recent Activity</div>
              <div className="cs-activity-list">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="cs-activity-item">
                    <div className="cs-activity-item__icon" style={{ background: a.colorHex + "18" }}>{a.icon}</div>
                    <div>
                      <div className="cs-activity-item__text">{a.text}</div>
                      <div className="cs-activity-item__time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Snapshot — click to go to profile */}
            <div className="cs-profile-card" onClick={() => navigate('/profile')} style={{ cursor: "pointer" }} title="View Profile">
              <div className="cs-avatar cs-avatar--lg">{MOCK_USER.avatar}</div>
              <div>
                <div className="cs-font-bold cs-text-md">{MOCK_USER.name}</div>
                <div className="cs-text-sm cs-text-muted">{MOCK_USER.username}</div>
                <span className="cs-badge cs-badge--role cs-mt-sm" style={{ display: "inline-block" }}>{MOCK_USER.role}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
    </div>
  );
}