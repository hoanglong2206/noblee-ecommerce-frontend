"use client";

import { Separator } from "@/components/ui/separator";
import { CarouselServices, Logo } from "@/components/app/home";
import {
	ArrowUpRight,
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Twitter,
	Youtube,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
	const footerItem: { title: string; links: string[] }[] = [
		{
			title: "Company",
			links: [
				"About us",
				"Careers",
				"Blogs",
				"Contact us",
				"Privacy Policy",
			],
		},
		{
			title: "Products",
			links: ["Women", "Men", "Shoes", "Accessories", "New Arrivals"],
		},
	];

	return (
		<>
			{/* Serivce */}
			<div className="py-8 bg-muted/30">
				<div className="container mx-auto px-20 xl:px-0">
					<CarouselServices />
				</div>
			</div>
			{/* Footer */}
			<div className="pt-8 pb-4 px-4 bg-muted/80">
				<div className="container mx-auto flex flex-col xl:flex-row items-center gap-8 xl:gap-24">
					<div className="flex flex-col items-start gap-3 w-full xl:w-auto">
						<Logo />
						<div className="space-y-1 mt-2">
							<div className="flex items-center gap-1">
								<MapPin size={18} />
								<span className="font-medium">Address:</span> Ho
								Chi Minh city, Viet Nam
							</div>
							<div className="flex items-center gap-1">
								<Phone size={18} />
								<span className="font-medium">Phone:</span>{" "}
								(+84) 868 332 623
							</div>
							<div className="flex items-center gap-1">
								<Mail size={18} />
								<span className="font-medium">Email:</span>
								hello@noblee.com
							</div>
						</div>
						<div className="flex gap-4 mt-1">
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
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 w-full">
						{footerItem.map((item) => (
							<div key={item.title} className="space-y-2">
								<h3 className="font-bold uppercase text-lg mb-4">
									{item.title}
								</h3>
								<div className="flex flex-col">
									{item.links.map((link) => (
										<Link
											key={link}
											href="#"
											className="hover:text-primary transition-colors text-base w-fit font-medium text-muted-foreground"
										>
											{link}
										</Link>
									))}
								</div>
							</div>
						))}

						<div className="space-y-2">
							<h3 className="font-bold uppercase text-lg ">
								Sign Up for Email
							</h3>
							<p className="text-muted-foreground text-sm font-medium">
								Sign up to get first dibs on new arrivals,
								sales, exclusive content, events and more!
							</p>
							<div className="flex py-1 px-1.5 border rounded-md">
								<Input
									placeholder="Enter email address"
									className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
								/>
								<Button className="bg-foreground hover:bg-foreground/80">
									Subscribe{" "}
									<ArrowUpRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="container mx-auto w-full flex flex-col">
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
							{[
								"/paypal.png",
								"/mastercard.png",
								"/visa.png",
							].map((pay) => (
								<Image
									src={pay}
									alt={pay}
									width={40}
									height={40}
									key={pay}
									className="cursor-pointer"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
