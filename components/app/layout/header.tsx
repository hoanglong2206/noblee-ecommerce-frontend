"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
	X,
	SearchIcon,
	Mail,
	Facebook,
	Youtube,
	Instagram,
	Twitter,
	Bell,
	Heart,
	ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/app/home";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const Header = () => {
	const [showBanner, setShowBanner] = useState<boolean>(true);
	const [lang, setLang] = useState<string>("en");
	const pathName = usePathname();

	const handleCloseBanner = () => {
		setShowBanner(false);

		setTimeout(() => {
			setShowBanner(true);
		}, 60000);
	};
	return (
		<>
			<AnimatePresence>
				{showBanner && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-muted/50 relative hidden xl:flex"
					>
						<div className="container px-4 py-3 flex items-center justify-between w-full mx-auto max-w-7xl">
							<div className="flex items-center gap-2 h-4">
								<div className="flex items-center gap-2 text-foreground">
									<Mail className="h-4 w-4" />
									<p className="text-sm">hello@noblee.com</p>
								</div>
								<Separator orientation="vertical" />
								<p className="text-sm text-foreground">
									Free Shipping for all orders over $100
								</p>
							</div>
							<div className="flex items-center gap-4 h-4">
								<div className="flex items-center gap-4 text-foreground">
									<Facebook className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
									<Youtube className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
									<Instagram className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
									<Twitter className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
								</div>
								<Separator orientation="vertical" />
								{/* Button Lang */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											size={"icon"}
											variant={"ghost"}
											className="hover:bg-transparent focus-visible:ring-0"
										>
											<Image
												src={
													lang === "en"
														? "/flag-english.png"
														: "/flag-vietnamese.png"
												}
												alt="lang"
												width={24}
												height={24}
												className="hover:rotate-360 transition-transform"
											/>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										<DropdownMenuItem
											onClick={() => setLang("en")}
										>
											<Image
												src="/flag-english.png"
												alt="lang"
												width={20}
												height={20}
											/>
											<span className="ml-2">
												English
											</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => setLang("vi")}
										>
											<Image
												src="/flag-vietnamese.png"
												alt="lang"
												width={20}
												height={20}
											/>
											<span className="ml-2">
												Vietnamese
											</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<Button
							onClick={handleCloseBanner}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-muted/50 hover:bg-transparent text-foreground opacity-50 hover:opacity-80 transition-opacity"
						>
							<X className="h-4 w-4" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Header */}
			<header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur shadow-sm">
				<div className="container flex h-16 items-center justify-between mx-auto max-w-7xl">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-2"
					>
						<Logo />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="xl:flex items-center gap-12 hidden"
					>
						<Link
							href="/"
							className={cn(
								"text-lg font-semibold hover:text-primary transition-colors uppercase",
								pathName === "/" && "text-primary",
							)}
						>
							Home
						</Link>
						<Link
							href="/"
							className={cn(
								"text-lg font-semibold hover:text-primary transition-colors uppercase",
								pathName === "/shop" && "text-primary",
							)}
						>
							Shop
						</Link>
						<Link
							href="/"
							className={cn(
								"text-lg font-semibold hover:text-primary transition-colors uppercase",
								pathName === "/blog" && "text-primary",
							)}
						>
							Blog
						</Link>
						<Link
							href="/"
							className={cn(
								"text-lg font-semibold hover:text-primary transition-colors uppercase",
								pathName === "/contact" && "text-primary",
							)}
						>
							Contact
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-5 h-4"
					>
						<SearchIcon className="h-6 w-6 hover:text-primary cursor-pointer transition-colors" />
						<Separator orientation="vertical" />
						<div className="flex items-center gap-4">
							<div className="hover:text-primary cursor-pointer transition-colors size-6 flex items-center justify-center relative">
								<span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-[#DC3545]">
									<span className="absolute right-0 -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[#DC3545] opacity-75"></span>
								</span>
								<Bell className="h-6 w-6" />
							</div>
							<div className="hover:text-primary cursor-pointer transition-colors size-6 flex items-center justify-center relative">
								<div className="absolute -top-1 -right-1.5 z-1 h-4 w-4 rounded-full bg-[#4570f1] flex items-center justify-center">
									<span className="text-background text-[10px] font-medium">
										1
									</span>
								</div>
								<Heart className="h-6 w-6" />
							</div>
							<div className="hover:text-primary cursor-pointer transition-colors size-6 flex items-center justify-center relative">
								<div className="absolute -top-1 -right-2 z-1 h-4 w-4 rounded-full bg-[#4570f1] flex items-center justify-center">
									<span className="text-background text-[10px] font-medium">
										1
									</span>
								</div>
								<ShoppingCart className="h-6 w-6" />
							</div>
						</div>
						<Separator orientation="vertical" />
						<Link href="/login">
							<Button
								variant="ghost"
								className="rounded-full cursor-pointer text-primary/90 hover:text-primary text-base"
							>
								Sign in
							</Button>
						</Link>
					</motion.div>
				</div>
			</header>
		</>
	);
};
