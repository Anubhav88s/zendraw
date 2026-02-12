import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface AuthState {
  // Auth state
  token: string | null;
  userName: string | null;

  // Form state
  email: string;
  password: string;
  name: string;
  error: string;
  loading: boolean;

  // Form actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  setError: (error: string) => void;
  clearForm: () => void;

  // Auth actions
  signin: () => Promise<boolean>;
  signup: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist( (set, get) => ({
      // Auth state
      token: null,
      userName: null,

      // Form state
      email: "",
      password: "",
      name: "",
      error: "",
      loading: false,

      // Form actions
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setName: (name) => set({ name }),
      setError: (error) => set({ error }),
      clearForm: () =>
        set({ email: "", password: "", name: "", error: "", loading: false }),

      // Auth actions
      signin: async () => {
        const { email, password } = get();
        set({ error: "", loading: true });

        try {
          const response = await axios.post(`${API_URL}/signin`, {
            username: email,
            password,
          });

          if (response.data.token) {
            set({
              token: response.data.token,
              userName: email,
              loading: false,
              email: "",
              password: "",
            });
            return true;
          } else {
            set({
              error: response.data.message || "Failed to sign in",
              loading: false,
            });
            return false;
          }
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message ||
            "Something went wrong. Please try again.";
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      signup: async () => {
        const { email, password, name } = get();
        set({ error: "", loading: true });

        try {
          const response = await axios.post(`${API_URL}/signup`, {
            name,
            username: email,
            password,
          });

          if (response.data.userId) {
            set({ loading: false, email: "", password: "", name: "" });
            return true;
          } else {
            set({ loading: false });
            return true; // Still redirect to signin
          }
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message ||
            "Something went wrong. Please try again.";
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      logout: () => set({ token: null, userName: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, userName: state.userName }), // Only persist auth state, not form state
    },
  ),
);
