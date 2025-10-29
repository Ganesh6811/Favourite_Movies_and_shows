import { create } from "zustand";
import axios from "axios";
import baseUrl from "../config.tsx";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  id:number,
  name: string;
  email: string;
  fetchUser: () => Promise<void>;
  logOut: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  name: "",
  id:0,
  email: "",

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get(`${baseUrl}/auth/checkAuth`, {
        withCredentials: true,
      });

      const { name, email, id } = data;
      set({
        name,
        email,
        id,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.log("Error while fetching the data");
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  logOut: async () => {
    set({
      isAuthenticated: false,
      isLoading: false,
      name: "",
      email: "",
      id:0,
    });
  },
}));

export default useAuthStore;
