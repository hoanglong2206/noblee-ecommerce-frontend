export type AuthRole = "admin" | "staff" | "user";

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresIn: string;
	refreshTokenExpiresIn: string;
}

export interface AuthUser {
	id: string;
	fullname: string;
	email: string;
	role: AuthRole;
	isVerified: boolean;
	isDisabled: boolean;
	tokenVersion: number;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: AuthUser;
	tokens: AuthTokens;
}

export interface SendOtpPayload {
	email: string;
}

export interface SendOtpResponse {
	message: string;
	expiresIn: number;
}

export interface VerifyOtpPayload {
	email: string;
	otp: string;
}

export interface VerifyOtpResponse {
	message: string;
}

export interface RegisterPayload {
	fullname: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RefreshTokenPayload {
	refreshToken?: string;
}

export interface LogoutResponse {
	message: string;
}

export interface UpdateRolePayload {
	targetUserId: string;
	role: AuthRole;
}

export interface SetAccountDisabledPayload {
	targetUserId: string;
	disabled: boolean;
}
