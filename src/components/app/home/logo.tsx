"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOptionalSidebar } from "@/components/ui/sidebar";

export const Logo = () => {
	const sidebar = useOptionalSidebar();
	const isCollapsed = sidebar?.state === "collapsed";

	return (
		<Link
			href="/"
			className="flex items-center overflow-hidden transition-opacity hover:opacity-75"
		>
			<div className="items-center justify-start flex">
				<Image src="/logoo.png" alt="Logo" width={40} height={40} priority />
			</div>
			<motion.span
				initial={false}
				animate={{
					maxWidth: isCollapsed ? 0 : 120,
					opacity: isCollapsed ? 0 : 1,
					marginLeft: isCollapsed ? 0 : 8,
				}}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="text-xl font-medium whitespace-nowrap overflow-hidden inline-block"
			>
				<span className="text-primary">NOBLEE</span> APP
			</motion.span>
		</Link>
	);
};
