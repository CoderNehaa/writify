import { logOutService } from "@/api/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  handleLogout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
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
    }
  )
);
export default useAuthStore;
