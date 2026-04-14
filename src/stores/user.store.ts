import { create } from "zustand";
import { Database } from "@/types/database.types";
import { persist } from "zustand/middleware";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface UserState {
  user: ProfileRow | null;
  setUser: (user: ProfileRow | null) => void;
  updateUser: (data: Partial<ProfileRow>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user",
    },
  ),
);
