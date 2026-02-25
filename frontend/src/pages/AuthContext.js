import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // On login, call setUser({ name, username, email, phone, location, bio, role, avatar })
  // We persist to localStorage so refresh doesn't log them out
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cs_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    const enriched = {
      name: userData.name || userData.fullName || 'User',
      username: userData.username || userData.email?.split('@')[0] || 'user',
      email: userData.email || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.bio || '',
      role: userData.role || 'Citizen',
      avatar: userData.avatar || null,
      memberSince: userData.memberSince || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    setUser(enriched);
    localStorage.setItem('cs_user', JSON.stringify(enriched));
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('cs_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cs_user');
  };

  // Helper: get initials for avatar circle
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;