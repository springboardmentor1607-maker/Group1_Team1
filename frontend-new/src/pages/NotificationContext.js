import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import API from "../api";

const NotificationContext = createContext(null);

const STATUS_LABELS = {
  received:    "Your complaint has been received",
  pending:     "Your complaint is pending review",
  assigned:    "A volunteer has been assigned to your complaint",
  accepted:    "Volunteer accepted and will start work",
  in_progress: "Work has started on your complaint",
  in_review:   "Your complaint is under review",
  resolved:    "Your complaint has been marked as resolved",
  completed:   "Your complaint is fully completed & verified ✅",
  denied:      "Volunteer denied the complaint — will be reassigned",
};

const STATUS_ICONS = {
  received: "📥", pending: "📥", assigned: "👤",
  accepted: "✅", in_progress: "🔄", in_review: "🔍",
  resolved: "🎉", completed: "🏆", denied: "🚫",
};

const STATUS_COLORS = {
  completed: "#10b981", resolved: "#22c55e", accepted: "#16a34a",
  in_progress: "#8b5cf6", in_review: "#8b5cf6", assigned: "#f59e0b",
  denied: "#ef4444", received: "#3b82f6", pending: "#3b82f6",
};

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts]               = useState([]);
  const prevStatusMap = useRef({});
  const initialized   = useRef(false);

  const addToast = useCallback((notif) => {
    const toastId = Date.now() + Math.random();
    setToasts(t => [...t, { ...notif, toastId }]);
    setTimeout(() => setToasts(t => t.filter(x => x.toastId !== toastId)), 5000);
  }, []);

  const dismissToast  = useCallback((id) => setToasts(t => t.filter(x => x.toastId !== id)), []);
  const markAllRead   = useCallback(() => setNotifications(n => n.map(x => ({ ...x, read: true }))), []);
  const markRead      = useCallback((id) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x)), []);
  const clearAll      = useCallback(() => setNotifications([]), []);

  const poll = useCallback(async () => {
    if (!user || user.role === "admin") return;
    try {
      const endpoint = user.role === "volunteer"
        ? "/api/complaints/my-assignments"
        : "/api/complaints/my";
      const res = await API.get(endpoint);
      let raw = [];
      if (Array.isArray(res.data))                  raw = res.data;
      else if (Array.isArray(res.data?.complaints)) raw = res.data.complaints;

      const newNotifs = [];
      raw.forEach(c => {
        const id     = String(c._id || c.id);
        const status = c.status || "received";
        const prev   = prevStatusMap.current[id];
        if (!initialized.current) { prevStatusMap.current[id] = status; return; }
        if (prev && prev !== status) {
          const notif = {
            id: `${id}-${status}-${Date.now()}`,
            read: false,
            title: c.title || "Your complaint",
            status,
            message: STATUS_LABELS[status] || status.replace(/_/g, " "),
            icon:    STATUS_ICONS[status]  || "📋",
            color:   STATUS_COLORS[status] || "#3b82f6",
            time:    new Date(),
          };
          newNotifs.push(notif);
          addToast(notif);
        }
        prevStatusMap.current[id] = status;
      });
      if (!initialized.current) initialized.current = true;
      if (newNotifs.length > 0) setNotifications(n => [...newNotifs, ...n].slice(0, 50));
    } catch (_) {}
  }, [user, addToast]);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    poll();
    const timer = setInterval(poll, 20000);
    return () => clearInterval(timer);
  }, [user, poll]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, clearAll, toasts, dismissToast }}>
      {children}

      {/* Toast stack */}
      <div style={{ position:"fixed", bottom:90, left:24, zIndex:9999, display:"flex", flexDirection:"column-reverse", gap:10, pointerEvents:"none" }}>
        {toasts.map(t => (
          <div key={t.toastId} style={{
            pointerEvents:"all", background:"#fff", borderRadius:12,
            boxShadow:"0 8px 32px rgba(0,0,0,0.15)", borderLeft:`4px solid ${t.color}`,
            padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:10,
            minWidth:280, maxWidth:340, animation:"csSlideIn 0.35s ease",
          }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{t.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:2 }}>{t.title}</div>
              <div style={{ fontSize:12, color:t.color, fontWeight:500 }}>{t.message}</div>
            </div>
            <button onClick={() => dismissToast(t.toastId)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:16, padding:0 }}>✕</button>
          </div>
        ))}
      </div>

      <style>{`@keyframes csSlideIn { from { transform:translateX(-110%); opacity:0; } to { transform:translateX(0); opacity:1; } }`}</style>
    </NotificationContext.Provider>
  );
}

export function useNotifications() { return useContext(NotificationContext); }