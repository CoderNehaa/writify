import { logOutService } from "@/api/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  currentUser: IUser | null;
  // True until the one app-load session-hydration fetch (in App.tsx)
  // resolves — lets ProtectedRoute distinguish "still checking" from
  // "checked, not logged in" without running its own fetch.
  isInitializing: boolean;
  setCurrentUser: (user: IUser | null) => void;
  setIsInitializing: (isInitializing: boolean) => void;
  handleLogout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isInitializing: true,
      setCurrentUser: (user) => set({ currentUser: user }),
      setIsInitializing: (isInitializing) => set({ isInitializing }),
      handleLogout: async () => {
        try {
          await logOutService();
        } catch {
          // Still clear the local session if the API call fails
        }
        localStorage.clear();
        sessionStorage.clear();
        set({ currentUser: null });
        window.location.href = "/";
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      // isInitializing must always start `true` on a fresh page load —
      // never restored from a previous session.
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
export default useAuthStore;
