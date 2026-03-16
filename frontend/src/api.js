import axios from "axios";

const API = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Attach JWT token to every request automatically ─────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Handle 401 globally (token expired / invalid) ───────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes("/login") && 
          !window.location.pathname.includes("/signup")) {
        localStorage.removeItem("token");
        localStorage.removeItem("cs_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
