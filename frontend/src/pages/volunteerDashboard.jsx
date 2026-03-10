import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import API from "../api";
import Navbar from "./Navbar";

const priorityColor = {
  high:   { bg: "#fff0f0", text: "#c0392b" },
  medium: { bg: "#fffbf0", text: "#b7770d" },
  low:    { bg: "#f0fff4", text: "#1a7a4a" },
};

// Backend schema enum: "received" | "in_review" | "resolved"
const statusColor = {
  received:  { bg: "#f0f4ff", text: "#3b82f6" },
  in_review: { bg: "#fff3e0", text: "#e65100" },
  resolved:  { bg: "#e8f5e9", text: "#2e7d32" },
};

const statusLabel = {
  received:  "Received",
  in_review: "In Review",
  resolved:  "Resolved",
};

const categoryIcon = {
  "Waste Management": "🗑️",
  Infrastructure:     "🏗️",
  "Road Damage":      "🚧",
  "Animal Control":   "🐕",
  Sanitation:         "🚰",
};

// Volunteer-accessible status buttons → backend enum values
// Backend only accepts: received, in_review, resolved
const STATUS_BUTTONS = [
  { label: "In Review", api: "in_review" },
  { label: "Resolved",  api: "resolved"  },
];

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
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const tabs = ["All", "In Review", "Resolved"];

  const fetchIssues = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get("/api/complaints/my-assignments");
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

  // Counts aligned to backend enum
  const counts = {
    total:    issues.length,
    inReview: issues.filter(i => i.status === "in_review" || i.status === "received").length,
    resolved: issues.filter(i => i.status === "resolved").length,
  };

  const tabCount = (tab) =>
    tab === "All"       ? counts.total    :
    tab === "In Review" ? counts.inReview :
    counts.resolved;

  const filtered = issues.filter(i => {
    const matchTab =
      activeTab === "All"       ? true :
      activeTab === "In Review" ? (i.status === "in_review" || i.status === "received") :
      activeTab === "Resolved"  ? i.status === "resolved" : true;
    const matchSearch =
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.address?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Sends only valid backend enum values: in_review | resolved
  const updateStatus = async (id, apiStatus) => {
    if (!apiStatus) return;
    if (selectedIssue?.status === apiStatus) return; // already at this status

    try {
      setUpdating(true);
      setUpdateSuccess(false);
      await API.put(`/api/complaints/status/${id}`, { status: apiStatus });

      setIssues(prev =>
        prev.map(i => String(i._id || i.id) === String(id) ? { ...i, status: apiStatus } : i)
      );
      if (selectedIssue) {
        setSelectedIssue(prev => ({ ...prev, status: apiStatus }));
      }
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 2000);
    } catch (err) {
      const code    = err?.response?.status;
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      console.error("updateStatus failed:", code, message);
      alert(`Failed to update status (${code || "network error"}):\n${message || "Unknown error"}`);
    } finally {
      setUpdating(false);
    }
  };

  const issueId   = (issue) => String(issue._id || issue.id);
  const issueDate = (issue) =>
    issue.created_at || issue.createdAt || issue.reportedAt
      ? new Date(issue.created_at || issue.createdAt || issue.reportedAt).toLocaleDateString()
      : "—";
  const issueRef  = (issue) =>
    issue._id ? "#" + String(issue._id).slice(-5).toUpperCase() : issue.id || "—";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
              You have <strong>{counts.inReview}</strong> active tasks assigned to you. Keep up the great civic work!
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, position: "relative" }}>
            {[
              { label: "In Review", value: counts.inReview },
              { label: "Resolved",  value: counts.resolved },
              { label: "Total",     value: counts.total    },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 22px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Assigned", value: counts.total,    icon: "📋", color: "#1a56db" },
            { label: "In Review",      value: counts.inReview, icon: "🔄", color: "#e65100" },
            { label: "Resolved",       value: counts.resolved, icon: "✅", color: "#16a34a" },
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
                style={{ border: "1px solid #e5e9f2", borderRadius: 10, padding: "7px 14px", fontSize: 13, outline: "none", color: "#1a1a2e", width: 200, background: "#f9fafb" }}
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
              <button onClick={() => fetchIssues(false)} style={{ marginTop: 12, background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600 }}>Retry</button>
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
              const sc         = statusColor[issue.status] || statusColor["in_review"];
              const pc         = priorityColor[issue.priority?.toLowerCase()];
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
                      📍 {issue.address || issue.location || "No location"} &nbsp;·&nbsp;
                      Reported by {issue.user_id?.name || issue.reportedBy?.name || "—"} &nbsp;·&nbsp;
                      {issueDate(issue)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {pc && (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: pc.bg, color: pc.text }}>
                        ● {issue.priority}
                      </span>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.text }}>
                      {statusLabel[issue.status] || issue.status}
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
                    {issueRef(selectedIssue)} · {selectedIssue.type || selectedIssue.category || "General"}
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
                  { label: "Location",      value: selectedIssue.address || selectedIssue.location || "—", icon: "📍" },
                  { label: "Reported By",   value: selectedIssue.user_id?.name || selectedIssue.reportedBy?.name || "—", icon: "👤" },
                  { label: "Date Reported", value: issueDate(selectedIssue), icon: "📅" },
                  { label: "Priority",      value: selectedIssue.priority || "—", icon: "🚨" },
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

              {/* Status buttons — only valid backend enum values */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>
                  Update Status
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>
                    Current: <strong style={{ color: "#1a1a2e" }}>{statusLabel[selectedIssue.status] || selectedIssue.status}</strong>
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {STATUS_BUTTONS.map(({ label, api }) => {
                    const active = selectedIssue.status === api;
                    return (
                      <button key={api}
                        onClick={() => updateStatus(issueId(selectedIssue), api)}
                        disabled={updating || active}
                        style={{
                          flex: 1, padding: "9px 0", borderRadius: 10,
                          border: active ? "2px solid #1a56db" : "2px solid #e5e9f2",
                          background: active ? "#1a56db" : "#fff",
                          color: active ? "#fff" : "#64748b",
                          fontWeight: 600, fontSize: 12,
                          cursor: (updating || active) ? "not-allowed" : "pointer",
                          opacity: updating ? 0.7 : 1, transition: "all 0.15s"
                        }}
                      >
                        {active ? `✓ ${label}` : label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Success feedback */}
              {updateSuccess && (
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#16a34a", fontWeight: 600, textAlign: "center" }}>
                  ✅ Status updated successfully!
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => updateStatus(issueId(selectedIssue), selectedIssue.status === "resolved" ? "in_review" : "resolved")}
                  disabled={updating}
                  style={{
                    flex: 1, padding: "11px 0",
                    background: selectedIssue.status === "resolved" ? "#e65100" : "#16a34a",
                    color: "#fff", border: "none", borderRadius: 10,
                    fontWeight: 600, fontSize: 14,
                    cursor: updating ? "not-allowed" : "pointer",
                    opacity: updating ? 0.7 : 1
                  }}>
                  {updating ? "Updating…" : selectedIssue.status === "resolved" ? "↩️ Mark In Review" : "✅ Mark as Resolved"}
                </button>
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