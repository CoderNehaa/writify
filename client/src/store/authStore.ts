import { logOutService } from "@/api/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  handleLogout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      handleLogout: async () => {
        localStorage.clear();
        sessionStorage.clear();
        set({ currentUser: null });
        window.location.href = "/";
        await logOutService();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
export default useAuthStore;
