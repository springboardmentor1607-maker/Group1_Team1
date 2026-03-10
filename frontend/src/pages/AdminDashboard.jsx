import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Dashboard.css";
import Navbar from "./Navbar";
import API from "../api";

// ─── Logo ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
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
  const MAP = {
    received:    { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6", label: "Received"    },
    assigned:    { bg: "#e0f2fe", color: "#0369a1", dot: "#0ea5e9", label: "Assigned"    },
    accepted:    { bg: "#dcfce7", color: "#15803d", dot: "#22c55e", label: "Accepted"    },
    denied:      { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444", label: "Denied"      },
    in_progress: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316", label: "In Progress" },
    resolved:    { bg: "#ede9fe", color: "#7c3aed", dot: "#8b5cf6", label: "Resolved"    },
    completed:   { bg: "#dcfce7", color: "#166534", dot: "#22c55e", label: "Completed"   },
    in_review:   { bg: "#ede9fe", color: "#5b21b6", dot: "#8b5cf6", label: "In Review"   },
  };
  const key = status?.toLowerCase().replace(" ", "_") || "received";
  const s = MAP[key] || MAP["received"];
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
    high: { bg: "#ffedd5", color: "#9a3412" },
    medium: { bg: "#fef9c3", color: "#92400e" },
    low: { bg: "#dcfce7", color: "#166534" },
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

// ─── Reports Tab ─────────────────────────────────────────────────────────────
function ReportsTab({ complaints, users, volunteers }) {
  const total      = complaints.length;
  const received   = complaints.filter(c => c.status === "received").length;
  const inReview   = complaints.filter(c => c.status === "in_review").length;
  const resolved   = complaints.filter(c => c.status === "resolved").length;
  const denied = complaints.filter(c => c.status === "denied"
).length;
  const resolveRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Complaints by type


  const byType = complaints.reduce((acc, c) => {
    const t = c.type || "other";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  // Complaints by priority
  const byPriority = complaints.reduce((acc, c) => {
    const p = c.priority || "medium";
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  // Top volunteers by resolved complaints
  const volStats = volunteers.map(v => ({
    name: v.name,
    resolved: complaints.filter(c => String(c.assigned_to?._id || c.assigned_to) === String(v._id) && c.status === "resolved").length,
    assigned: complaints.filter(c => String(c.assigned_to?._id || c.assigned_to) === String(v._id)).length,
  })).sort((a, b) => b.resolved - a.resolved);

  // ── Download CSV ────────────────────────────────────────────────────────────
  const downloadCSV = () => {
    const headers = ["ID", "Title", "Type", "Priority", "Status", "Address", "Reported By", "Assigned To", "Created At", "Updated At"];
    const rows = complaints.map(c => [
      String(c._id).slice(-6).toUpperCase(),
      `"${(c.title || "").replace(/"/g, "'")}"`,
      c.type || "other",
      c.priority || "medium",
      c.status || "received",
      `"${(c.address || "").replace(/"/g, "'")}"`,
      `"${c.user_id?.name || "—"}"`,
      `"${c.assigned_to?.name || "Not assigned"}"`,
      new Date(c.created_at || c.createdAt).toLocaleDateString(),
      new Date(c.updated_at || c.updatedAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `cleanstreet_complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Download Summary PDF ────────────────────────────────────────────────────
  const downloadSummary = () => {
    const html = `
      <html><head><title>CleanStreet Summary Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111827; }
        h1 { color: #1d4ed8; font-size: 24px; margin-bottom: 4px; }
        .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 28px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 14px; font-weight: 700; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
        .stat-box { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; text-align: center; }
        .stat-num { font-size: 28px; font-weight: 800; color: #1d4ed8; }
        .stat-label { font-size: 11px; color: #6b7280; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f3f4f6; padding: 8px 10px; text-align: left; font-size: 11px; color: #6b7280; text-transform: uppercase; }
        td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
        .resolved { background: #dcfce7; color: #166534; }
        .in_review { background: #ede9fe; color: #5b21b6; }
        .received { background: #dbeafe; color: #1d4ed8; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <h1>🌿 CleanStreet — Summary Report</h1>
      <div class="subtitle">Generated: ${new Date().toLocaleString()}</div>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-num">${total}</div><div class="stat-label">Total Complaints</div></div>
        <div class="stat-box"><div class="stat-num">${received}</div><div class="stat-label">Received</div></div>
        <div class="stat-box"><div class="stat-num">${inReview}</div><div class="stat-label">In Review</div></div>
        <div class="stat-box"><div class="stat-num" style="color:#22c55e">${resolved}</div><div class="stat-label">Resolved</div></div>
      </div>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-num">${resolveRate}%</div><div class="stat-label">Resolution Rate</div></div>
        <div class="stat-box"><div class="stat-num">${users.length}</div><div class="stat-label">Total Users</div></div>
        <div class="stat-box"><div class="stat-num">${volunteers.length}</div><div class="stat-label">Volunteers</div></div>
        <div class="stat-box"><div class="stat-num">${total - resolved}</div><div class="stat-label">Pending</div></div>
      </div>
      <div class="section">
        <div class="section-title">Complaints by Type</div>
        <table><tr>${Object.entries(byType).map(([k,v]) => `<th>${k}</th>`).join("")}</tr>
        <tr>${Object.entries(byType).map(([k,v]) => `<td>${v}</td>`).join("")}</tr></table>
      </div>
      <div class="section">
        <div class="section-title">Complaints by Priority</div>
        <table><tr>${Object.entries(byPriority).map(([k,v]) => `<th>${k}</th>`).join("")}</tr>
        <tr>${Object.entries(byPriority).map(([k,v]) => `<td>${v}</td>`).join("")}</tr></table>
      </div>
      <div class="section">
        <div class="section-title">Top Volunteers</div>
        <table><tr><th>#</th><th>Name</th><th>Assigned</th><th>Resolved</th></tr>
        ${volStats.map((v,i) => `<tr><td>${i+1}</td><td>${v.name}</td><td>${v.assigned}</td><td>${v.resolved}</td></tr>`).join("")}
        </table>
      </div>
      <div class="section">
        <div class="section-title">All Complaints</div>
        <table>
          <tr><th>ID</th><th>Title</th><th>Type</th><th>Priority</th><th>Status</th><th>Reported By</th><th>Date</th></tr>
          ${complaints.map(c => `<tr>
            <td style="font-family:monospace;color:#9ca3af">#${String(c._id).slice(-6).toUpperCase()}</td>
            <td>${c.title || "—"}</td>
            <td style="text-transform:capitalize">${c.type || "other"}</td>
            <td style="text-transform:capitalize">${c.priority || "medium"}</td>
            <td><span class="badge ${c.status}">${(c.status||"received").replace("_"," ")}</span></td>
            <td>${c.user_id?.name || "—"}</td>
            <td>${new Date(c.created_at || c.createdAt).toLocaleDateString()}</td>
          </tr>`).join("")}
        </table>
      </div>
      </body></html>`;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };
  const downloadSingleReport = (c) => {
    const id = String(c._id).slice(-6).toUpperCase();
    const statusColor = c.status === "resolved" ? "#166534" : c.status === "in_review" ? "#5b21b6" : "#1d4ed8";
    const statusBg    = c.status === "resolved" ? "#dcfce7" : c.status === "in_review" ? "#ede9fe" : "#dbeafe";
    const html = `
      <html><head><title>Complaint #${id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111827; max-width: 700px; margin: 0 auto; }
        .header { background: linear-gradient(135deg,#1e3a8a,#2563eb); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
        .header h1 { margin: 0 0 4px; font-size: 22px; }
        .header .meta { font-size: 12px; opacity: 0.7; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: ${statusBg}; color: ${statusColor}; }
        .section { background: #f8fafc; border-radius: 10px; padding: 16px 20px; margin-bottom: 14px; }
        .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: 700; margin-bottom: 3px; }
        .field-value { font-size: 13px; color: #111827; font-weight: 500; }
        .stat-row { display: flex; gap: 24px; }
        .stat { text-align: center; }
        .stat-num { font-size: 22px; font-weight: 800; }
        .stat-label { font-size: 11px; color: #9ca3af; }
        .footer { text-align: center; color: #9ca3af; font-size: 11px; margin-top: 28px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div class="meta">CleanStreet Complaint Report · Generated ${new Date().toLocaleString()}</div>
        <h1>${c.title || "Untitled Complaint"}</h1>
        <div class="meta">#${id} · ${c.type || "General"}</div>
        <div style="margin-top:10px"><span class="badge">${(c.status || "received").replace("_"," ").toUpperCase()}</span></div>
      </div>
      <div class="section">
        <div class="section-title">Description</div>
        <div style="font-size:13px;color:#374151;line-height:1.6">${c.description || "No description provided."}</div>
      </div>
      <div class="section">
        <div class="section-title">Details</div>
        <div class="grid">
          <div><div class="field-label">Type</div><div class="field-value" style="text-transform:capitalize">${c.type || "other"}</div></div>
          <div><div class="field-label">Priority</div><div class="field-value" style="text-transform:capitalize">${c.priority || "medium"}</div></div>
          <div><div class="field-label">Address</div><div class="field-value">${c.address || "—"}</div></div>
          <div><div class="field-label">Landmark</div><div class="field-value">${c.landmark || "—"}</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">People</div>
        <div class="grid">
          <div><div class="field-label">Reported By</div><div class="field-value">${c.user_id?.name || "—"}</div><div style="font-size:11px;color:#6b7280">${c.user_id?.email || ""}</div></div>
          <div><div class="field-label">Assigned To</div><div class="field-value">${c.assigned_to?.name || "Not assigned"}</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Dates</div>
        <div class="grid">
          <div><div class="field-label">Reported On</div><div class="field-value">${new Date(c.created_at || c.createdAt).toLocaleString()}</div></div>
          <div><div class="field-label">Last Updated</div><div class="field-value">${new Date(c.updated_at || c.updatedAt).toLocaleString()}</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Community Engagement</div>
        <div class="stat-row">
          <div class="stat"><div class="stat-num" style="color:#22c55e">${c.upvotes || 0}</div><div class="stat-label">Upvotes</div></div>
          <div class="stat"><div class="stat-num" style="color:#ef4444">${c.downvotes || 0}</div><div class="stat-label">Downvotes</div></div>
          <div class="stat"><div class="stat-num" style="color:#3b82f6">${c.comments || 0}</div><div class="stat-label">Comments</div></div>
        </div>
      </div>
      <div class="footer">CleanStreet · Civic Issue Reporting & Tracking · Report ID: ${id}</div>
      </body></html>`;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };
  const barMax = Math.max(...Object.values(byType), 1);
  const TYPE_COLORS = { pothole: "#3b82f6", streetlight: "#f59e0b", garbage: "#10b981", water: "#06b6d4", road: "#8b5cf6", noise: "#f43f5e", other: "#6b7280", general: "#6b7280" };
  const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#f97316", urgent: "#ef4444", critical: "#dc2626" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Reports & Analytics</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Generate and download complaint reports.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={downloadCSV} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#2563eb", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 16px", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
          }}>📥 Download CSV</button>
          <button onClick={downloadSummary} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#fff", color: "#374151",
            border: "1.5px solid #e5e7eb",
            borderRadius: 8, padding: "9px 16px", fontSize: 13,
            fontWeight: 600, cursor: "pointer",
          }}>📄 Summary PDF</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Complaints", value: total,        icon: "📋", color: "#3b82f6" },
          { label: "Received",         value: received,     icon: "📥", color: "#f59e0b" },
          { label: "In Review",        value: inReview,     icon: "🔄", color: "#8b5cf6" },
          { label: "Resolved",         value: resolved,     icon: "✅", color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 12, padding: "18px 20px",
            border: "1px solid #e5e7eb", borderTop: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Complaints by Type */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>📊 Complaints by Type</div>
          {Object.entries(byType).length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No data yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, color: "#374151", textTransform: "capitalize" }}>{type}</span>
                    <span style={{ fontWeight: 700, color: "#111827" }}>{count}</span>
                  </div>
                  <div style={{ height: 8, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: TYPE_COLORS[type] || "#6b7280",
                      width: `${Math.round((count / barMax) * 100)}%`,
                      transition: "width 0.5s",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolution Rate */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>🎯 Resolution Rate</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "10px 0" }}>
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: `conic-gradient(#22c55e ${resolveRate * 3.6}deg, #f3f4f6 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                background: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", flexDirection: "column",
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{resolveRate}%</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>Resolved</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
              {[
                { label: "Received",  count: received,  color: "#f59e0b" },
                { label: "In Review", count: inReview,  color: "#8b5cf6" },
                { label: "Resolved",  count: resolved,  color: "#22c55e" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, margin: "0 auto 4px" }} />
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* By Priority */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>🚨 Complaints by Priority</div>
          {Object.entries(byPriority).length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No data yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(byPriority).sort((a, b) => b[1] - a[1]).map(([p, count]) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    minWidth: 70, fontSize: 11, fontWeight: 700,
                    textTransform: "capitalize", color: PRIORITY_COLORS[p] || "#6b7280",
                  }}>{p}</span>
                  <div style={{ flex: 1, height: 20, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 6,
                      background: PRIORITY_COLORS[p] || "#6b7280",
                      width: `${Math.round((count / total) * 100)}%`,
                      display: "flex", alignItems: "center", paddingLeft: 8,
                    }}>
                      <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{count}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", minWidth: 20 }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Volunteers */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>🏆 Top Volunteers</div>
          {volStats.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No volunteers yet.</div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {volStats.slice(0, 5).map((v, i) => (
                  <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: i === 0 ? "#fbbf24" : i === 1 ? "#9ca3af" : i === 2 ? "#d97706" : "#e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, color: i < 3 ? "#fff" : "#6b7280",
                    }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{v.assigned} assigned · {v.resolved} resolved</div>
                    </div>
                    <div style={{
                      background: "#dcfce7", color: "#166534",
                      padding: "2px 8px", borderRadius: 9999,
                      fontSize: 11, fontWeight: 700,
                    }}>{v.resolved} ✓</div>
                  </div>
                ))}
              </div>
              {volStats.length > 5 && (
                <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "#9ca3af", borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
                  +{volStats.length - 5} more volunteers · Download Summary PDF for full rankings
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>📋 All Complaints Preview</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Title", "Type", "Priority", "Status", "Reported By", "Date", "Report"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", borderBottom: "2px solid #f3f4f6" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 10).map(c => (
                <tr key={c._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px", color: "#9ca3af", fontFamily: "monospace" }}>#{String(c._id).slice(-6).toUpperCase()}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 500, color: "#111827", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</td>
                  <td style={{ padding: "10px 12px", color: "#374151", textTransform: "capitalize" }}>{c.type || "other"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: PRIORITY_COLORS[c.priority] + "20", color: PRIORITY_COLORS[c.priority] || "#6b7280", padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{c.priority || "medium"}</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: c.status === "resolved" ? "#dcfce7" : c.status === "in_review" ? "#ede9fe" : "#dbeafe", color: c.status === "resolved" ? "#166534" : c.status === "in_review" ? "#5b21b6" : "#1d4ed8", padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{c.status?.replace("_", " ")}</span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{c.user_id?.name || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{new Date(c.created_at || c.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={() => downloadSingleReport(c)}
                      style={{
                        background: "#f0fdf4", color: "#166534",
                        border: "1px solid #bbf7d0", borderRadius: 6,
                        padding: "4px 10px", fontSize: 11, fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >📄 Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length > 10 && (
            <div style={{ textAlign: "center", padding: "12px 0", fontSize: 13, color: "#6b7280" }}>
              Showing 10 of {complaints.length} complaints. Download CSV for full data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Zones Tab ────────────────────────────────────────────────────────────────
function ZonesTab({ zones, setZones, volunteers, complaints }) {
  const [zoneName,     setZoneName]     = useState("");
  const [zoneArea,     setZoneArea]     = useState("");
  const [zoneVolunteer,setZoneVolunteer]= useState("");
  const [editingId,    setEditingId]    = useState(null);
  const [editName,     setEditName]     = useState("");
  const [editArea,     setEditArea]     = useState("");
  const [editVolunteer,setEditVolunteer]= useState("");

  const saveZones = (updated) => {
    setZones(updated);
    localStorage.setItem("cs_zones", JSON.stringify(updated));
  };

  const addZone = () => {
    if (!zoneName.trim() || !zoneArea.trim()) return;
    const newZone = {
      id:          Date.now().toString(),
      name:        zoneName.trim(),
      area:        zoneArea.trim(),
      volunteerId: zoneVolunteer || null,
      createdAt:   new Date().toISOString(),
    };
    saveZones([...zones, newZone]);
    setZoneName(""); setZoneArea(""); setZoneVolunteer("");
  };

  const deleteZone = (id) => saveZones(zones.filter(z => z.id !== id));

  const startEdit = (z) => {
    setEditingId(z.id);
    setEditName(z.name);
    setEditArea(z.area);
    setEditVolunteer(z.volunteerId || "");
  };

  const saveEdit = (id) => {
    saveZones(zones.map(z => z.id === id
      ? { ...z, name: editName, area: editArea, volunteerId: editVolunteer || null }
      : z
    ));
    setEditingId(null);
  };

  const getVolunteerName = (id) => volunteers.find(v => String(v._id) === String(id))?.name || "Unassigned";

  const getZoneComplaintCount = (area) =>
    complaints.filter(c => (c.address || c.location || "").toLowerCase().includes(area.toLowerCase())).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Zone Management</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
          Create and manage geographic zones. Assign volunteers to handle complaints in each zone.
        </p>
      </div>

      {/* Add Zone Form */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>➕ Create New Zone</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Zone Name *</div>
            <input
              value={zoneName}
              onChange={e => setZoneName(e.target.value)}
              placeholder="e.g. North District"
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Area / Keyword *</div>
            <input
              value={zoneArea}
              onChange={e => setZoneArea(e.target.value)}
              placeholder="e.g. Downtown, Elm Street"
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Assign Volunteer</div>
            <select
              value={zoneVolunteer}
              onChange={e => setZoneVolunteer(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}
            >
              <option value="">— None —</option>
              {volunteers.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          </div>
          <button
            onClick={addZone}
            disabled={!zoneName.trim() || !zoneArea.trim()}
            style={{
              background: zoneName.trim() && zoneArea.trim() ? "#2563eb" : "#e5e7eb",
              color: zoneName.trim() && zoneArea.trim() ? "#fff" : "#9ca3af",
              border: "none", borderRadius: 8, padding: "9px 20px",
              fontSize: 13, fontWeight: 600, cursor: zoneName.trim() && zoneArea.trim() ? "pointer" : "not-allowed",
              whiteSpace: "nowrap",
            }}
          >Add Zone</button>
        </div>
      </div>

      {/* Zones List */}
      {zones.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "48px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>No zones created yet</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Create your first zone above to start managing areas.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {zones.map(z => {
            const complaintCount = getZoneComplaintCount(z.area);
            const isEditing = editingId === z.id;
            return (
              <div key={z.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                {/* Card Header */}
                <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "16px 20px" }}>
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, padding: "6px 10px", fontSize: 15, fontWeight: 700, color: "#fff", outline: "none", boxSizing: "border-box" }}
                    />
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>🗺️ {z.name}</div>
                  )}
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                    Created {new Date(z.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "16px 20px" }}>
                  {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>AREA KEYWORD</div>
                        <input
                          value={editArea}
                          onChange={e => setEditArea(e.target.value)}
                          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 6, padding: "7px 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>VOLUNTEER</div>
                        <select
                          value={editVolunteer}
                          onChange={e => setEditVolunteer(e.target.value)}
                          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 6, padding: "7px 10px", fontSize: 13, outline: "none", background: "#fff" }}
                        >
                          <option value="">— None —</option>
                          {volunteers.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => saveEdit(z.id)} style={{ flex: 1, background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "7px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✓ Save</button>
                        <button onClick={() => setEditingId(null)} style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 7, padding: "7px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Area</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{z.area}</div>
                        </div>
                        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Complaints</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>{complaintCount}</div>
                        </div>
                      </div>
                      <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🤝</span>
                        <div>
                          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>Assigned Volunteer</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: z.volunteerId ? "#166534" : "#9ca3af" }}>
                            {z.volunteerId ? getVolunteerName(z.volunteerId) : "Not assigned"}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEdit(z)} style={{ flex: 1, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 7, padding: "7px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✏️ Edit</button>
                        <button onClick={() => deleteZone(z.id)} style={{ flex: 1, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 7, padding: "7px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🗑️ Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const { user, getInitials } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assignSelections, setAssignSelections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zones, setZones] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cs_zones") || "[]"); } catch { return []; }
  });

  const token = localStorage.getItem("token");
  const avatar = user?.name ? getInitials(user.name) : "AD";

  // ── Fetch all data ──────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const raw = Array.isArray(data) ? data : data.complaints || [];
        // Normalize backend fields
        const normalized = raw.map(c => ({
          ...c,
          id: c._id || c.id,
          address: c.address || c.location || "No address",
          type: c.type || c.issueType || "General",
          priority: c.priority || "low",
          status: c.status || "received",
          createdAt: c.created_at || c.createdAt,
        }));
        setComplaints(normalized);
        setLastUpdated(new Date());
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
      setLoading(false);
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
    if (!volunteerId?.trim()) return;
    try {
      await API.put(`/api/complaints/assign/${complaintId}`, { volunteerId });
      // ✅ Clear the selection first so UI resets to "show volunteer name" mode
      setAssignSelections(prev => {
        const updated = { ...prev };
        delete updated[complaintId];
        return updated;
      });
      // ✅ Then re-fetch to get updated data from backend
      await fetchComplaints();
    } catch (err) {
      console.error('Assign failed', err);
    }
  };

  const markResolved = async (complaintId) => {
    try {
      // Backend: PUT /api/complaints/status/:id { status }
      const res = await fetch(`http://localhost:5000/api/complaints/status/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "completed" }),
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

  // ── Stats ───────────────────────────────────────────────────────────────────
  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === "pending" || c.status === "received" || !c.status).length;
  const resolved = complaints.filter(c => c.status === "resolved" || c.status === "completed").length;
  const inProg   = complaints.filter(c => c.status === "in_review" || c.status === "assigned").length;
  const denied = complaints.filter(c => c.status === "denied")

  const filteredComplaints = complaints.filter(c => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSearch =
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const sidebarItems = [
    { key: "overview",   icon: "📊", label: "Overview" },
    { key: "complaints", icon: "📋", label: "Complaints" },
    { key: "users",      icon: "👥", label: "User Management" },
    { key: "volunteers", icon: "🤝", label: "Volunteers" },
    { key: "zones",      icon: "🗺️", label: "Zones" },
    { key: "reports",    icon: "📈", label: "Reports" },
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
                <StatCard icon="⚠️" count={total} label="Total Complaints" accent="#3b82f6" />
                <StatCard icon="⏳" count={pending} label="Pending" accent="#f59e0b" />
                <StatCard icon="🔄" count={inProg} label="In Progress" accent="#8b5cf6" />
                <StatCard icon="✅" count={resolved} label="Resolved" accent="#22c55e" />
              </div>

              <div className="cs-card">
                <div className="cs-section-header" style={{ marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Recent Complaints</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Latest submissions from citizens</div>
                  </div>
                  <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => setActiveTab("complaints")}>View All →</button>
                </div>
                {loading ? (
                  <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                    <div style={{ fontSize: 15 }}>Loading complaints…</div>
                  </div>
                ) : complaints.length === 0 ? (
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
                    { key: "all", label: "All", count: total },
                    { key: "received", label: "Pending", count: pending },
                    { key: "in_review", label: "In Progress", count: inProg },
                    { key: "denied", label: "⚠️ Denied", count: denied },
                    { key: "resolved", label: "Resolved", count: resolved },
                  ].map(f => (
                    <button key={f.key}
                      className={`cs-filter-tab${statusFilter === f.key ? " cs-filter-tab--active" : ""}`}
                      onClick={() => setStatusFilter(f.key)}>
                      {f.label}<span className="cs-filter-tab__count">{f.count}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input className="cs-input cs-search-input"
                    placeholder="🔍 Search complaints..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)} />
                  <button onClick={fetchComplaints} title="Refresh" style={{
                    background: "#f4f6fb", border: "1px solid #e5e9f2", borderRadius: 8,
                    padding: "7px 10px", cursor: "pointer", fontSize: 14, color: "#64748b", flexShrink: 0
                  }}>🔄</button>
                </div>
              </div>
              {lastUpdated && (
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                  🟢 Last updated · {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}

              {loading ? (
                <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                  <div style={{ fontSize: 15 }}>Loading complaints…</div>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="cs-empty">
                  <div className="cs-empty__icon">📭</div>
                  <div className="cs-empty__title">No complaints found</div>
                  <div className="cs-empty__desc">Try adjusting your search or filter.</div>
                </div>
              ) : (
                <div className="cs-card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
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
                          <TD style={{ color: "#374151" }}>{c.user_id?.name || c.reportedBy?.name || "—"}</TD>
                          <TD><StatusBadge status={c.status} /></TD>
                          <TD>
                            {(c.status === "completed") ? (
                              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                                ✅ {c.assigned_to?.name || c.assigned_to || "—"}
                              </div>
                            ) : c.status === "denied" ? (
                              // Show denied volunteer with strikethrough + reassign dropdown
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ fontSize: 12, color: "#dc2626", textDecoration: "line-through", fontWeight: 500 }}>
                                  ❌ {c.assigned_to?.name || c.assigned_to || "—"}
                                </div>
                                <select
                                  className="cs-input"
                                  style={{ padding: "5px 8px", fontSize: 12, minWidth: 140 }}
                                  value={assignSelections[c._id || c.id] || ""}
                                  onChange={e => setAssignSelections(prev => ({ ...prev, [c._id || c.id]: e.target.value }))}
                                >
                                  <option value="">— Reassign Volunteer —</option>
                                  {volunteers.map(v => {
                                    const isDenied = (c.assigned_to?._id || c.assigned_to) === v._id;
                                    return (
                                      <option key={v._id} value={v._id} disabled={isDenied}
                                        style={{ textDecoration: isDenied ? "line-through" : "none", color: isDenied ? "#9ca3af" : "inherit" }}>
                                        {isDenied ? `❌ ${v.name} (denied)` : v.name}
                                      </option>
                                    );
                                  })}
                                  
                                </select>
                              </div>
                            ) : c.assigned_to && !assignSelections[c._id || c.id] ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>
                                  👤 {c.assigned_to?.name || c.assigned_to}
                                </div>
                                <button
                                  className="cs-btn cs-btn--outline cs-btn--sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => setAssignSelections(prev => ({ ...prev, [c._id || c.id]: " " }))}
                                >🔄 Change</button>
                              </div>
                            ) : (
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
                            )}
                          </TD>
                          <TD>
                            <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                              {c.status === "completed" ? (
                                <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✅ Completed</span>
                              ) : c.status === "resolved" ? (
                                // Volunteer marked resolved — admin must approve
                                <button
                                  onClick={() => markResolved(c._id || c.id)}
                                  style={{
                                    background: "#16a34a", color: "#fff", border: "none",
                                    borderRadius: 8, padding: "6px 14px", fontSize: 12,
                                    fontWeight: 700, cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(22,163,74,0.3)"
                                  }}>
                                  ✅ Approve
                                </button>
                              ) : c.status === "denied" ? (
                                // Volunteer denied — admin must reassign
                                <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                                  <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>⚠️ Denied — Reassign</span>
                                  {(!c.assigned_to || assignSelections[c._id || c.id]) && (
                                    <button
                                      className="cs-btn cs-btn--outline cs-btn--sm"
                                      style={{ fontSize: 11 }}
                                      onClick={() => assignVolunteer(c._id || c.id)}
                                      disabled={!assignSelections[c._id || c.id]?.trim()}
                                    >Assign</button>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {(!c.assigned_to || assignSelections[c._id || c.id]) && (
                                    <button
                                      className="cs-btn cs-btn--outline cs-btn--sm"
                                      style={{ fontSize: 11 }}
                                      onClick={() => assignVolunteer(c._id || c.id)}
                                      disabled={!assignSelections[c._id || c.id]?.trim()}
                                    >Assign</button>
                                  )}
                                </>
                              )}
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
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
                  <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
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
                            }}>{u.role === "user" ? "user" : u.role || "user"}</span>
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
                              {u.role !== "user" && u.role !== "user" && u.role !== "admin" && (
                                <button
                                  className="cs-btn cs-btn--outline cs-btn--sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => changeUserRole(u._id, "user")}
                                >Make Citizen</button>
                              )}
                            </div>
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
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
                    const assigned = complaints.filter(c => {
                      const id = c.assigned_to?._id || c.assigned_to;
                      return String(id) === String(v._id);
                    }).length;

                    const resolved = complaints.filter(c => {
                      const id = c.assigned_to?._id || c.assigned_to;
                      return String(id) === String(v._id) && c.status === "resolved";
                    }).length;
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
                          onClick={() => changeUserRole(v._id, "user")}
                        >Remove Volunteer</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ REPORTS TAB ══ */}
          {activeTab === "zones" && (
            <ZonesTab zones={zones} setZones={setZones} volunteers={volunteers} complaints={complaints} />
          )}

          {activeTab === "reports" && (
            <ReportsTab complaints={complaints} users={users} volunteers={volunteers} />
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;