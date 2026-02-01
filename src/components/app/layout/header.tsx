"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
	X,
	SearchIcon,
	Mail,
	Facebook,
	Youtube,
	Instagram,
	Bell,
	Heart,
	ShoppingCart,
	Phone,
	User,
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
import { CarouselAds, Logo } from "@/components/app/home";
import { cn, stringToColor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { NavUser } from "@/components/app/admin/nav-user";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserProfileQuery, userQueryKeys } from "@/features/user/query";
import { useLogoutMutation } from "@/features/auth/query";
import { useToastStore } from "@/store/useToastStore";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError } from "@/features/api-client";

export const Header = () => {
	const [showBanner, setShowBanner] = useState<boolean>(true);
	const [lang, setLang] = useState<string>("en");
	const pathName = usePathname();
	const router = useRouter();
	const addToast = useToastStore((state) => state.addToast);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	useEffect(() => {
		void useAuthStore.getState().checkAuth();
	}, []);

	const { data: profile, isLoading: isProfileLoading } = useUserProfileQuery({
		queryKey: userQueryKeys.profile(),
		enabled: isAuthenticated,
		retry: false,
	});

	const logoutMutation = useLogoutMutation({
		onSuccess: () => {
			addToast("Signed out successfully.", "success");
			router.replace("/login");
		},
	});

	const handleLogout = async (): Promise<void> => {
		if (logoutMutation.isPending) {
			return;
		}
		try {
			await logoutMutation.mutateAsync();
		} catch (error) {
			if (isApiError(error)) {
				addToast(error.message || "Unable to sign out.", "error");
			} else {
				addToast("Unexpected error occurred. Please try again.", "error");
			}
		}
	};

	const navUserData = useMemo(() => {
		if (profile) {
			const displayName = profile.fullName?.trim() || profile.email;
			return {
				name: displayName,
				email: profile.email,
				avatar: profile.avatarUrl ?? "",
				colorAvatar: stringToColor(displayName),
			};
		}
		if (!isAuthenticated || isProfileLoading) {
			return null;
		}
		const fallbackName = "Account";
		return {
			name: fallbackName,
			email: "",
			avatar: "",
			colorAvatar: stringToColor(fallbackName),
		};
	}, [isAuthenticated, isProfileLoading, profile]);

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
						className="bg-foreground text-background relative hidden xl:flex font-medium"
					>
						<div className="container px-4 py-3 flex items-center justify-between w-full mx-auto">
							<div className="flex items-center gap-2 h-4 w-1/3">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									<p className="text-sm">hello@noblee.com</p>
								</div>
								<Separator orientation="vertical" />
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4" />
									<p className="text-sm">(+84) 868 332 623</p>
								</div>
							</div>
							<CarouselAds />
							<div className="flex items-center gap-4 h-4 justify-end w-1/3">
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
										<DropdownMenuItem onClick={() => setLang("en")}>
											<Image
												src="/flag-english.png"
												alt="lang"
												width={20}
												height={20}
											/>
											<span className="ml-2">English</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLang("vi")}>
											<Image
												src="/flag-vietnamese.png"
												alt="lang"
												width={20}
												height={20}
											/>
											<span className="ml-2">Vietnamese</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Separator orientation="vertical" />
								<div className="flex items-center gap-4">
									<Facebook className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
									<Youtube className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
									<Instagram className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform" />
								</div>
							</div>
						</div>
						<Button
							onClick={handleCloseBanner}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground hover:bg-transparent text-muted opacity-50 hover:opacity-80 transition-opacity"
						>
							<X className="h-4 w-4" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Header */}
			<header className="sticky top-0 z-15 w-full bg-background/95 backdrop-blur shadow-sm">
				<div className="container flex h-16 items-center justify-between mx-auto">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-2  w-1/3"
					>
						<Logo />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="xl:flex items-center justify-center gap-12 hidden  w-1/3"
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
						className="flex items-center gap-5 h-4 w-1/3 justify-end"
					>
						<SearchIcon className="h-6 w-6 hover:text-primary cursor-pointer transition-colors" />
						<Separator orientation="vertical" />
						<div className="flex items-center gap-4">
							{isAuthenticated && (
								<>
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
								</>
							)}
							<div className="hover:text-primary cursor-pointer transition-colors size-6 flex items-center justify-center relative">
								<div className="absolute -top-1 -right-2 z-1 h-4 w-4 rounded-full bg-[#4570f1] flex items-center justify-center">
									<span className="text-background text-[10px] font-medium">
										1
									</span>
								</div>
								<ShoppingCart className="h-6 w-6" />
							</div>
						</div>
						{isAuthenticated ? (
							<>
								<Separator orientation="vertical" />
								{navUserData ? (
									<NavUser user={navUserData} onLogout={handleLogout} />
								) : (
									<Skeleton className="size-10 rounded-full" />
								)}
							</>
						) : (
							<>
								<Separator orientation="vertical" />
								<Link
									href="/login"
									className="hover:text-primary font-medium cursor-pointer transition-colors gap-1 size-6 flex items-center justify-center w-fit"
								>
									<User className="h-6 w-6" />
									Sign in
								</Link>
							</>
						)}
					</motion.div>
				</div>
			</header>
		</>
	);
};
