import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import Navbar from "./Navbar";
import API from "../api";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_LABELS = { received: "Received", in_review: "In Review", resolved: "Resolved", assigned: "Assigned" };
const STATUS_BG     = { received: "#dbeafe",  in_review: "#fef9c3",   resolved: "#dcfce7",  assigned: "#f3e8ff"  };
const STATUS_TEXT   = { received: "#1d4ed8",  in_review: "#92400e",   resolved: "#166534",  assigned: "#6b21a8"  };
const STATUS_DOT    = { received: "#3b82f6",  in_review: "#f59e0b",   resolved: "#22c55e",  assigned: "#a855f7"  };
const PROGRESS_STEPS = ["received", "in_review", "resolved"];

const TYPE_ICONS = {
  pothole: "🕳️", streetlight: "💡", garbage: "🗑️",
  water: "💧", road: "🚧", noise: "🔊", other: "📌", general: "📌",
};

const PRIORITY_STYLE = {
  critical: { bg: "#fee2e2", color: "#991b1b" },
  high:     { bg: "#ffedd5", color: "#9a3412" },
  medium:   { bg: "#fef9c3", color: "#92400e" },
  low:      { bg: "#dcfce7", color: "#166534" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 1)   return "Just now";
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (day === 1) return "Yesterday";
  return `${day}d ago`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const k = status?.toLowerCase().replace(" ", "_") || "received";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: STATUS_BG[k] || "#dbeafe", color: STATUS_TEXT[k] || "#1d4ed8",
      padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_DOT[k] || "#3b82f6", display: "inline-block" }} />
      {STATUS_LABELS[k] || status}
    </span>
  );
}

