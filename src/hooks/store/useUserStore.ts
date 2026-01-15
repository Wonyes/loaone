import { create } from "zustand";

interface User {
  discordId: string;
  username: string;
  globalName: string;
  avatar: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({ user }),
}));
