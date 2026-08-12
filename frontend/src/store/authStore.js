// frontend/src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── STATE ──
      user: null,
      token: null,

      // ── ACTIONS ──
      setAuth: (user, token) => {
        set({ user, token });
        localStorage.setItem("token", token);
      },

      clearAuth: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
      },

      updateUser: (updatedUser) => {
        set({ user: updatedUser });
      },

      // ── GETTERS ──
      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === "ADMIN",
      isPartner: () => get().user?.role === "PARTNER",
      isAlumni: () => get().user?.role === "ALUMNI",
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;
