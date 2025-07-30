import Cookies from "js-cookie";
import { create } from "zustand";

// Define types for your Zustand store
interface AuthState {
  accessToken: string | null;
  setTokens: (accessToken: string) => void;
  logout: () => void;
}

// Create the Zustand store
const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null,

  // Method to set new tokens
  setTokens: (accessToken: string) => {
    Cookies.set("accessToken", accessToken, {
      secure: true,
      sameSite: "Strict",
    });
    set({ accessToken });
  },

  // Logout method to clear tokens
  logout: () => {
    Cookies.remove("accessToken");
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.clear();
    }
    set({ accessToken: null });
  },
}));

export default useAuthStore;
