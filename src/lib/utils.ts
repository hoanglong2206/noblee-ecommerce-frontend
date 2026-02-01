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
