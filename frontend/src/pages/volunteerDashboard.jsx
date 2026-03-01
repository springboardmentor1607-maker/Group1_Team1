import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import API from "../api";

const priorityColor = {
  High:   { bg: "#fff0f0", text: "#c0392b" },
  Medium: { bg: "#fffbf0", text: "#b7770d" },
  Low:    { bg: "#f0fff4", text: "#1a7a4a" },
};

const statusColor = {
  Assigned:      { bg: "#e8f0fe", text: "#1a56db" },
  "In Progress": { bg: "#fff3e0", text: "#e65100" },
  Resolved:      { bg: "#e8f5e9", text: "#2e7d32" },
};

const categoryIcon = {
  "Waste Management": "🗑️",
  Infrastructure:     "🏗️",
  "Road Damage":      "🚧",
  "Animal Control":   "🐕",
  Sanitation:         "🚰",
};

const POLL_INTERVAL = 15000; // auto-refresh every 15 seconds

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user, getInitials, logout } = useAuth();

  const userName   = user?.name || "Volunteer";
  const userAvatar = user?.name ? getInitials(user.name) : "V";

  const [issues, setIssues]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newBadge, setNewBadge]       = useState(0); // count of newly assigned tasks

  const [activeTab, setActiveTab]         = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [search, setSearch]               = useState("");
  const [updating, setUpdating]           = useState(false);

  const tabs = ["All", "Assigned", "In Progress", "Resolved"];

  // ── Fetch assigned issues from backend ──
  const fetchIssues = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get("/api/issues/assigned");
      const fetched = res.data || [];

      setIssues((prev) => {
        // Detect newly added tasks since last fetch
        const prevIds = new Set(prev.map((i) => String(i._id || i.id)));
        const added   = fetched.filter((i) => !prevIds.has(String(i._id || i.id)));
        if (added.length > 0) setNewBadge((n) => n + added.length);
        return fetched;
      });

      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchIssues(false);
  }, [fetchIssues]);

  // ── Auto-poll every 15s to catch admin-assigned tasks ──
  useEffect(() => {
    const timer = setInterval(() => fetchIssues(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchIssues]);

  // Clear new-task badge when user clicks the notification
  const clearBadge = () => setNewBadge(0);

  const counts = {
    total:      issues.length,
    assigned:   issues.filter((i) => i.status === "Assigned").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved:   issues.filter((i) => i.status === "Resolved").length,
  };

  const filtered = issues.filter((i) => {
    const matchTab    = activeTab === "All" || i.status === activeTab;
    const matchSearch =
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCount = (tab) =>
    tab === "All"         ? counts.total      :
    tab === "Assigned"    ? counts.assigned   :
    tab === "In Progress" ? counts.inProgress :
    counts.resolved;

  // ── Update status via API ──
  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await API.patch(`/api/issues/${id}/status`, { status: newStatus });
      setIssues((prev) =>
        prev.map((i) =>
          String(i._id || i.id) === String(id) ? { ...i, status: newStatus } : i
        )
      );
      if (selectedIssue) {
        setSelectedIssue((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const issueId   = (issue) => String(issue._id || issue.id);
  const issueDate = (issue) =>
    issue.createdAt || issue.reportedAt
      ? new Date(issue.createdAt || issue.reportedAt).toLocaleDateString()
      : "—";
  const issueRef  = (issue) =>
    issue._id
      ? "#" + String(issue._id).slice(-5).toUpperCase()
      : issue.id || "—";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Navbar ── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e5e9f2",
        padding: "0 32px", height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="40" height="40">
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#29b6f6"/><stop offset="100%" stopColor="#81d4fa"/>
              </linearGradient>
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#66bb6a"/><stop offset="100%" stopColor="#388e3c"/>
              </linearGradient>
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78909c"/><stop offset="100%" stopColor="#546e7a"/>
              </linearGradient>
              <clipPath id="circleClip"><circle cx="100" cy="100" r="86"/></clipPath>
            </defs>
            <circle cx="100" cy="100" r="98" fill="white"/>
            <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4"/>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2.5"/>
            <circle cx="100" cy="100" r="87" fill="url(#skyGrad)"/>
            <g clipPath="url(#circleClip)">
              <g fill="white" opacity="0.95">
                <rect x="25" y="78" width="16" height="32"/>
                <rect x="27" y="80" width="3" height="3" fill="#90caf9"/>
                <rect x="32" y="80" width="3" height="3" fill="#90caf9"/>
                <rect x="42" y="60" width="18" height="50"/>
                <rect x="44" y="64" width="4" height="4" fill="#90caf9"/>
                <rect x="51" y="64" width="4" height="4" fill="#90caf9"/>
                <rect x="62" y="50" width="20" height="60"/>
                <rect x="64" y="54" width="5" height="5" fill="#90caf9"/>
                <rect x="72" y="54" width="5" height="5" fill="#90caf9"/>
                <rect x="84" y="58" width="18" height="52"/>
                <rect x="86" y="62" width="4" height="4" fill="#90caf9"/>
                <rect x="104" y="65" width="16" height="45"/>
                <rect x="106" y="68" width="4" height="4" fill="#90caf9"/>
                <rect x="121" y="74" width="16" height="36"/>
                <rect x="123" y="78" width="3" height="3" fill="#90caf9"/>
              </g>
              <ellipse cx="100" cy="130" rx="95" ry="45" fill="#81c784"/>
              <path d="M13,145 Q50,108 100,118 Q150,108 187,145 L187,187 L13,187 Z" fill="url(#grassGrad)"/>
              <path d="M85,187 Q90,148 100,118 Q110,148 115,187 Z" fill="url(#roadGrad)"/>
              <circle cx="48" cy="128" r="10" fill="#388e3c"/>
              <circle cx="152" cy="128" r="10" fill="#388e3c"/>
            </g>
            <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3"/>
            <path id="textArc2" d="M 28,100 A 72,72 0 0,1 172,100" fill="none"/>
            <text fontFamily="'Arial Rounded MT Bold','Arial',sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2">
              <textPath href="#textArc2" startOffset="8%">CLEAN STREETS</textPath>
            </text>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1a1a2e" }}>CleanStreet</span>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {["Dashboard", "My Tasks", "Notifications"].map((item) => (
            <span key={item} style={{
              fontSize: 14, fontWeight: 500,
              color: item === "Dashboard" ? "#1a56db" : "#64748b",
              cursor: "pointer",
              borderBottom: item === "Dashboard" ? "2px solid #1a56db" : "none",
              paddingBottom: 4, position: "relative"
            }}>
              {item}
              {/* New-task badge on Notifications */}
              {item === "Notifications" && newBadge > 0 && (
                <span onClick={clearBadge} style={{
                  position: "absolute", top: -6, right: -10,
                  background: "#e74c3c", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer"
                }}>{newBadge}</span>
              )}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Live refresh indicator */}
          {lastUpdated && (
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              🟢 Live · {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button onClick={handleLogout} style={{
            background: "#1a56db", border: "none", borderRadius: 8,
            padding: "6px 14px", fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer"
          }}>Logout</button>
          <div onClick={() => navigate("/profile")} title={userName} style={{
            width: 36, height: 36, borderRadius: "50%", background: "#1a56db",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
          }}>{userAvatar}</div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Welcome Banner ── */}
        <div style={{
          background: "linear-gradient(120deg, #1a56db 0%, #2563eb 60%, #3b82f6 100%)",
          borderRadius: 16, padding: "28px 32px", marginBottom: 28, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, opacity: 0.8, marginBottom: 6, textTransform: "uppercase" }}>
              🙋 VOLUNTEER DASHBOARD
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>
              Welcome back, {userName} 👋
            </h2>
            <p style={{ opacity: 0.85, fontSize: 14, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
              You have <strong>{counts.assigned + counts.inProgress}</strong> active tasks assigned to you. Keep up the great civic work!
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, position: "relative" }}>
            {[
              { label: "Assigned",    value: counts.assigned    },
              { label: "In Progress", value: counts.inProgress  },
              { label: "Resolved",    value: counts.resolved    },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 22px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Assigned", value: counts.total,      icon: "📋", color: "#1a56db" },
            { label: "Pending",        value: counts.assigned,   icon: "⏳", color: "#e65100" },
            { label: "In Progress",    value: counts.inProgress, icon: "🔄", color: "#7c3aed" },
            { label: "Resolved",       value: counts.resolved,   icon: "✅", color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 14, padding: "20px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Issues Panel ── */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Assigned Issues</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 4, background: "#f4f6fb", borderRadius: 10, padding: 4 }}>
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: activeTab === tab ? "#1a56db" : "transparent",
                    color: activeTab === tab ? "#fff" : "#64748b",
                    fontSize: 13, fontWeight: 500, transition: "all 0.15s"
                  }}>
                    {tab} ({tabCount(tab)})
                  </button>
                ))}
              </div>
              <input
                placeholder="🔍  Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "1px solid #e5e9f2", borderRadius: 10, padding: "7px 14px",
                  fontSize: 13, outline: "none", color: "#1a1a2e", width: 200, background: "#f9fafb"
                }}
              />
              {/* Manual refresh button */}
              <button
                onClick={() => fetchIssues(false)}
                title="Refresh tasks"
                style={{
                  background: "#f4f6fb", border: "1px solid #e5e9f2", borderRadius: 8,
                  padding: "7px 10px", cursor: "pointer", fontSize: 14, color: "#64748b"
                }}
              >🔄</button>
            </div>
          </div>

          {/* Loading / Error / Empty / List */}
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
              <div style={{ fontSize: 15 }}>Loading your tasks…</div>
            </div>
          ) : error ? (
            <div style={{ padding: 48, textAlign: "center", color: "#e74c3c" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
              <div style={{ fontSize: 15 }}>{error}</div>
              <button onClick={() => fetchIssues(false)} style={{ marginTop: 12, background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600 }}>
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <div style={{ fontSize: 15 }}>
                {issues.length === 0 ? "No tasks assigned yet. Check back soon!" : "No issues match your search."}
              </div>
            </div>
          ) : (
            filtered.map((issue, idx) => {
              const id  = issueId(issue);
              const sc  = statusColor[issue.status]   || statusColor["Assigned"];
              const pc  = priorityColor[issue.priority];
              const isSelected = issueId(selectedIssue || {}) === id;
              return (
                <div key={id}
                  onClick={() => setSelectedIssue(issue)}
                  style={{
                    padding: "18px 24px",
                    borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                    transition: "background 0.15s",
                    background: isSelected ? "#f0f5ff" : "#fff"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8faff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? "#f0f5ff" : "#fff"}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {categoryIcon[issue.category] || "📌"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{issue.title}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{issueRef(issue)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      📍 {issue.location} &nbsp;·&nbsp; Reported by {issue.reportedBy?.name || issue.reportedBy} &nbsp;·&nbsp; {issueDate(issue)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {pc && (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: pc.bg, color: pc.text }}>
                        ● {issue.priority}
                      </span>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.text }}>
                      {issue.status}
                    </span>
                    <span style={{ fontSize: 18, color: "#cbd5e1", marginLeft: 4 }}>›</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Issue Detail Modal ── */}
      {selectedIssue && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24
        }} onClick={() => setSelectedIssue(null)}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden"
          }} onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ background: "linear-gradient(120deg, #1a56db, #3b82f6)", padding: "22px 26px", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.8, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>
                    {issueRef(selectedIssue)} · {selectedIssue.category}
                  </p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{selectedIssue.title}</h3>
                </div>
                <button onClick={() => setSelectedIssue(null)} style={{
                  background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
                  width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>✕</button>
              </div>
            </div>

            <div style={{ padding: "22px 26px" }}>
              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                {[
                  { label: "Location",      value: selectedIssue.location,                                     icon: "📍" },
                  { label: "Reported By",   value: selectedIssue.reportedBy?.name || selectedIssue.reportedBy, icon: "👤" },
                  { label: "Date Reported", value: issueDate(selectedIssue),                                   icon: "📅" },
                  { label: "Priority",      value: selectedIssue.priority || "—",                              icon: "🚨" },
                ].map((f) => (
                  <div key={f.label} style={{ background: "#f8faff", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{f.icon} {f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ background: "#f8faff", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>📝 Description</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>
                  {selectedIssue.description || "No description provided."}
                </p>
              </div>

              {/* Status Selector */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Current Status</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Assigned", "In Progress", "Resolved"].map((s) => {
                    const active = selectedIssue.status === s;
                    return (
                      <button key={s}
                        onClick={() => updateStatus(issueId(selectedIssue), s)}
                        disabled={updating}
                        style={{
                          flex: 1, padding: "9px 0", borderRadius: 10,
                          border: active ? "2px solid #1a56db" : "2px solid #e5e9f2",
                          background: active ? "#1a56db" : "#fff",
                          color: active ? "#fff" : "#64748b",
                          fontWeight: 600, fontSize: 12, cursor: updating ? "not-allowed" : "pointer",
                          opacity: updating ? 0.7 : 1, transition: "all 0.15s"
                        }}
                      >{s}</button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  disabled={updating}
                  style={{
                    flex: 1, padding: "11px 0", background: "#1a56db", color: "#fff",
                    border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14,
                    cursor: updating ? "not-allowed" : "pointer", opacity: updating ? 0.7 : 1
                  }}
                >📤 Submit Update</button>
                <button style={{
                  padding: "11px 18px", background: "#fff", color: "#64748b",
                  border: "1px solid #e5e9f2", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer"
                }}>💬 Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}