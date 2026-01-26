"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
	return (
		<Link href="/">
			<div className="hover:opacity-75 transition items-center justify-start gap-x-2 flex">
				<Image
					src="/logoo.png"
					alt="Logo"
					width={36}
					height={36}
					priority
				/>
				<p className="text-xl font-medium">Demo</p>
			</div>
		</Link>
	);
};
