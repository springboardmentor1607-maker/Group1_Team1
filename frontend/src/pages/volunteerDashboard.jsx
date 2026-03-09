import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import API from "../api";
import Navbar from "./Navbar";

const priorityColor = {
  High:   { bg: "#fff0f0", text: "#c0392b" },
  Medium: { bg: "#fffbf0", text: "#b7770d" },
  Low:    { bg: "#f0fff4", text: "#1a7a4a" },
};

const statusColor = {
  received:    { bg: "#dbeafe",  text: "#1e40af" },
  in_review:   { bg: "#e8f0fe",  text: "#1a56db" },
  assigned:    { bg: "#e8f0fe",  text: "#1a56db" },
  accepted:    { bg: "#f0fdf4",  text: "#15803d" },
  denied:      { bg: "#fef2f2",  text: "#dc2626" },
  in_progress: { bg: "#fff3e0",  text: "#e65100" },
  resolved:    { bg: "#ede9fe",  text: "#7c3aed" },
  completed:   { bg: "#e8f5e9",  text: "#2e7d32" },
};

const categoryIcon = {
  "Waste Management": "🗑️",
  Infrastructure:     "🏗️",
  "Road Damage":      "🚧",
  "Animal Control":   "🐕",
  Sanitation:         "🚰",
};

