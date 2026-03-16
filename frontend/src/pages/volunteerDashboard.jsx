import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import API from "../api";
import Navbar from "./Navbar";

// ─── Constants ────────────────────────────────────────────────────────────────
const POLL_INTERVAL = 15000;

const priorityColor = {
  high:     { bg: "#fff0f0", text: "#c0392b", border: "#fca5a5" },
  medium:   { bg: "#fffbf0", text: "#b7770d", border: "#fcd34d" },
  low:      { bg: "#f0fff4", text: "#1a7a4a", border: "#86efac" },
  urgent:   { bg: "#fdf2f8", text: "#9d174d", border: "#f9a8d4" },
  critical: { bg: "#fef2f2", text: "#7f1d1d", border: "#fca5a5" },
};

const categoryIcon = {
  pothole:     "🕳️", streetlight: "💡", garbage:  "🗑️",
  water:       "💧", road:        "🛣️", noise:    "🔊",
  other:       "📌", general:     "📌", sanitation: "🚰",
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  received:    { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6", label: "Pending"     },
  pending:     { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6", label: "Pending"     },
  assigned:    { bg: "#fef9c3", text: "#92400e", dot: "#f59e0b", label: "Assigned"    },
  accepted:    { bg: "#dcfce7", text: "#166534", dot: "#22c55e", label: "Accepted"    },
  in_review:   { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6", label: "In Progress" },
  in_progress: { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6", label: "In Progress" },
  resolved:    { bg: "#dcfce7", text: "#166534", dot: "#22c55e", label: "Resolved"    },
  completed:   { bg: "#d1fae5", text: "#065f46", dot: "#10b981", label: "Completed"   },
  denied:      { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Denied"      },
};
function getStatusCfg(s) { return STATUS_CONFIG[s?.toLowerCase()] || STATUS_CONFIG.received; }

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = getStatusCfg(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: c.bg, color: c.text,
      padding: "4px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
      {c.label}
    </span>
  );
}

// ─── IssueRow ─────────────────────────────────────────────────────────────────
function IssueRow({ issue, isSelected, onSelect }) {
  const id   = String(issue._id || issue.id);
  const ref  = "#" + id.slice(-5).toUpperCase();
  const pc   = priorityColor[issue.priority?.toLowerCase()] || priorityColor.medium;
  const date = new Date(issue.created_at || issue.createdAt || issue.reportedAt).toLocaleDateString();
  const needsAction = ["assigned", "received", "pending"].includes(issue.status);

  return (
    <div
      onClick={() => onSelect(issue)}
      style={{
        padding: "18px 24px",
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: 16,
        background: isSelected ? "#f0f5ff" : needsAction ? "#fffbeb" : "#fff",
        transition: "background 0.15s",
        borderLeft: needsAction ? "3px solid #f59e0b" : "3px solid transparent",
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f8faff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = isSelected ? "#f0f5ff" : needsAction ? "#fffbeb" : "#fff"; }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, background: "#f4f6fb",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>
        {categoryIcon[issue.type] || categoryIcon[issue.category] || "📌"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{issue.title}</span>
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{ref}</span>
          {needsAction && (
            <span style={{
              fontSize: 10, fontWeight: 700, background: "#f59e0b", color: "#fff",
              padding: "2px 7px", borderRadius: 9999,
            }}>ACTION REQUIRED</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#64748b" }}>
          📍 {issue.address || issue.location || "No location"} &nbsp;·&nbsp;
          {issue.user_id?.name || "—"} &nbsp;·&nbsp; {date}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`,
        }}>
          ● {issue.priority || "medium"}
        </span>
        <StatusBadge status={issue.status} />
        <span style={{ fontSize: 18, color: "#cbd5e1" }}>›</span>
      </div>
    </div>
  );
}

// ─── IssueDetailModal ─────────────────────────────────────────────────────────
function IssueDetailModal({ issue, onClose, onAccept, onDeny, onStartWorking, onMarkResolved, loading, successMsg, errorMsg }) {
  if (!issue) return null;

  const ref  = "#" + String(issue._id || issue.id).slice(-5).toUpperCase();
  const date = new Date(issue.created_at || issue.createdAt || issue.reportedAt).toLocaleDateString();
  const st   = issue.status;

  const isPendingAccept = ["assigned", "received", "pending"].includes(st);
  const isAccepted      = st === "accepted";
  const isInProgress    = ["in_review", "in_progress"].includes(st);
  const isResolved      = st === "resolved";
  const isCompleted     = st === "completed";
  const isDenied        = st === "denied";

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        zIndex: 200, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560,
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden",
          maxHeight: "90vh", overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(120deg,#1a56db,#3b82f6)", padding: "22px 26px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 11, opacity: 0.8, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>
                {ref} · {issue.type || issue.category || "General"}
              </p>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>{issue.title}</h3>
              <StatusBadge status={issue.status} />
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
              width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 26px" }}>

          {/* Detail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            {[
              { label: "Location",    value: issue.address || issue.location || "—",               icon: "📍" },
              { label: "Reported By", value: issue.user_id?.name || issue.reportedBy?.name || "—", icon: "👤" },
              { label: "Date",        value: date,                                                  icon: "📅" },
              { label: "Priority",    value: issue.priority || "medium",                            icon: "🚨" },
            ].map(f => (
              <div key={f.label} style={{ background: "#f8faff", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{f.icon} {f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", textTransform: "capitalize" }}>{f.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: "#f8faff", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>📝 Description</div>
            <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>
              {issue.description || "No description provided."}
            </p>
          </div>

          {/* Photo */}
          {issue.photo && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>📷 Photo</div>
              <img
                src={`http://localhost:5000${issue.photo}`}
                alt="Complaint"
                style={{ width: "100%", borderRadius: 10, maxHeight: 200, objectFit: "cover" }}
              />
            </div>
          )}

          {/* ── ACTION PANEL ── */}
          <div style={{
            background: "#f8faff", borderRadius: 12, padding: "18px",
            border: "1px solid #e0e7ff", marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Actions
            </div>

            {/* STEP 1 — Needs Accept / Deny */}
            {isPendingAccept && (
              <div>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>
                  You have been assigned this complaint. Accept to work on it, or deny to decline.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => onAccept(issue._id || issue.id)}
                    disabled={loading}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: 10,
                      background: loading ? "#86efac" : "#16a34a", color: "#fff",
                      border: "none", fontWeight: 700, fontSize: 15,
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "opacity 0.15s",
                    }}
                  >
                    ✅ Accept Issue
                  </button>
                  <button
                    onClick={() => onDeny(issue._id || issue.id)}
                    disabled={loading}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: 10,
                      background: loading ? "#fca5a5" : "#ef4444", color: "#fff",
                      border: "none", fontWeight: 700, fontSize: 15,
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "opacity 0.15s",
                    }}
                  >
                    ❌ Deny Issue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Accepted → Start Working */}
            {isAccepted && (
              <div>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>
                  You've accepted this complaint. Click below to start working on it.
                </p>
                <button
                  onClick={() => onStartWorking(issue._id || issue.id)}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 10,
                    background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
                    color: "#fff", border: "none", fontWeight: 700, fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.75 : 1,
                    boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                    transition: "opacity 0.15s",
                  }}
                >
                  {loading ? "Updating…" : "🔄 Start Working"}
                </button>
              </div>
            )}

            {/* STEP 3 — In Progress → Mark as Resolved */}
            {isInProgress && (
              <div>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>
                  You are currently working on this. Mark it as resolved when done.
                </p>
                <button
                  onClick={() => onMarkResolved(issue._id || issue.id)}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 10,
                    background: loading ? "#a78bfa" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    color: "#fff", border: "none", fontWeight: 700, fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.75 : 1,
                    boxShadow: loading ? "none" : "0 4px 14px rgba(109,40,217,0.35)",
                    transition: "opacity 0.15s",
                  }}
                >
                  {loading ? "Updating…" : "🎯 Mark as Resolved"}
                </button>
              </div>
            )}

            {/* STEP 4 — Resolved — awaiting admin approval */}
            {isResolved && (
              <div style={{
                background: "#f5f3ff", border: "1px solid #ddd6fe",
                borderRadius: 10, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>⏳</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#6d28d9" }}>
                  Marked as resolved. Awaiting admin approval to complete.
                </div>
              </div>
            )}

            {/* STEP 5 — Completed — verified by admin */}
            {isCompleted && (
              <div style={{
                background: "#f0fdf4", border: "1px solid #86efac",
                borderRadius: 10, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>
                  Issue completed and verified by admin.
                </div>
              </div>
            )}

            {/* Denied */}
            {isDenied && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 10, padding: "14px", textAlign: "center",
              }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>🚫</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>You Denied This Complaint</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Admin has been notified and may reassign it.</div>
              </div>
            )}
          </div>

          {/* Feedback */}
          {successMsg && (
            <div style={{
              background: "#f0fdf4", border: "1px solid #86efac",
              borderRadius: 10, padding: "10px 14px",
              fontSize: 13, color: "#16a34a", fontWeight: 600, textAlign: "center", marginBottom: 10,
            }}>✅ {successMsg}</div>
          )}
          {errorMsg && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, padding: "10px 14px",
              fontSize: 13, color: "#991b1b", fontWeight: 600, textAlign: "center", marginBottom: 10,
            }}>⚠️ {errorMsg}</div>
          )}

          <button onClick={onClose} style={{
            width: "100%", padding: "10px 0", borderRadius: 10,
            background: "#f1f5f9", color: "#64748b",
            border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg]       = useState("");
  const [errorMsg, setErrorMsg]           = useState("");

  const tabs = ["All", "Pending", "Accepted", "In Progress", "Resolved", "Completed", "Denied"];

  // ── Fetch ──────────────────────────────────────────────────────────────────
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

  // ── Counts ─────────────────────────────────────────────────────────────────
  const counts = {
    total:      issues.length,
    pending:    issues.filter(i => ["assigned", "received", "pending"].includes(i.status)).length,
    accepted:   issues.filter(i => i.status === "accepted").length,
    inProgress: issues.filter(i => ["in_review", "in_progress"].includes(i.status)).length,
    resolved:   issues.filter(i => i.status === "resolved").length,
    completed:  issues.filter(i => i.status === "completed").length,
    denied:     issues.filter(i => i.status === "denied").length,
  };

  const tabCount = (tab) => ({
    "All": counts.total, "Pending": counts.pending, "Accepted": counts.accepted,
    "In Progress": counts.inProgress, "Resolved": counts.resolved,
    "Completed": counts.completed, "Denied": counts.denied,
  })[tab] ?? 0;

  const filtered = issues.filter(i => {
    const groups = {
      "All":         true,
      "Pending":     ["assigned", "received", "pending"].includes(i.status),
      "Accepted":    i.status === "accepted",
      "In Progress": ["in_review", "in_progress"].includes(i.status),
      "Resolved":    i.status === "resolved",
      "Completed":   i.status === "completed",
      "Denied":      i.status === "denied",
    };
    return (groups[activeTab] ?? true) && (
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.address?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ── Feedback helper ────────────────────────────────────────────────────────
  const showFeedback = (msg, isError = false) => {
    if (isError) setErrorMsg(msg); else setSuccessMsg(msg);
    setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 3000);
  };

  // ── Optimistic status update ───────────────────────────────────────────────
  const patchStatus = (id, newStatus) => {
    setIssues(prev => prev.map(i => String(i._id || i.id) === String(id) ? { ...i, status: newStatus } : i));
    setSelectedIssue(prev =>
      prev && String(prev._id || prev.id) === String(id) ? { ...prev, status: newStatus } : prev
    );
  };

  // ── ACCEPT ─────────────────────────────────────────────────────────────────
  const handleAccept = async (id) => {
    try {
      setActionLoading(true);
      await API.put(`/api/complaints/status/${id}`, { status: "accepted" });
      patchStatus(id, "accepted");
      showFeedback("Complaint accepted! Click 'Start Working' when you begin.");
    } catch (err) {
      showFeedback(err?.response?.data?.message || "Failed to accept. Try again.", true);
    } finally {
      setActionLoading(false);
    }
  };

  // ── DENY ───────────────────────────────────────────────────────────────────
  const handleDeny = async (id) => {
    try {
      setActionLoading(true);
      await API.put(`/api/complaints/status/${id}`, { status: "denied" });
      patchStatus(id, "denied");
      showFeedback("Complaint denied. Admin will be notified.");
    } catch (err) {
      showFeedback(err?.response?.data?.message || "Failed to deny. Try again.", true);
    } finally {
      setActionLoading(false);
    }
  };

  // ── START WORKING ──────────────────────────────────────────────────────────
  const handleStartWorking = async (id) => {
    try {
      setActionLoading(true);
      await API.put(`/api/complaints/status/${id}`, { status: "in_progress" });
      patchStatus(id, "in_progress");
      showFeedback("Status updated to In Progress. Go get it done!");
    } catch (err) {
      showFeedback(err?.response?.data?.message || "Failed to update. Try again.", true);
    } finally {
      setActionLoading(false);
    }
  };

  // ── MARK RESOLVED ──────────────────────────────────────────────────────────
  const handleMarkResolved = async (id) => {
    try {
      setActionLoading(true);
      await API.put(`/api/complaints/status/${id}`, { status: "resolved" });
      patchStatus(id, "resolved");
      showFeedback("Marked as Resolved! Awaiting admin approval.");
    } catch (err) {
      showFeedback(err?.response?.data?.message || "Failed to update status.", true);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f4f6fb", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Welcome Banner ── */}
        <div style={{
          background: "linear-gradient(120deg,#1a56db 0%,#2563eb 60%,#3b82f6 100%)",
          borderRadius: 16, padding: "28px 32px", marginBottom: 28, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, opacity: 0.8, marginBottom: 6, textTransform: "uppercase" }}>
              🙋 Volunteer Dashboard
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>Welcome back, {userName} 👋</h2>
            <p style={{ opacity: 0.85, fontSize: 14, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
              {counts.pending > 0
                ? `You have ${counts.pending} complaint${counts.pending > 1 ? "s" : ""} awaiting your Accept/Deny response.`
                : "All caught up! Great work keeping the community clean."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, position: "relative" }}>
            {[
              { label: "Pending",     value: counts.pending     },
              { label: "Accepted",    value: counts.accepted    },
              { label: "In Progress", value: counts.inProgress  },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.15)", borderRadius: 12,
                padding: "14px 22px", textAlign: "center", backdropFilter: "blur(8px)",
              }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total",       value: counts.total,      icon: "📋", color: "#1a56db" },
            { label: "Pending",     value: counts.pending,    icon: "⏳", color: "#f59e0b" },
            { label: "Accepted",    value: counts.accepted,   icon: "✔️", color: "#2563eb" },
            { label: "In Progress", value: counts.inProgress, icon: "🔄", color: "#8b5cf6" },
            { label: "Resolved",    value: counts.resolved,   icon: "✅", color: "#16a34a" },
            { label: "Denied",      value: counts.denied,     icon: "🚫", color: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 14, padding: "18px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: 12,
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: s.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
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
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: activeTab === tab ? "#1a56db" : "transparent",
                    color: activeTab === tab ? "#fff" : "#64748b",
                    fontSize: 12, fontWeight: 500, transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    {tab}
                    <span style={{
                      background: activeTab === tab ? "rgba(255,255,255,0.25)" : "#e5e7eb",
                      color: activeTab === tab ? "#fff" : "#6b7280",
                      borderRadius: 9999, padding: "1px 6px", fontSize: 10, fontWeight: 700,
                    }}>
                      {tabCount(tab)}
                    </span>
                  </button>
                ))}
              </div>
              <input
                placeholder="🔍  Search issues..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: "1px solid #e5e9f2", borderRadius: 10, padding: "7px 14px", fontSize: 13, outline: "none", color: "#1a1a2e", width: 200, background: "#f9fafb" }}
              />
              <button onClick={() => fetchIssues(false)} title="Refresh" style={{ background: "#f4f6fb", border: "1px solid #e5e9f2", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 14, color: "#64748b" }}>
                <span style={{ display: "inline-block", animation: loading ? "spin-v 0.7s linear infinite" : "none" }}>🔄</span>
                <style>{`@keyframes spin-v { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
              <div>Loading your tasks…</div>
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
              <div style={{ fontSize: 15 }}>{issues.length === 0 ? "No tasks assigned yet." : "No issues match your search."}</div>
            </div>
          ) : (
            filtered.map(issue => (
              <IssueRow
                key={String(issue._id || issue.id)}
                issue={issue}
                isSelected={String(selectedIssue?._id || selectedIssue?.id) === String(issue._id || issue.id)}
                onSelect={setSelectedIssue}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => { setSelectedIssue(null); setSuccessMsg(""); setErrorMsg(""); }}
          onAccept={handleAccept}
          onDeny={handleDeny}
          onStartWorking={handleStartWorking}
          onMarkResolved={handleMarkResolved}
          loading={actionLoading}
          successMsg={successMsg}
          errorMsg={errorMsg}
        />
      )}
    </div>
  );
}