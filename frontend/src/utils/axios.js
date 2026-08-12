// frontend/src/utils/axios.js
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 15000,
});

// Helper: ambil token dari Zustand persist storage
function getToken() {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token || null;
    }
  } catch {
    return null;
  }
  return null;
}

// Request interceptor: tambah token di setiap request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("Kamu tidak punya akses ke halaman ini");
    } else if (status >= 500) {
      toast.error("Server sedang bermasalah. Coba lagi nanti.");
    }
    return Promise.reject(error);
  },
);

export default api;
