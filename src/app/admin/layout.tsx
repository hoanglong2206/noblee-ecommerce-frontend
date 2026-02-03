"use client";

import { AppSidebar, NavUser } from "@/components/app/admin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	const pathname = usePathname();

	const lastSegment = pathname.split("/").filter(Boolean).pop() || "home";

	const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

	const [theme, setTheme] = useState<"light" | "dark">(() => {
		if (typeof window === "undefined") {
			return "light";
		}
		const savedTheme = localStorage.getItem("theme");
		return savedTheme === "dark" ? "dark" : "light";
	});

	useEffect(() => {
		if (typeof document === "undefined") {
			return;
		}

		document.documentElement.classList.toggle("dark", theme === "dark");

		if (typeof window !== "undefined") {
			localStorage.setItem("theme", theme);
		}
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="flex h-screen flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b pr-4">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<div className="flex items-center gap-1">{title}</div>
					</div>
					<div className="flex items-center gap-4">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="secondary"
									className="relative size-10 group-has-data-[collapsible=icon]/sidebar-wrapper:size-8 rounded-full"
								>
									<span className="absolute top-0.5 right-1 z-1 h-2 w-2 rounded-full bg-[#DC3545]">
										<span className="absolute right-0 -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[#DC3545] opacity-75"></span>
									</span>
									<Bell className="h-5 w-5 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Notifications</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="secondary"
									className="rounded-full size-10 group-has-data-[collapsible=icon]/sidebar-wrapper:size-8"
									onClick={toggleTheme}
								>
									{theme === "light" ? (
										<Moon className="h-5 w-5 text-muted-foreground" />
									) : (
										<Sun className="h-5 w-5 text-muted-foreground" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Toggle Theme</p>
							</TooltipContent>
						</Tooltip>

						<NavUser
							user={{
								name: "Charlie Nguyen",
								email: "charlie.nguyen@gmail.com",
								avatar: "/avatars/charlie-nguyen.jpg",
							}}
						/>
					</div>
				</header>
				{/* Main Content */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<main className="flex-1 overflow-y-auto">{children}</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
