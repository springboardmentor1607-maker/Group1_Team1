import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import Navbar from "./Navbar";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGradAD" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassGradAD" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadGradAD" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="circleClipAD"><circle cx="100" cy="100" r="86" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyGradAD)" />
      <g clipPath="url(#circleClipAD)">
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
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGradAD)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGradAD)" />
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="csArcAD" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csArcAD" startOffset="7%">CLEAN STREETS</textPath>
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

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    resolved:   { bg: "#dcfce7", color: "#166534", dot: "#22c55e", label: "Resolved"   },
    assigned:   { bg: "#fef9c3", color: "#92400e", dot: "#f59e0b", label: "Assigned"   },
    pending:    { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", label: "Pending"    },
    in_review:  { bg: "#ede9fe", color: "#5b21b6", dot: "#8b5cf6", label: "In Review"  },
    received:   { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", label: "Received"   },
  };
  const key = status?.toLowerCase().replace(" ", "_") || "pending";
  const s = map[key] || map["pending"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 9999,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const map = {
    critical: { bg: "#fee2e2", color: "#991b1b" },
    high:     { bg: "#ffedd5", color: "#9a3412" },
    medium:   { bg: "#fef9c3", color: "#92400e" },
    low:      { bg: "#dcfce7", color: "#166534" },
  };
  const s = map[priority?.toLowerCase()] || map["low"];
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 8px", borderRadius: 9999,
      fontSize: 11, fontWeight: 700, textTransform: "capitalize",
    }}>
      {priority || "—"}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, count, label, accent }) {
  return (
    <div className="cs-stat-card" style={{ borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────
const TH = ({ children, style }) => (
  <th style={{
    padding: "10px 14px", textAlign: "left", fontSize: 12,
    fontWeight: 700, color: "#6b7280", textTransform: "uppercase",
    letterSpacing: 0.5, borderBottom: "2px solid #f3f4f6",
    background: "#f9fafb", ...style,
  }}>{children}</th>
);

const TD = ({ children, style }) => (
  <td style={{
    padding: "12px 14px", fontSize: 13, color: "#374151",
    borderBottom: "1px solid #f3f4f6", verticalAlign: "middle", ...style,
  }}>{children}</td>
);

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints]   = useState([]);
  const [users, setUsers]             = useState([]);
  const [volunteers, setVolunteers]   = useState([]);
  const [assignSelections, setAssignSelections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const avatar = user?.name ? getInitials(user.name) : "AD";

  // ── Fetch all data ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, []);

  const fetchComplaints = async () => {
    try {
      // TODO (Backend): GET /api/complaints — admin sees all complaints
      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setComplaints(Array.isArray(data) ? data : data.complaints || []);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  const fetchUsers = async () => {
    try {
      // TODO (Backend): GET /api/users — admin sees all users
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const allUsers = Array.isArray(data) ? data : data.users || [];
        setUsers(allUsers);
        setVolunteers(allUsers.filter(u => u.role === "volunteer"));
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const assignVolunteer = async (complaintId) => {
    const volunteerId = assignSelections[complaintId];
    if (!volunteerId) return;
    try {
      // TODO (Backend): PATCH /api/complaints/:id/assign { volunteerId }
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ volunteerId }),
      });
      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error("Assign failed", err);
    }
  };

  const markResolved = async (complaintId) => {
    try {
      // TODO (Backend): PATCH /api/complaints/:id { status: "resolved" }
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error("Resolve failed", err);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      // TODO (Backend): PATCH /api/users/:id/role { role }
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Role change failed", err);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === "pending" || c.status === "received").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const inProg   = complaints.filter(c => c.status === "in_review" || c.status === "assigned").length;

  const filteredComplaints = complaints.filter(c => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const sidebarItems = [
    { key: "overview",   icon: "📊", label: "Overview"          },
    { key: "complaints", icon: "📋", label: "Complaints"        },
    { key: "users",      icon: "👥", label: "User Management"   },
    { key: "volunteers", icon: "🤝", label: "Volunteers"        },
  ];

  return (
    <div className="cs-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 220, background: "#fff",
          borderRight: "1px solid #e5e7eb",
          padding: "24px 0", flexShrink: 0,
          position: "sticky", top: 64,
          height: "calc(100vh - 64px)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "0 16px 16px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              Navigation
            </div>
            {sidebarItems.map(item => (
              <button key={item.key} onClick={() => setActiveTab(item.key)} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 12px",
                borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 14,
                fontWeight: activeTab === item.key ? 600 : 400,
                background: activeTab === item.key ? "#eff6ff" : "transparent",
                color: activeTab === item.key ? "#2563eb" : "#374151",
                marginBottom: 4, transition: "all 0.15s ease",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {item.key === "complaints" && total > 0 && (
                  <span style={{
                    marginLeft: "auto",
                    background: activeTab === item.key ? "#2563eb" : "#e5e7eb",
                    color: activeTab === item.key ? "#fff" : "#6b7280",
                    fontSize: 11, fontWeight: 700,
                    padding: "1px 7px", borderRadius: 9999,
                  }}>{total}</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="cs-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{avatar}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user?.name || "Admin"}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Administrator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>System Overview</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Monitor all civic complaints across the platform.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                <StatCard icon="⚠️" count={total}     label="Total Complaints" accent="#3b82f6" />
                <StatCard icon="⏳" count={pending}    label="Pending"          accent="#f59e0b" />
                <StatCard icon="🔄" count={inProg}     label="In Progress"      accent="#8b5cf6" />
                <StatCard icon="✅" count={resolved}   label="Resolved"         accent="#22c55e" />
              </div>

              <div className="cs-card">
                <div className="cs-section-header" style={{ marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Recent Complaints</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Latest submissions from citizens</div>
                  </div>
                  <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => setActiveTab("complaints")}>View All →</button>
                </div>
                {complaints.length === 0 ? (
                  <div className="cs-empty">
                    <div className="cs-empty__icon">📭</div>
                    <div className="cs-empty__title">No complaints yet</div>
                    <div className="cs-empty__desc">Complaints submitted by citizens will appear here.</div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <TH>Title</TH>
                        <TH>Type</TH>
                        <TH>Priority</TH>
                        <TH>Status</TH>
                        <TH>Date</TH>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map(c => (
                        <tr key={c._id || c.id} style={{ transition: "background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <TD style={{ fontWeight: 600 }}>{c.title}</TD>
                          <TD style={{ color: "#6b7280" }}>{c.type || c.issueType || "—"}</TD>
                          <TD><PriorityBadge priority={c.priority} /></TD>
                          <TD><StatusBadge status={c.status} /></TD>
                          <TD style={{ color: "#9ca3af" }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ COMPLAINTS TAB ══ */}
          {activeTab === "complaints" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Manage Complaints</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Assign volunteers and update complaint status.</p>
              </div>

              {/* Filter bar */}
              <div className="cs-filter-bar" style={{ marginBottom: 20 }}>
                <div className="cs-filter-tabs">
                  {[
                    { key: "all",       label: "All",        count: total    },
                    { key: "received",  label: "Pending",    count: pending  },
                    { key: "in_review", label: "In Progress",count: inProg   },
                    { key: "resolved",  label: "Resolved",   count: resolved },
                  ].map(f => (
                    <button key={f.key}
                      className={`cs-filter-tab${statusFilter === f.key ? " cs-filter-tab--active" : ""}`}
                      onClick={() => setStatusFilter(f.key)}>
                      {f.label}<span className="cs-filter-tab__count">{f.count}</span>
                    </button>
                  ))}
                </div>
                <input className="cs-input cs-search-input"
                  placeholder="🔍 Search complaints..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} />
              </div>

              {filteredComplaints.length === 0 ? (
                <div className="cs-empty">
                  <div className="cs-empty__icon">📭</div>
                  <div className="cs-empty__title">No complaints found</div>
                  <div className="cs-empty__desc">Try adjusting your search or filter.</div>
                </div>
              ) : (
                <div className="cs-card" style={{ padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <TH>Title</TH>
                        <TH>Type</TH>
                        <TH>Priority</TH>
                        <TH>Reporter</TH>
                        <TH>Status</TH>
                        <TH>Assign Volunteer</TH>
                        <TH>Actions</TH>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map(c => (
                        <tr key={c._id || c.id}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <TD>
                            <div style={{ fontWeight: 600, color: "#111827" }}>{c.title}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{c.address || "No address"}</div>
                          </TD>
                          <TD style={{ color: "#6b7280", textTransform: "capitalize" }}>{c.type || c.issueType || "—"}</TD>
                          <TD><PriorityBadge priority={c.priority} /></TD>
                          <TD style={{ color: "#374151" }}>{c.reportedBy?.name || c.user?.name || "—"}</TD>
                          <TD><StatusBadge status={c.status} /></TD>
                          <TD>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <select
                                className="cs-input"
                                style={{ padding: "5px 8px", fontSize: 12, minWidth: 140 }}
                                value={assignSelections[c._id || c.id] || ""}
                                onChange={e => setAssignSelections(prev => ({ ...prev, [c._id || c.id]: e.target.value }))}
                              >
                                <option value="">— Select Volunteer —</option>
                                {volunteers.map(v => (
                                  <option key={v._id} value={v._id}>{v.name}</option>
                                ))}
                              </select>
                              {c.assignedTo && (
                                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                                  Current: {c.assignedTo?.name || c.assignedTo}
                                </div>
                              )}
                            </div>
                          </TD>
                          <TD>
                            <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                              <button
                                className="cs-btn cs-btn--outline cs-btn--sm"
                                style={{ fontSize: 11 }}
                                onClick={() => assignVolunteer(c._id || c.id)}
                                disabled={!assignSelections[c._id || c.id]}
                              >Assign</button>
                              {c.status !== "resolved" && (
                                <button
                                  className="cs-btn cs-btn--primary cs-btn--sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => markResolved(c._id || c.id)}
                                >✓ Resolve</button>
                              )}
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══ USER MANAGEMENT TAB ══ */}
          {activeTab === "users" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>User Management</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                  {users.length} registered users · Manage roles and access.
                </p>
              </div>

              {users.length === 0 ? (
                <div className="cs-empty">
                  <div className="cs-empty__icon">👥</div>
                  <div className="cs-empty__title">No users found</div>
                  <div className="cs-empty__desc">
                    {/* TODO (Backend): GET /api/users must return all users for admin */}
                    Users will appear here once the backend endpoint is connected.
                  </div>
                </div>
              ) : (
                <div className="cs-card" style={{ padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <TH>Name</TH>
                        <TH>Email</TH>
                        <TH>Current Role</TH>
                        <TH>Location</TH>
                        <TH>Joined</TH>
                        <TH>Actions</TH>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <TD>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div className="cs-avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>
                                {u.name?.substring(0, 2).toUpperCase() || "??"}
                              </div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                          </TD>
                          <TD style={{ color: "#6b7280" }}>{u.email}</TD>
                          <TD>
                            <span style={{
                              background: u.role === "admin" ? "#fef2f2" : u.role === "volunteer" ? "#eff6ff" : "#f0fdf4",
                              color: u.role === "admin" ? "#dc2626" : u.role === "volunteer" ? "#2563eb" : "#16a34a",
                              padding: "2px 10px", borderRadius: 9999,
                              fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                            }}>{u.role || "citizen"}</span>
                          </TD>
                          <TD style={{ color: "#6b7280" }}>{u.location || "Not specified"}</TD>
                          <TD style={{ color: "#9ca3af" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</TD>
                          <TD>
                            <div style={{ display: "flex", gap: 6 }}>
                              {u.role !== "volunteer" && (
                                <button
                                  className="cs-btn cs-btn--outline cs-btn--sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => changeUserRole(u._id, "volunteer")}
                                >Make Volunteer</button>
                              )}
                              {u.role !== "citizen" && u.role !== "admin" && (
                                <button
                                  className="cs-btn cs-btn--outline cs-btn--sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => changeUserRole(u._id, "citizen")}
                                >Make Citizen</button>
                              )}
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══ VOLUNTEERS TAB ══ */}
          {activeTab === "volunteers" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Volunteer Management</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                  {volunteers.length} active volunteers.
                </p>
              </div>

              {volunteers.length === 0 ? (
                <div className="cs-empty">
                  <div className="cs-empty__icon">🤝</div>
                  <div className="cs-empty__title">No volunteers yet</div>
                  <div className="cs-empty__desc">Promote citizens to volunteer from the User Management tab.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                  {volunteers.map(v => {
                    const assigned = complaints.filter(c => c.assignedTo?._id === v._id || c.assignedTo === v._id).length;
                    const resolved = complaints.filter(c => (c.assignedTo?._id === v._id || c.assignedTo === v._id) && c.status === "resolved").length;
                    return (
                      <div key={v._id} className="cs-card" style={{ padding: "20px", textAlign: "center" }}>
                        <div className="cs-avatar cs-avatar--lg" style={{ margin: "0 auto 12px" }}>
                          {v.name?.substring(0, 2).toUpperCase() || "V"}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{v.name}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>{v.email}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{v.location || "Location not set"}</div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 700, fontSize: 20, color: "#2563eb" }}>{assigned}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>Assigned</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 700, fontSize: 20, color: "#22c55e" }}>{resolved}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>Resolved</div>
                          </div>
                        </div>
                        <button
                          className="cs-btn cs-btn--outline cs-btn--sm"
                          style={{ marginTop: 12, width: "100%", fontSize: 12 }}
                          onClick={() => changeUserRole(v._id, "citizen")}
                        >Remove Volunteer</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;