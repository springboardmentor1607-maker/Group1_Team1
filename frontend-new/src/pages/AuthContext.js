import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // Keep axios Authorization header in sync
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // After login, fetch full profile so username/phone/location/bio are loaded
  const fetchFullProfile = async (tok) => {
    try {
      const authToken = tok || token;
      if (!authToken) return;
      API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      const res = await API.get("/api/users/me");
      const full = res.data;
      setUser(prev => {
        const merged = { ...prev, ...full };
        localStorage.setItem("user", JSON.stringify(merged));
        return merged;
      });
    } catch {
      // /api/users/me might not exist — silently ignore, profile still works
    }
  };

  const login = (userData, authToken) => {
    // Support both login(userData, token) and login({ token, ...user })
    const tok = authToken || userData?.token;
    const u   = authToken ? userData : { ...userData, token: undefined };

    setUser(u);
    setToken(tok);
    localStorage.setItem("user",  JSON.stringify(u));
    localStorage.setItem("token", tok);
    if (tok) API.defaults.headers.common["Authorization"] = `Bearer ${tok}`;

    // Fetch full profile in background to get username, phone, location, bio
    fetchFullProfile(tok);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  };

  // Merges partial updates into user — call AFTER a successful API save
  const updateUser = (fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "??";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, getInitials, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
