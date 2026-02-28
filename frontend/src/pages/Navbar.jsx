import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function CleanStreetLogo({ size = 44 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="skyGradNB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" /><stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>
        <linearGradient id="grassGradNB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
        <linearGradient id="roadGradNB" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909c" /><stop offset="100%" stopColor="#546e7a" />
        </linearGradient>
        <clipPath id="circleClipNB"><circle cx="100" cy="100" r="86" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="98" fill="white" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#4caf50" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#4caf50" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="url(#skyGradNB)" />
      <g clipPath="url(#circleClipNB)">
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
        <path d="M13,148 Q50,110 100,120 Q150,110 187,148 L187,190 L13,190 Z" fill="url(#grassGradNB)" />
        <path d="M86,190 Q91,150 100,120 Q109,150 114,190 Z" fill="url(#roadGradNB)" />
        <line x1="100" y1="178" x2="100" y2="170" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="100" y1="165" x2="100" y2="155" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="48" cy="130" r="10" fill="#2e7d32" /><circle cx="42" cy="136" r="9" fill="#43a047" />
        <circle cx="54" cy="136" r="9" fill="#43a047" /><rect x="47" y="142" width="3" height="7" fill="#5d4037" />
        <circle cx="152" cy="130" r="10" fill="#2e7d32" /><circle cx="146" cy="136" r="9" fill="#43a047" />
        <circle cx="158" cy="136" r="9" fill="#43a047" /><rect x="151" y="142" width="3" height="7" fill="#5d4037" />
      </g>
      <circle cx="100" cy="100" r="87" fill="none" stroke="#4caf50" strokeWidth="3" />
      <path id="csTextArcNB" d="M 26,100 A 74,74 0 0,1 174,100" fill="none" />
      <text fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#2e7d32" letterSpacing="2.5">
        <textPath href="#csTextArcNB" startOffset="7%">CLEAN STREETS</textPath>
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

// ─── Nav links per role ───────────────────────────────────────────────────────
const NAV_LINKS = {
  citizen: [
    { label: "Dashboard",       path: "/dashboard"        },
    { label: "Report Issue",    path: "/submit-complaint" },
    { label: "View Complaints", path: "/complaints"       },
    { label: "Issue Map",       path: "/map"              },
  ],
  volunteer: [
    { label: "Dashboard",       path: "/volunteer"             },
    { label: "Issue Map",       path: "/map"                   },
    { label: "View Complaints", path: "/complaints"            },
  ],
  admin: [
    { label: "Admin Panel",     path: "/admin"      },
    { label: "Issue Map",       path: "/map"        },
    { label: "User Dashboard",  path: "/dashboard"  },
  ],
};

// ─── Shared Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getInitials } = useAuth();

  const role   = user?.role?.toLowerCase() || "citizen";
  const links  = NAV_LINKS[role] || NAV_LINKS.citizen;
  const avatar = user?.name ? getInitials(user.name) : "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Exact match only — prevents two links being active at once
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="cs-navbar">
      <div className="cs-navbar__brand">
        <CleanStreetLogo size={42} />
        <span className="cs-navbar__name">CleanStreet</span>
        {role === "admin" && (
          <span style={{
            background: "#1e3a8a", color: "#93c5fd",
            fontSize: 11, fontWeight: 700, padding: "2px 8px",
            borderRadius: 9999, letterSpacing: 0.5, marginLeft: 4,
          }}>ADMIN</span>
        )}
        {role === "volunteer" && (
          <span style={{
            background: "#14532d", color: "#86efac",
            fontSize: 11, fontWeight: 700, padding: "2px 8px",
            borderRadius: 9999, letterSpacing: 0.5, marginLeft: 4,
          }}>VOLUNTEER</span>
        )}
      </div>

      <div className="cs-navbar__links">
        {links.map(item => (
          <span
            key={item.label}
            className={`cs-navbar__link${isActive(item.path) ? " cs-navbar__link--active" : ""}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </span>
        ))}
      </div>

      <div className="cs-navbar__actions">
        {user ? (
          <button
            className="cs-btn cs-btn--outline cs-btn--sm"
            onClick={handleLogout}
            style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}
          >
            Logout
          </button>
        ) : (
          <>
            <button className="cs-btn cs-btn--outline cs-btn--sm" onClick={() => navigate("/login")}>Login</button>
            <button className="cs-btn--register" onClick={() => navigate("/signup")}>Register</button>
          </>
        )}
        <div
          className="cs-avatar"
          onClick={() => navigate("/profile")}
          title="My Profile"
          style={{ cursor: "pointer" }}
        >
          {avatar}
        </div>
      </div>
    </nav>
  );
}