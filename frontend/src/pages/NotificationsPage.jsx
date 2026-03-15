import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useNotifications } from "./NotificationContext";
import "../Dashboard.css";

function timeAgo(date) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs  < 24) return `${hrs}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatFull(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_FILTERS = [
  { key: "all",         label: "All"         },
  { key: "completed",   label: "Completed"   },
  { key: "resolved",    label: "Resolved"    },
  { key: "assigned",    label: "Assigned"    },
  { key: "accepted",    label: "Accepted"    },
  { key: "in_progress", label: "In Progress" },
  { key: "denied",      label: "Denied"      },
];

export default function NotificationsPage() {
  const navigate  = useNavigate();
  const notifCtx  = useNotifications();
  const [filter, setFilter] = useState("all");

  if (!notifCtx) return null;
  const { notifications, markAllRead, markRead, clearAll } = notifCtx;

  const filtered = filter === "all"
    ? notifications
    : notifications.filter(n => n.status === filter);

  const unread = notifications.filter(n => !n.read).length;

  const groups = {};
  filtered.forEach(n => {
    const d = new Date(n.time);
    const key = isNaN(d) ? "Unknown" :
      d.toDateString() === new Date().toDateString() ? "Today" :
      d.toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" :
      d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });

  return (
    <div className="cs-page" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>🔔 Notifications</h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
              {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "You're all caught up!"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb",
                borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Mark all read</button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAll} style={{
                background: "#fff", border: "1px solid #e5e7eb", color: "#6b7280",
                borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Clear all</button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {STATUS_FILTERS.map(f => {
            const cnt = f.key === "all" ? notifications.length : notifications.filter(n => n.status === f.key).length;
            if (cnt === 0 && f.key !== "all") return null;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                background: filter === f.key ? "#2563eb" : "#f1f5f9",
                color: filter === f.key ? "#fff" : "#6b7280",
                border: "none", borderRadius: 9999, padding: "6px 14px",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>
                {f.label}{cnt > 0 ? ` (${cnt})` : ""}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "60px 24px",
            textAlign: "center", border: "1px solid #f1f5f9",
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔕</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No notifications yet</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
              You'll be notified when your complaint status changes
            </div>
            <button onClick={() => navigate("/dashboard")} style={{
              background: "#2563eb", color: "#fff", border: "none",
              borderRadius: 10, padding: "10px 24px", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Go to Dashboard</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {Object.entries(groups).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  {dateLabel}
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  {items.map((n, i) => (
                    <div key={n.id} onClick={() => markRead(n.id)} style={{
                      padding: "16px 20px",
                      borderBottom: i < items.length - 1 ? "1px solid #f1f5f9" : "none",
                      background: n.read ? "#fff" : "#eff6ff",
                      display: "flex", gap: 14, alignItems: "flex-start", cursor: "default",
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: n.color + "18",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      }}>{n.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(n.time)}</div>
                        </div>
                        <div style={{ fontSize: 13, color: n.color, fontWeight: 600, marginTop: 3 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{formatFull(n.time)}</div>
                      </div>
                      {!n.read && (
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 6 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}