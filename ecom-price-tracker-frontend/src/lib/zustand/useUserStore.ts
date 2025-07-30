import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  discordId: string;
  name: string;
  email: string;
  avatar?: string;
  exp?: string; // store as string if coming from JSON
  lastLogin?: string;
  _id?: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
