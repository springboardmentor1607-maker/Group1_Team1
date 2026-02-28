import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";

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
    Resolved:  { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    Assigned:  { bg: "#fef9c3", color: "#92400e", dot: "#f59e0b" },
    Pending:   { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  };
  const s = map[status] || map["Pending"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 9999,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
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

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, getInitials } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [assignSelections, setAssignSelections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Demo volunteers — TODO (Backend): fetch from GET /api/volunteers
  const volunteers = [
    { id: 1, name: "Nithya" },
    { id: 2, name: "Anusha" },
    { id: 3, name: "Anshu" },
    { id: 4, name: "Dheeraj" },
    { id: 5, name: "Abishek" },
    { id: 6, name: "Rashmi" },
    { id: 7, name: "Shraddha" }
  ];

  useEffect(() => {
    /*
      TODO (Backend): Replace localStorage with real API call.
      Suggested endpoint: GET /api/complaints (admin view — all complaints)
      Expected response: array of complaint objects
    */
    const stored = JSON.parse(localStorage.getItem("complaints")) || [];
    setComplaints(stored);
  }, []);

  const assignVolunteer = (id) => {
    const volunteerName = assignSelections[id];
    if (!volunteerName) return;
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, assignedTo: volunteerName, status: "Assigned" } : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
    // TODO (Backend): PATCH /api/complaints/:id { assignedTo, status: "Assigned" }
  };

  const markResolved = (id) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: "Resolved" } : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
    // TODO (Backend): PATCH /api/complaints/:id { status: "Resolved" }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const total    = complaints.length;
  const assigned = complaints.filter(c => c.status === "Assigned").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending  = total - assigned - resolved;

  const avatar = user?.name ? getInitials(user.name) : "AD";

  const filteredComplaints = complaints.filter(c => {
    const matchStatus = statusFilter === "all" || c.status?.toLowerCase() === statusFilter;
    const matchSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const sidebarItems = [
    { key: "overview",    icon: "📊", label: "Overview"          },
    { key: "complaints",  icon: "📋", label: "Manage Complaints" },
    { key: "volunteers",  icon: "🤝", label: "Volunteers"        },
  ];

  return (
    <div className="cs-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav className="cs-navbar">
        <div className="cs-navbar__brand">
          <CleanStreetLogo size={42} />
          <span className="cs-navbar__name">CleanStreet</span>
          <span style={{
            background: "#1e3a8a", color: "#93c5fd",
            fontSize: 11, fontWeight: 700, padding: "2px 8px",
            borderRadius: 9999, letterSpacing: 0.5, marginLeft: 4,
          }}>ADMIN</span>
        </div>
        <div className="cs-navbar__links">
          <span className="cs-navbar__link cs-navbar__link--active">Admin Panel</span>
          <span className="cs-navbar__link" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            User Dashboard
          </span>
        </div>
        <div className="cs-navbar__actions">
          <button
            className="cs-btn cs-btn--outline cs-btn--sm"
            onClick={handleLogout}
            style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}
          >
            Logout
          </button>
          <div className="cs-avatar" title={user?.name || "Admin"}>
            {avatar}
          </div>
        </div>
      </nav>

      {/* ── Body: Sidebar + Content ── */}
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
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 12px",
                  borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 14, fontWeight: activeTab === item.key ? 600 : 400,
                  background: activeTab === item.key ? "#eff6ff" : "transparent",
                  color: activeTab === item.key ? "#2563eb" : "#374151",
                  marginBottom: 4,
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {item.key === "complaints" && total > 0 && (
                  <span style={{
                    marginLeft: "auto", background: activeTab === item.key ? "#2563eb" : "#e5e7eb",
                    color: activeTab === item.key ? "#fff" : "#6b7280",
                    fontSize: 11, fontWeight: 700,
                    padding: "1px 7px", borderRadius: 9999,
                  }}>{total}</span>
                )}
              </button>
            ))}
          </div>

          {/* Admin info at bottom */}
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

          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>System Overview</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Monitor all civic complaints across the platform.</p>
              </div>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                <StatCard icon="⚠️" count={total}    label="Total Complaints" accent="#3b82f6" />
                <StatCard icon="⏳" count={pending}   label="Pending"          accent="#f59e0b" />
                <StatCard icon="🔄" count={assigned}  label="Assigned"         accent="#8b5cf6" />
                <StatCard icon="✅" count={resolved}  label="Resolved"         accent="#22c55e" />
              </div>

              {/* Recent complaints preview */}
              <div className="cs-card">
                <div className="cs-section-header" style={{ marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Recent Complaints</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Latest submissions from citizens</div>
                  </div>
                  <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => setActiveTab("complaints")}>
                    View All →
                  </button>
                </div>

                {complaints.length === 0 ? (
                  <div className="cs-empty">
                    <div className="cs-empty__icon">📭</div>
                    <div className="cs-empty__title">No complaints yet</div>
                    <div className="cs-empty__desc">Complaints submitted by citizens will appear here.</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {complaints.slice(0, 5).map(c => (
                      <div key={c.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", background: "#f9fafb",
                        borderRadius: 10, border: "1px solid #f3f4f6",
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{c.title}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                            Assigned to: {c.assignedTo || "—"}
                          </div>
                        </div>
                        <StatusBadge status={c.status || "Pending"} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Manage Complaints Tab ── */}
          {activeTab === "complaints" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Manage Complaints</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Assign volunteers and resolve civic issues.</p>
              </div>

              {/* Filter bar */}
              <div className="cs-filter-bar" style={{ marginBottom: 20 }}>
                <div className="cs-filter-tabs">
                  {[
                    { key: "all",      label: "All",      count: total    },
                    { key: "pending",  label: "Pending",  count: pending  },
                    { key: "assigned", label: "Assigned", count: assigned },
                    { key: "resolved", label: "Resolved", count: resolved },
                  ].map(f => (
                    <button
                      key={f.key}
                      className={`cs-filter-tab${statusFilter === f.key ? " cs-filter-tab--active" : ""}`}
                      onClick={() => setStatusFilter(f.key)}
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

              {filteredComplaints.length === 0 ? (
                <div className="cs-empty">
                  <div className="cs-empty__icon">📭</div>
                  <div className="cs-empty__title">No complaints found</div>
                  <div className="cs-empty__desc">Try adjusting your search or filter.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {filteredComplaints.map(c => (
                    <div key={c.id} className="cs-card" style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{c.title}</div>
                          <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{c.description}</div>
                        </div>
                        <StatusBadge status={c.status || "Pending"} />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                        <span style={{ fontSize: 12, color: "#6b7280", marginRight: 4 }}>
                          Assigned to: <strong>{c.assignedTo || "Not assigned"}</strong>
                        </span>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                          {/* Volunteer select */}
                          <select
                            className="cs-input"
                            style={{ padding: "6px 12px", fontSize: 13, width: "auto", minWidth: 160 }}
                            value={assignSelections[c.id] || ""}
                            onChange={e => setAssignSelections(prev => ({ ...prev, [c.id]: e.target.value }))}
                          >
                            <option value="" disabled>Select volunteer</option>
                            {volunteers.map(v => (
                              <option key={v.id} value={v.name}>{v.name}</option>
                            ))}
                          </select>

                          <button
                            className="cs-btn cs-btn--outline cs-btn--sm"
                            onClick={() => assignVolunteer(c.id)}
                            disabled={!assignSelections[c.id]}
                          >
                            Assign
                          </button>

                          {c.status !== "Resolved" && (
                            <button
                              className="cs-btn cs-btn--primary cs-btn--sm"
                              onClick={() => markResolved(c.id)}
                            >
                              ✓ Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Volunteers Tab ── */}
          {activeTab === "volunteers" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Volunteers</h1>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Manage your volunteer team.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {volunteers.map(v => {
                  const assignedCount = complaints.filter(c => c.assignedTo === v.name).length;
                  const resolvedCount = complaints.filter(c => c.assignedTo === v.name && c.status === "Resolved").length;
                  return (
                    <div key={v.id} className="cs-card" style={{ padding: "20px", textAlign: "center" }}>
                      <div className="cs-avatar cs-avatar--lg" style={{ margin: "0 auto 12px" }}>
                        {v.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Volunteer</div>
                      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontWeight: 700, fontSize: 18, color: "#2563eb" }}>{assignedCount}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>Assigned</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontWeight: 700, fontSize: 18, color: "#22c55e" }}>{resolvedCount}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>Resolved</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cs-empty" style={{ marginTop: 16 }}>
                <div className="cs-empty__icon">🤝</div>
                <div className="cs-empty__title">More volunteers coming soon</div>
                <div className="cs-empty__desc">
                  {/* TODO (Backend): Fetch real volunteers from GET /api/volunteers */}
                  Volunteer management will be fully dynamic once the backend is connected.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;