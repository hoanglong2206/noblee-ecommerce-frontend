export type UserGender = "male" | "female" | "other" | "prefer_not_to_say";

export type AddressType = "shipping" | "billing";

export interface UserProfile {
	id: string;
	fullName: string;
	email: string;
	phoneNumber: string | null;
	gender: UserGender | null;
	dateOfBirth: string | null;
	avatarUrl: string | null;
	bio: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateUserProfileInput {
	fullname?: string;
	phoneNumber?: string | null;
	gender?: UserGender | null;
	dateOfBirth?: string | null;
	bio?: string | null;
}

export interface UpdateAvatarInput {
	file: string;
	publicId?: string;
	overwrite?: boolean;
	invalidate?: boolean;
}

export interface UpdateAvatarResult {
	avatarUrl: string;
	publicId?: string;
}

export interface UserAddress {
	id: string;
	userId: string;
	addressType: AddressType;
	fullName: string;
	phoneNumber: string | null;
	streetLine1: string;
	streetLine2: string | null;
	city: string;
	district: string | null;
	ward: string | null;
	postalCode: string | null;
	country: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAddressInput {
	recipientName: string;
	streetLine1: string;
	streetLine2?: string | null;
	city: string;
	district?: string | null;
	state?: string | null;
	ward?: string | null;
	postalCode?: string | null;
	country: string;
	phoneNumber?: string | null;
	label?: string | null;
	addressType?: AddressType;
	isDefault?: boolean;
}

export interface UpdateAddressInput {
	recipientName?: string;
	streetLine1?: string;
	streetLine2?: string | null;
	city?: string;
	district?: string | null;
	state?: string | null;
	ward?: string | null;
	postalCode?: string | null;
	country?: string;
	phoneNumber?: string | null;
	label?: string | null;
	addressType?: AddressType;
	isDefault?: boolean;
}

export interface UpdateAddressVariables {
	addressId: string;
	input: UpdateAddressInput;
}

export interface DeleteAddressInput {
	addressId: string;
}

export interface SetDefaultAddressInput {
	addressId: string;
}
