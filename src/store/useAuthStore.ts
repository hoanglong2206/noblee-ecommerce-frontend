import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
	accessToken: string | null;
	accessTokenExpiresIn: number | null;
	isAuthenticated: boolean;
	isTokenExpired: () => boolean;
	login: (accessToken: string, accessTokenExpiresIn: number | string) => void;
	checkAuth: () => Promise<void>;
	logout: () => void;
};

const initialAuthState = {
	accessToken: null,
	accessTokenExpiresIn: null,
	isAuthenticated: false,
};

const durationToMilliseconds = (expiresIn: number | string): number | null => {
	if (typeof expiresIn === "number") {
		if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
			return null;
		}
		if (expiresIn > 1e12) {
			return Math.floor(expiresIn);
		}
		return Date.now() + Math.floor(expiresIn * 1000);
	}
	const match = expiresIn.trim().match(/^([0-9]+)(ms|s|m|h|d)$/i);
	if (!match) {
		return null;
	}
	const value = Number(match[1]);
	if (!Number.isFinite(value) || value <= 0) {
		return null;
	}
	const unit = match[2].toLowerCase();
	switch (unit) {
		case "ms":
			return Date.now() + Math.floor(value);
		case "s":
			return Date.now() + Math.floor(value * 1000);
		case "m":
			return Date.now() + Math.floor(value * 60 * 1000);
		case "h":
			return Date.now() + Math.floor(value * 60 * 60 * 1000);
		case "d":
			return Date.now() + Math.floor(value * 24 * 60 * 60 * 1000);
		default:
			return null;
	}
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			...initialAuthState,
			login: (accessToken: string, accessTokenExpiresIn: number | string) => {
				const expiresAt = durationToMilliseconds(accessTokenExpiresIn);
				if (!accessToken || !expiresAt) {
					set({ ...initialAuthState });
					return;
				}
				set({
					accessToken,
					accessTokenExpiresIn: expiresAt,
					isAuthenticated: true,
				});
			},
			checkAuth: async () => {
				const { accessToken } = get();
				if (!accessToken || get().isTokenExpired()) {
					set({ ...initialAuthState });
					return;
				}
				set({ isAuthenticated: true });
			},
			logout: () => {
				set({ ...initialAuthState });
			},
			isTokenExpired: () => {
				const expiresAt = get().accessTokenExpiresIn;
				if (!expiresAt) {
					return true;
				}
				return Date.now() >= expiresAt;
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				accessToken: state.accessToken,
				accessTokenExpiresIn: state.accessTokenExpiresIn,
				isAuthenticated: state.isAuthenticated,
			}),
			storage: createJSONStorage(() => localStorage),
		},
	),
);
