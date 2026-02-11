import { useState } from "react";

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
  { icon: "✅", text: "Pothole on Main Street resolved", time: "2 hours ago", color: "#22c55e" },
  { icon: "➕", text: "New streetlight issue reported", time: "4 hours ago", color: "#3b82f6" },
  { icon: "🔄", text: "Garbage dump complaint updated", time: "6 hours ago", color: "#f59e0b" },
  { icon: "💬", text: "New comment on your water leak report", time: "1 day ago", color: "#8b5cf6" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  received:  { label: "Received",  bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  in_review: { label: "In Review", bg: "#fef9c3", color: "#92400e", dot: "#f59e0b" },
  resolved:  { label: "Resolved",  bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
};

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, count, label, accent }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: "22px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      border: "1px solid #f0f0f0",
      flex: 1,
      minWidth: 110,
      transition: "transform 0.18s, box-shadow 0.18s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.10)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.07)";
    }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: accent + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 2,
      }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, letterSpacing: 0.2 }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.received;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      borderRadius: 20, padding: "3px 10px",
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function ComplaintCard({ complaint, onView }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "box-shadow 0.18s, border-color 0.18s",
      cursor: "pointer",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.10)";
      e.currentTarget.style.borderColor = "#bfdbfe";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#e5e7eb";
    }}
    onClick={() => onView(complaint)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 20 }}>{complaint.typeIcon}</span>
          <span style={{
            fontWeight: 600, fontSize: 14, color: "#111827",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{complaint.title}</span>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p style={{
        fontSize: 13, color: "#6b7280", margin: 0,
        overflow: "hidden", textOverflow: "ellipsis",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        lineHeight: 1.5,
      }}>
        {complaint.description}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#3b82f6" }}>
        <span>📍</span>
        <span>{complaint.location}</span>
      </div>

      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid #f3f4f6",
        paddingTop: 10, marginTop: 2,
      }}>
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
            👍 {complaint.votes}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
            💬 {complaint.comments}
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          🕐 {timeAgo(complaint.createdAt)}
        </span>
      </div>
    </div>
  );
}