// ─── Progress Tracker ─────────────────────────────────────────────────────────
function ProgressTracker({ status }) {
  const idx = PROGRESS_STEPS.indexOf(status);
  const colors = ["#3b82f6", "#f59e0b", "#22c55e"];
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0 14px" }}>
      {PROGRESS_STEPS.map((step, i) => (
        <div key={step} style={{ display: "contents" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
              background: i <= idx ? colors[i] : "#e5e7eb",
              color: i <= idx ? "#fff" : "#9ca3af",
              boxShadow: i === idx ? `0 0 0 4px ${colors[i]}25` : "none",
            }}>
              {i <= idx ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, fontWeight: i <= idx ? 600 : 400, color: i <= idx ? colors[i] : "#9ca3af", whiteSpace: "nowrap" }}>
              {STATUS_LABELS[step]}
            </span>
          </div>
          {i < PROGRESS_STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 3, margin: "0 6px", marginBottom: 18, borderRadius: 4,
              background: i < idx ? `linear-gradient(to right,${colors[i]},${colors[i + 1]})` : "#e5e7eb",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Comment Item ─────────────────────────────────────────────────────────────
function CommentItem({ comment, currentUserId, onDelete }) {
  const isOwn = String(comment.user_id?._id || comment.user_id) === String(currentUserId);
  const initials = (comment.user_id?.name || "U").substring(0, 2).toUpperCase();
  return (
    <div style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{comment.user_id?.name || "User"}</span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{timeAgo(comment.timestamp || comment.createdAt)}</span>
          {isOwn && (
            <button onClick={() => onDelete(comment._id)} style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "#ef4444", fontSize: 11, cursor: "pointer", padding: "1px 6px",
            }}>🗑️ Delete</button>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.5 }}>{comment.content}</p>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ complaint, onClose, currentUser, onVote, onComment, onDeleteComment }) {
  const [tab, setTab]         = useState("details");
  const [text, setText]       = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef              = useRef(null);

  useEffect(() => { setTab("details"); setText(""); }, [complaint?._id]);
  if (!complaint) return null;

  const typeIcon  = TYPE_ICONS[(complaint.type || "other").toLowerCase()] || "📌";
  const upvotes   = complaint.upvotes   || 0;
  const downvotes = complaint.downvotes || 0;
  const userVote  = complaint.userVote  || null;
  const comments  = complaint.commentsList || [];

  const submit = async () => {
    if (!text.trim()) return;
    setPosting(true);
    await onComment(complaint._id || complaint.id, text.trim());
    setText("");
    setPosting(false);
  };

  const tabs = [
    { k: "details",  label: "📋 Details" },
    { k: "votes",    label: `👍 Votes (${upvotes + downvotes})` },
    { k: "comments", label: `💬 Comments (${comments.length})` },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", position: "relative",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 12, right: 14, zIndex: 10,
          background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%",
          width: 28, height: 28, cursor: "pointer", fontSize: 16, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        {/* Header */}
        {complaint.image ? (
          <div style={{ height: 160, overflow: "hidden", borderRadius: "16px 16px 0 0", position: "relative", flexShrink: 0 }}>
            <img src={complaint.image} alt={complaint.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,0.5))" }} />
            <div style={{ position: "absolute", bottom: 12, left: 16, right: 44 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{complaint.title}</div>
              <div style={{ marginTop: 4 }}><StatusBadge status={complaint.status} /></div>
            </div>
          </div>
        ) : (
          <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "22px 20px 16px", borderRadius: "16px 16px 0 0", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{typeIcon}</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{complaint.title}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>
                  #{String(complaint._id || complaint.id).slice(-6).toUpperCase()} · {complaint.type || "General"}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}><StatusBadge status={complaint.status} /></div>
          </div>
        )}

        {/* Progress Tracker */}
        <div style={{ padding: "0 20px", background: "#fafafa", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
          <ProgressTracker status={complaint.status} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "0 20px", flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: "10px 12px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500,
              color: tab === t.k ? "#2563eb" : "#6b7280",
              borderBottom: tab === t.k ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>

          {/* ── DETAILS ── */}
          {tab === "details" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#f8faff", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Description</div>
                <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{complaint.description || "No description."}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "📍 Location",    value: complaint.location || complaint.address || "—" },
                  { label: "🚨 Priority",    value: (() => { const s = PRIORITY_STYLE[(complaint.priority || "low").toLowerCase()] || PRIORITY_STYLE.low; return <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{complaint.priority || "low"}</span>; })() },
                  { label: "📅 Reported On", value: formatDate(complaint.createdAt) },
                  { label: "🔄 Last Update", value: formatDate(complaint.updatedAt || complaint.createdAt) },
                  { label: "👤 Reported By", value: complaint.user_id?.name || "—" },
                  { label: "🤝 Assigned To", value: complaint.assigned_to?.name || "Not assigned" },
                ].map(f => (
                  <div key={f.label} style={{ background: "#f8faff", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>{f.value}</div>
                  </div>
                ))}
              </div>
              {complaint.landmark && (
                <div style={{ background: "#f8faff", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>🏛️ Nearby Landmark</div>
                  <div style={{ fontSize: 13, color: "#374151" }}>{complaint.landmark}</div>
                </div>
              )}
            </div>
          )}

          {/* ── VOTES ── */}
          {tab === "votes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 34, fontWeight: 800, color: "#16a34a" }}>{upvotes}</div>
                  <div style={{ fontSize: 12, color: "#166534", marginTop: 4 }}>👍 Upvotes</div>
                </div>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 34, fontWeight: 800, color: "#dc2626" }}>{downvotes}</div>
                  <div style={{ fontSize: 12, color: "#991b1b", marginTop: 4 }}>👎 Downvotes</div>
                </div>
              </div>
              {(upvotes + downvotes) > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 5 }}>
                    <span>👍 {Math.round((upvotes / (upvotes + downvotes)) * 100)}% positive</span>
                    <span>{upvotes + downvotes} total</span>
                  </div>
                  <div style={{ height: 7, background: "#fee2e2", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(to right,#22c55e,#16a34a)", width: `${Math.round((upvotes / (upvotes + downvotes)) * 100)}%`, transition: "width 0.5s" }} />
                  </div>
                </div>
              )}
              <div style={{ background: "#f8faff", borderRadius: 12, padding: 14, border: "1px solid #e0eaff" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>🗳️ Cast Your Vote</div>
                {currentUser ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { type: "upvote",   icon: "👍", count: upvotes,   color: "#22c55e" },
                        { type: "downvote", icon: "👎", count: downvotes, color: "#ef4444" },
                      ].map(v => (
                        <button key={v.type} onClick={() => onVote(complaint._id || complaint.id, v.type)} style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 14px", borderRadius: 20,
                          border: `1.5px solid ${userVote === v.type ? v.color : "#e5e7eb"}`,
                          background: userVote === v.type ? `${v.color}15` : "#f9fafb",
                          color: userVote === v.type ? v.color : "#6b7280",
                          fontSize: 13, fontWeight: userVote === v.type ? 700 : 400,
                          cursor: "pointer",
                        }}>{v.icon} {v.count}</button>
                      ))}
                    </div>
                    {userVote && <span style={{ fontSize: 12, color: "#6b7280" }}>✅ Click again to remove your vote.</span>}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    Please <a href="/login" style={{ color: "#2563eb", fontWeight: 600 }}>log in</a> to vote.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── COMMENTS ── */}
          {tab === "comments" && (
            <div>
              {currentUser ? (
                <div style={{ background: "#f8faff", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #e0eaff" }}>
                  <textarea
                    ref={inputRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(); }}
                    placeholder="Share your thoughts… (Ctrl+Enter to post)"
                    style={{
                      width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8,
                      padding: "9px 12px", fontSize: 13, resize: "none", minHeight: 68,
                      outline: "none", fontFamily: "inherit", background: "#fff",
                      color: "#374151", boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#2563eb"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button onClick={submit} disabled={!text.trim() || posting} style={{
                      background: text.trim() ? "#2563eb" : "#e5e7eb",
                      color: text.trim() ? "#fff" : "#9ca3af",
                      border: "none", borderRadius: 8, padding: "7px 16px",
                      fontSize: 13, fontWeight: 600, cursor: text.trim() ? "pointer" : "not-allowed",
                    }}>{posting ? "Posting…" : "Post Comment"}</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "#f8faff", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
                  Please <a href="/login" style={{ color: "#2563eb", fontWeight: 600 }}>log in</a> to comment.
                </div>
              )}
              {comments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>💬</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>No comments yet</div>
                  <div style={{ fontSize: 12, marginTop: 3 }}>Be the first to comment!</div>
                </div>
              ) : comments.map(c => (
                <CommentItem
                  key={c._id} comment={c}
                  currentUserId={currentUser?._id || currentUser?.id}
                  onDelete={id => onDeleteComment(complaint._id || complaint.id, id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Complaint Card ───────────────────────────────────────────────────────────
function ComplaintCard({ complaint, onView, onVote }) {
  const typeIcon     = TYPE_ICONS[(complaint.type || "other").toLowerCase()] || "📌";
  const upvotes      = complaint.upvotes   || 0;
  const downvotes    = complaint.downvotes || 0;
  const userVote     = complaint.userVote  || null;
  const commentCount = complaint.commentsList?.length || complaint.comments || 0;

  return (
    <div style={{
      background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "all 0.18s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.1)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
    >
      <div style={{ padding: "16px 16px 0" }}>
        {/* Title + status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>{typeIcon}</span>
            <button onClick={() => onView(complaint)} style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontWeight: 600, fontSize: 14, color: "#111827", textAlign: "left", lineHeight: 1.4,
            }}>
              {complaint.title}
            </button>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {/* Description */}
        <p onClick={() => onView(complaint)} style={{
          fontSize: 12.5, color: "#6b7280", margin: "0 0 10px", lineHeight: 1.55, cursor: "pointer",
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {complaint.description || "No description provided."}
        </p>

        {/* Location + time */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
            <span>📍</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
              {complaint.location || "No location"}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>🕐 {timeAgo(complaint.createdAt)}</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f3f4f6", margin: "0 16px" }} />

      {/* Footer: votes + comments */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { type: "upvote",   icon: "👍", count: upvotes,   color: "#22c55e" },
            { type: "downvote", icon: "👎", count: downvotes, color: "#ef4444" },
          ].map(v => (
            <button key={v.type}
              onClick={e => { e.stopPropagation(); onVote(complaint._id || complaint.id, v.type); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 20,
                border: `1.5px solid ${userVote === v.type ? v.color : "#e5e7eb"}`,
                background: userVote === v.type ? `${v.color}12` : "transparent",
                color: userVote === v.type ? v.color : "#6b7280",
                fontSize: 12, fontWeight: userVote === v.type ? 700 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 13 }}>{v.icon}</span>
              <span>{v.count}</span>
            </button>
          ))}
        </div>
        <button onClick={() => onView(complaint)} style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 12, color: "#6b7280", padding: 0,
        }}>
          <span style={{ fontSize: 14 }}>💬</span>
          <span>Comments ({commentCount})</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ViewComplaints() {
  const { user } = useAuth();

  const [complaints,     setComplaints]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [selected,       setSelected]       = useState(null);
  const [statusFilter,   setStatusFilter]   = useState("All Status");
  const [typeFilter,     setTypeFilter]     = useState("All Types");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [sortBy,         setSortBy]         = useState("newest");

  useEffect(() => { fetchComplaints(); }, []); // eslint-disable-line

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/complaints");
      const raw = Array.isArray(res.data) ? res.data : res.data.complaints || [];
      setComplaints(raw.map(c => ({
        ...c,
        id:           c._id || c.id,
        location:     c.address || c.location || "No location",
        image:        c.photo ? `http://localhost:5001${c.photo}` : null,
        type:         c.type      || c.issueType || "General",
        priority:     c.priority  || "low",
        status:       c.status    || "received",
        upvotes:      c.upvotes   || 0,
        downvotes:    c.downvotes || 0,
        userVote:     c.userVote  || null,
        commentsList: c.commentsList || [],
        comments:     c.comments  || 0,
        createdAt:    c.created_at || c.createdAt || new Date().toISOString(),
        updatedAt:    c.updated_at || c.updatedAt || new Date().toISOString(),
      })));
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Vote ──────────────────────────────────────────────────────────────────────
  const handleVote = async (complaintId, voteType) => {
    if (!user) { window.location.href = "/login"; return; }

    // Optimistic update ONLY for the voted complaint
    setComplaints(prev => prev.map(c => {
      if (String(c._id || c.id) !== String(complaintId)) return c; // leave others untouched

      const was = c.userVote === voteType;
      if (was) {
        // remove vote
        return {
          ...c,
          upvotes:   voteType === "upvote"   ? Math.max(0, c.upvotes - 1)   : c.upvotes,
          downvotes: voteType === "downvote" ? Math.max(0, c.downvotes - 1) : c.downvotes,
          userVote: null,
        };
      }
      if (c.userVote) {
        // switch vote
        return {
          ...c,
          upvotes:   c.userVote === "upvote"   ? Math.max(0, c.upvotes - 1)   : c.upvotes + 1,
          downvotes: c.userVote === "downvote" ? Math.max(0, c.downvotes - 1) : c.downvotes + 1,
          userVote: voteType,
        };
      }
      // new vote
      return {
        ...c,
        upvotes:   voteType === "upvote"   ? c.upvotes + 1   : c.upvotes,
        downvotes: voteType === "downvote" ? c.downvotes + 1 : c.downvotes,
        userVote: voteType,
      };
    }));

    // Also update modal if open
    setSelected(prev => {
      if (!prev || String(prev._id || prev.id) !== String(complaintId)) return prev;
      const was = prev.userVote === voteType;
      if (was) return { ...prev, upvotes: voteType === "upvote" ? Math.max(0, prev.upvotes - 1) : prev.upvotes, downvotes: voteType === "downvote" ? Math.max(0, prev.downvotes - 1) : prev.downvotes, userVote: null };
      if (prev.userVote) return { ...prev, upvotes: prev.userVote === "upvote" ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1, downvotes: prev.userVote === "downvote" ? Math.max(0, prev.downvotes - 1) : prev.downvotes + 1, userVote: voteType };
      return { ...prev, upvotes: voteType === "upvote" ? prev.upvotes + 1 : prev.upvotes, downvotes: voteType === "downvote" ? prev.downvotes + 1 : prev.downvotes, userVote: voteType };
    });

    try {
      const res = await API.post(`/api/complaints/${complaintId}/vote`, { voteType });
      // Update with actual values from backend (no full refetch)
      if (res.data) {
        const { upvotes, downvotes, userVote } = res.data;
        const sync = c => {
          if (String(c._id || c.id) !== String(complaintId)) return c;
          return { ...c, upvotes, downvotes, userVote };
        };
        setComplaints(prev => prev.map(sync));
        setSelected(prev => prev ? sync(prev) : prev);
      }
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  // ── Comment ───────────────────────────────────────────────────────────────────
  const handleComment = async (complaintId, content) => {
    try {
      const res = await API.post(`/api/complaints/${complaintId}/comments`, { content });
      const nc = res.data?.comment || {
        _id: Date.now().toString(), content,
        user_id: { _id: user?._id, name: user?.name },
        timestamp: new Date().toISOString(),
      };
      const update = c => {
        if (String(c._id || c.id) !== String(complaintId)) return c;
        return { ...c, commentsList: [...(c.commentsList || []), nc], comments: (c.comments || 0) + 1 };
      };
      setComplaints(p => p.map(update));
      setSelected(p => p ? update(p) : p);
    } catch (err) { console.error(err); }
  };

  // ── Delete Comment ────────────────────────────────────────────────────────────
  const handleDeleteComment = async (complaintId, commentId) => {
    try {
      await API.delete(`/api/complaints/${complaintId}/comments/${commentId}`);
      const update = c => {
        if (String(c._id || c.id) !== String(complaintId)) return c;
        return {
          ...c,
          commentsList: (c.commentsList || []).filter(cm => cm._id !== commentId),
          comments: Math.max((c.comments || 1) - 1, 0),
        };
      };
      setComplaints(p => p.map(update));
      setSelected(p => p ? update(p) : p);
    } catch (err) { console.error(err); }
  };

  // ── Filter + Sort ─────────────────────────────────────────────────────────────
  const filtered = complaints
    .filter(c => {
      const matchStatus = statusFilter === "All Status" || c.status === statusFilter;
      const matchType   = typeFilter   === "All Types"  || (c.type || "").toLowerCase() === typeFilter.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        c.title?.toLowerCase().includes(q) ||
        (c.location || "").toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);
      return matchStatus && matchType && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "oldest")        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "most_votes")    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      if (sortBy === "most_comments") return (b.comments || 0) - (a.comments || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>

      <Navbar />

      {/* ── Page Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Community Reports</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
            Browse and engage with civic complaints in your community
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px 48px" }}>

        {/* ── Filter Bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20, flexWrap: "wrap", gap: 10,
        }}>
          {/* Search */}
          <input
            placeholder="🔍 Search complaints..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px",
              fontSize: 13, outline: "none", background: "#fff", color: "#374151", width: 240,
            }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />

          {/* Dropdowns */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
              border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px",
              fontSize: 13, background: "#fff", color: "#374151", outline: "none", cursor: "pointer",
            }}>
              <option>All Status</option>
              <option value="received">Received</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>

            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{
              border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px",
              fontSize: 13, background: "#fff", color: "#374151", outline: "none", cursor: "pointer",
            }}>
              <option>All Types</option>
              <option value="pothole">Pothole</option>
              <option value="streetlight">Streetlight</option>
              <option value="garbage">Garbage</option>
              <option value="water">Water Leak</option>
              <option value="road">Road Damage</option>
              <option value="noise">Noise</option>
              <option value="other">Other</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px",
              fontSize: 13, background: "#fff", color: "#374151", outline: "none", cursor: "pointer",
            }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_votes">Most Votes</option>
              <option value="most_comments">Most Comments</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Showing <strong style={{ color: "#111827" }}>{filtered.length}</strong> of {complaints.length} complaints
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Loading complaints…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#6b7280" }}>No complaints found</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Try adjusting your filters.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map(c => (
              <ComplaintCard
                key={c._id || c.id}
                complaint={c}
                onView={setSelected}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      <DetailModal
        complaint={selected}
        onClose={() => setSelected(null)}
        currentUser={user}
        onVote={handleVote}
        onComment={handleComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}