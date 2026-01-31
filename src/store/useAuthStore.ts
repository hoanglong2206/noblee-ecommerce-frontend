import { create } from "zustand";
import type { AuthUser } from "@/features/auth/type";

interface AuthState {
	user: AuthUser | null;
	isHydrated: boolean;
	setUser: (user: AuthUser) => void;
	clearUser: () => void;
	markHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isHydrated: false,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
	markHydrated: () => set({ isHydrated: true }),
}));