function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;
  const steps = ["received", "in_review", "resolved"];
  const currentIdx = steps.indexOf(complaint.status);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "#f3f4f6", border: "none", borderRadius: "50%",
          width: 32, height: 32, cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>{complaint.typeIcon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{complaint.title}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>#{complaint.id} · {complaint.type}</div>
          </div>
        </div>

        <StatusBadge status={complaint.status} />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Description</div>
            <div style={{ fontSize: 14, color: "#374151", marginTop: 4, lineHeight: 1.6 }}>{complaint.description}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Location</div>
              <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>📍 {complaint.location}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Reported On</div>
              <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>🕐 {formatDate(complaint.createdAt)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Last Updated</div>
              <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>🔄 {formatDate(complaint.updatedAt)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>Community</div>
              <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>👍 {complaint.votes} · 💬 {complaint.comments}</div>
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Progress</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {steps.map((s, i) => {
              const active = i <= currentIdx;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: active ? cfg.dot : "#e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: active ? "#fff" : "#9ca3af", fontWeight: 700,
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 10, color: active ? cfg.color : "#9ca3af", fontWeight: active ? 600 : 400 }}>
                      {cfg.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div style={{
                      flex: 1, height: 3, margin: "0 4px", marginBottom: 18,
                      background: i < currentIdx ? "#3b82f6" : "#e5e7eb",
                      borderRadius: 4,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const total    = MOCK_COMPLAINTS.length;
  const pending  = MOCK_COMPLAINTS.filter(c => c.status === "received").length;
  const inProg   = MOCK_COMPLAINTS.filter(c => c.status === "in_review").length;
  const resolved = MOCK_COMPLAINTS.filter(c => c.status === "resolved").length;

  const filtered = MOCK_COMPLAINTS.filter(c => {
    const matchStatus = activeFilter === "all" || c.status === activeFilter;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div style={{
      fontFamily: "'DM Sans', 'Outfit', 'Segoe UI', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      color: "#111827",
    }}>
      {/* ── Navbar ── */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 28px",
        height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 0 #e5e7eb",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            borderRadius: 8, width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🔁</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1d4ed8" }}>CleanStreet</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Dashboard", "Report Issue", "View Complaints"].map(item => (
            <span key={item} style={{
              fontSize: 13.5, color: item === "Dashboard" ? "#2563eb" : "#6b7280",
              fontWeight: item === "Dashboard" ? 600 : 400, cursor: "pointer",
              borderBottom: item === "Dashboard" ? "2px solid #2563eb" : "none",
              paddingBottom: 2,
            }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{
            background: "none", border: "1px solid #e5e7eb",
            borderRadius: 8, padding: "5px 14px", fontSize: 13,
            cursor: "pointer", color: "#374151",
          }}>Login</button>
          <button style={{
            background: "#2563eb", border: "none",
            borderRadius: 8, padding: "6px 16px", fontSize: 13,
            cursor: "pointer", color: "#fff", fontWeight: 600,
          }}>Register</button>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>{MOCK_USER.avatar}</div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Welcome Row ── */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: 12, marginBottom: 28,
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
              Welcome back, {MOCK_USER.name} 👋
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>
              Here's an overview of your civic reports and activity.
            </p>
          </div>
          <button style={{
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}>
            ➕ Report New Issue
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          <StatCard icon="⚠️" count={total}    label="Total Issues"  accent="#3b82f6" />
          <StatCard icon="🕐" count={pending}   label="Pending"       accent="#f59e0b" />
          <StatCard icon="🔄" count={inProg}    label="In Progress"   accent="#8b5cf6" />
          <StatCard icon="✅" count={resolved}   label="Resolved"      accent="#22c55e" />
        </div>

        {/* ── Two-column Layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* ── Complaints Section ── */}
          <div>
            {/* Filter + Search */}
            <div style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #e5e7eb",
              padding: "14px 16px", marginBottom: 16,
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 14, flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {filters.map(f => (
                  <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                    background: activeFilter === f.key ? "#2563eb" : "#f3f4f6",
                    color: activeFilter === f.key ? "#fff" : "#374151",
                    border: "none", borderRadius: 8,
                    padding: "6px 14px", fontSize: 12.5,
                    fontWeight: activeFilter === f.key ? 600 : 400,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                    transition: "all 0.15s",
                  }}>
                    {f.label}
                    <span style={{
                      background: activeFilter === f.key ? "rgba(255,255,255,0.25)" : "#e5e7eb",
                      borderRadius: 10, padding: "0px 6px", fontSize: 11,
                    }}>{f.count}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="🔍 Search complaints..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: "1px solid #e5e7eb", borderRadius: 8,
                  padding: "7px 12px", fontSize: 13, outline: "none",
                  color: "#374151", background: "#f9fafb", width: 200,
                }}
              />
            </div>

            {/* Complaint Cards */}
            {filtered.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map(c => (
                  <ComplaintCard key={c.id} complaint={c} onView={setSelectedComplaint} />
                ))}
              </div>
            ) : (
              <div style={{
                background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
                padding: "48px 24px", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 600, color: "#374151" }}>No complaints found</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                  Try changing filters or submit a new report.
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Quick Actions */}
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: "18px 16px",
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 12 }}>
                ⚡ Quick Actions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "➕ Report New Issue",    bg: "#2563eb", color: "#fff" },
                  { label: "📋 View All Complaints",  bg: "#f3f4f6", color: "#374151" },
                  { label: "🗺️ Issue Map",            bg: "#f3f4f6", color: "#374151" },
                ].map(a => (
                  <button key={a.label} style={{
                    background: a.bg, color: a.color,
                    border: "none", borderRadius: 8,
                    padding: "10px 14px", fontSize: 13,
                    fontWeight: a.bg === "#2563eb" ? 600 : 400,
                    cursor: "pointer", textAlign: "left",
                  }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: "18px 16px",
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 14 }}>
                🕐 Recent Activity
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: a.color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0,
                    }}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Snapshot */}
            <div style={{
              background: "linear-gradient(135deg, #eff6ff, #f0fdf4)",
              border: "1px solid #dbeafe",
              borderRadius: 12, padding: "18px 16px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0,
              }}>{MOCK_USER.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{MOCK_USER.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{MOCK_USER.username}</div>
                <span style={{
                  display: "inline-block", marginTop: 4,
                  background: "#dbeafe", color: "#1d4ed8",
                  borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                }}>{MOCK_USER.role}</span>
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