const POLL_INTERVAL = 15000;

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const userName = user?.name || "Volunteer";

  const [issues, setIssues]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [lastUpdated, setLastUpdated]     = useState(null);
  const [activeTab, setActiveTab]         = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [search, setSearch]               = useState("");
  const [updating, setUpdating]           = useState(false);

  const tabs = ["All", "Assigned", "Accepted", "In Progress", "Resolved"];

  const fetchIssues = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get("/api/complaints/assigned-to-me");
      setIssues(res.data || []);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIssues(false); }, [fetchIssues]);

  useEffect(() => {
    const timer = setInterval(() => fetchIssues(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchIssues]);

  const counts = {
    total:      issues.length,
    assigned:   issues.filter(i => i.status === 'assigned' || i.status === 'in_review').length,
    accepted:   issues.filter(i => i.status === 'accepted').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved:   issues.filter(i => i.status === 'resolved' || i.status === 'completed').length,
  };

  const filtered = issues.filter(i => {
  const matchTab =
    activeTab === 'All'         ? true :
    activeTab === 'Assigned'    ? (i.status === 'assigned' || i.status === 'in_review') :
    activeTab === 'Accepted'    ? i.status === 'accepted' :
    activeTab === 'In Progress' ? i.status === 'in_progress' :
    activeTab === 'Resolved'    ? (i.status === 'resolved' || i.status === 'completed') : true;
  const matchSearch =
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.address?.toLowerCase().includes(search.toLowerCase());
  return matchTab && matchSearch;
});

  const tabCount = (tab) =>
    tab === "All"         ? counts.total      :
    tab === "Assigned"    ? counts.assigned   :
    tab === "Accepted"    ? counts.accepted   :
    tab === "In Progress" ? counts.inProgress :
    counts.resolved;

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      // Use accept/deny dedicated endpoints, status endpoint for others
      let endpoint;
      if (newStatus === "accepted") endpoint = `/api/complaints/${id}/accept`;
      else if (newStatus === "denied") endpoint = `/api/complaints/${id}/deny`;
      else endpoint = `/api/complaints/status/${id}`;

      await API.put(endpoint, { status: newStatus });
      setIssues((prev) =>
        prev.map((i) => String(i._id || i.id) === String(id) ? { ...i, status: newStatus } : i)
      );
      if (selectedIssue) {
        setSelectedIssue((prev) => ({ ...prev, status: newStatus }));
      }
      if (newStatus === "denied") setSelectedIssue(null); // close modal on deny
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const issueId   = (issue) => String(issue._id || issue.id);
  const issueDate = (issue) =>
    issue.createdAt || issue.created_at || issue.reportedAt
      ? new Date(issue.createdAt || issue.created_at || issue.reportedAt).toLocaleDateString()
      : "—";
  const issueRef  = (issue) =>
    issue._id ? "#" + String(issue._id).slice(-5).toUpperCase() : issue.id || "—";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Shared Navbar ── */}
      <Navbar />

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
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Assigned Issues</h3>
              {lastUpdated && (
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  🟢 Last updated · {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
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
              <button onClick={() => fetchIssues(false)} title="Refresh tasks" style={{
                background: "#f4f6fb", border: "1px solid #e5e9f2", borderRadius: 8,
                padding: "7px 10px", cursor: "pointer", fontSize: 14, color: "#64748b"
              }}>🔄</button>
            </div>
          </div>

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
              const id         = issueId(issue);
              const sc         = statusColor[issue.status] || statusColor["assigned"];
              const priorityKey = issue.priority ? issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1).toLowerCase() : "";
              const pc         = priorityColor[priorityKey] || null;
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
                      📍 {issue.address || issue.location || 'No location'} &nbsp;·&nbsp; Reported by {issue.reportedBy?.name || issue.reportedBy} &nbsp;·&nbsp; {issueDate(issue)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {pc && pc.bg && (
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                {[
                  { label: "Location",      value: selectedIssue.address || selectedIssue.location || "Not provided",   icon: "📍" },
                  { label: "Reported By",   value: selectedIssue.user_id?.name || selectedIssue.reportedBy?.name || selectedIssue.reportedBy || "—", icon: "👤" },
                  { label: "Date Reported", value: issueDate(selectedIssue),                                                  icon: "📅" },
                  { label: "Priority",      value: selectedIssue.priority || "—",                                             icon: "🚨" },
                ].map((f) => (
                  <div key={f.label} style={{ background: "#f8faff", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{f.icon} {f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#f8faff", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>📝 Description</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>
                  {selectedIssue.description || "No description provided."}
                </p>
              </div>

              {/* Action buttons based on current status */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>
                  Current Status: <span style={{ color: "#1a56db", textTransform: "capitalize" }}>{selectedIssue.status?.replace("_", " ")}</span>
                </div>

                {/* ASSIGNED → Accept or Deny */}
                {(selectedIssue.status === "assigned" || selectedIssue.status === "in_review") && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => updateStatus(issueId(selectedIssue), "accepted")} disabled={updating}
                      style={{ flex: 1, padding: "11px 0", background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      ✅ Accept Issue
                    </button>
                    <button onClick={() => updateStatus(issueId(selectedIssue), "denied")} disabled={updating}
                      style={{ flex: 1, padding: "11px 0", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      ❌ Deny Issue
                    </button>
                  </div>
                )}

                {/* ACCEPTED → Start Work */}
                {selectedIssue.status === "accepted" && (
                  <button onClick={() => updateStatus(issueId(selectedIssue), "in_progress")} disabled={updating}
                    style={{ width: "100%", padding: "11px 0", background: "#e65100", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    🚀 Start Working
                  </button>
                )}

                {/* IN_PROGRESS → Mark Resolved */}
                {selectedIssue.status === "in_progress" && (
                  <button onClick={() => updateStatus(issueId(selectedIssue), "resolved")} disabled={updating}
                    style={{ width: "100%", padding: "11px 0", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    🏁 Mark as Resolved
                  </button>
                )}

                {/* RESOLVED → waiting for admin approval */}
                {selectedIssue.status === "resolved" && (
                  <div style={{ background: "#ede9fe", borderRadius: 10, padding: "12px 16px", textAlign: "center", color: "#7c3aed", fontWeight: 600 }}>
                    ⏳ Awaiting admin approval to mark as completed
                  </div>
                )}

                {/* COMPLETED → done */}
                {selectedIssue.status === "completed" && (
                  <div style={{ background: "#e8f5e9", borderRadius: 10, padding: "12px 16px", textAlign: "center", color: "#2e7d32", fontWeight: 600 }}>
                    ✅ Issue completed and verified by admin
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}