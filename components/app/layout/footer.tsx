"use client";

import { Separator } from "@/components/ui/separator";
import { Logo } from "../home";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
	const footerItem: { title: string; links: string[] }[] = [
		{
			title: "Company",
			links: ["About us", "Careers", "Blogs", "Contact us"],
		},
		{
			title: "Products",
			links: ["About us", "Careers", "Blogs", "Contact us"],
		},
		{
			title: "Policies",
			links: ["About us", "Careers", "Blogs", "Contact us"],
		},
	];
	return (
		<div className="pt-8 pb-4 px-4 bg-muted/20">
			<div className="container mx-auto flex flex-col xl:flex-row items-center max-w-7xl gap-8 xl:gap-24">
				<div className="flex flex-col items-start gap-3 w-full xl:w-auto">
					<Logo />
					<div className="space-y-1">
						<p>Address: Ho Chi Minh city, Viet Nam</p>
						<p>Phone: +84868332623</p>
						<p>Email: hello@noblee.com</p>
					</div>
					<div className="flex gap-4">
						<Link
							href="#"
							className="hover:scale-110 transition-transform"
						>
							<Facebook size={20} />
						</Link>
						<Link
							href="#"
							className="hover:scale-110 transition-transform"
						>
							<Twitter size={20} />
						</Link>
						<Link
							href="#"
							className="hover:scale-110 transition-transform"
						>
							<Youtube size={20} />
						</Link>
						<Link
							href="#"
							className="hover:scale-110 transition-transform"
						>
							<Instagram size={20} />
						</Link>
					</div>
				</div>
				<div className="grid grid-cols-1 xl:grid-cols-4 gap-4 flex-1 w-full">
					{footerItem.map((item) => (
						<div key={item.title} className="space-y-2">
							<h3 className="font-bold uppercase text-lg">
								{item.title}
							</h3>
							<div className="flex flex-col">
								{item.links.map((link) => (
									<Link
										key={link}
										href="#"
										className="hover:text-primary transition-colors text-base w-fit"
									>
										{link}
									</Link>
								))}
							</div>
						</div>
					))}

					<div className="space-y-2">
						<h3 className="font-bold uppercase text-lg">
							Download APP
						</h3>
						<Image
							src="/qrcode.png"
							alt="qrcode"
							width={100}
							height={100}
						/>
					</div>
				</div>
			</div>
			<div className="container mx-auto w-full flex flex-col max-w-7xl">
				<Separator
					orientation="horizontal"
					className="my-2 opacity-50"
				/>
				<div className="flex flex-col xl:flex-row gap-2 items-center justify-between">
					<div>
						&copy; {new Date().getFullYear()} Demo App, Inc. All
						rights reserved.
					</div>
					<div className="flex gap-2">
						{["/paypal.png", "/mastercard.png", "/visa.png"].map(
							(pay) => (
								<Image
									src={pay}
									alt={pay}
									width={40}
									height={40}
									key={pay}
									className="cursor-pointer"
								/>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
