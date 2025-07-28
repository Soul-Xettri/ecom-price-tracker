import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  setUser: (user: UserState["user"]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  user: null,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));
