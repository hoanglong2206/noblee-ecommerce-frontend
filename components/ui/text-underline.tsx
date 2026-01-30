import * as React from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<Size, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
	xl: "text-xl",
};

type TextUnderlineProps<T extends React.ElementType> = {
	as?: T;
	size?: Size;
	className?: string;
	children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export function TextUnderline<T extends React.ElementType = "span">({
	as,
	size = "md",
	className,
	children,
	...props
}: TextUnderlineProps<T>) {
	const Component = as || "span";

	return (
		<Component
			className={cn(
				"relative cursor-pointer after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:after:origin-left",
				sizeMap[size],
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
