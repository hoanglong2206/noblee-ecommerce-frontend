import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const lowerCase = (str: string): string => {
	return str.toLowerCase();
};

export const replaceSpacesWithDash = (title: string): string => {
	const lowercaseTitle: string = lowerCase(`${title}`);
	return lowercaseTitle.replace(/\/| /g, "-"); // replace / and space with -
};

export const replaceDashWithSpaces = (title: string): string => {
	const lowercaseTitle: string = lowerCase(`${title}`);
	return lowercaseTitle.replace(/-|\/| /g, " "); // replace - / and space with -
};

export const saveToLocalStorage = (key: string, data: string): void => {
	window.localStorage.setItem(key, data);
};

export const getDataFromLocalStorage = (key: string) => {
	const data = window.localStorage.getItem(key) as string;
	return JSON.parse(data);
};

export const deleteFromLocalStorage = (key: string): void => {
	window.localStorage.removeItem(key);
};

export const generateRandomNumber = (length: number): number => {
	return (
		Math.floor(Math.random() * (9 * Math.pow(10, length - 1))) +
		Math.pow(10, length - 1)
	);
};

export const bytesToSize = (bytes: number): string => {
	const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) {
		return "n/a";
	}
	const i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10);
	if (i === 0) {
		return `${bytes} ${sizes[i]}`;
	}
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const stringToColor = (value: string): string => {
	let hash = 0;
	for (let i = 0; i < value.length; i++) {
		hash = value.charCodeAt(i) + ((hash << 5) - hash);
	}

	const hue = Math.abs(hash) % 360; // 0 - 359
	const saturation = 65; // %
	const lightness = 65; // % (màu sáng)

	return hslToHex(hue, saturation, lightness);
};

const hslToHex = (h: number, s: number, l: number): string => {
	s /= 100;
	l /= 100;

	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

	const r = Math.round(255 * f(0));
	const g = Math.round(255 * f(8));
	const b = Math.round(255 * f(4));

	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
