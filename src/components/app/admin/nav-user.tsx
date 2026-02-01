"use client";

import { LogOut, Settings, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function NavUser({
	user,
	onLogout,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
		colorAvatar?: string;
	};
	onLogout?: () => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-10 group-has-data-[collapsible=icon]/sidebar-wrapper:size-8 cursor-pointer">
					<AvatarImage src={user.avatar || undefined} alt={user.name} />
					<AvatarFallback
						className="text-background font-medium"
						style={{
							backgroundColor: user.colorAvatar || "",
						}}
					>
						{user.name
							.split(" ")
							.map((x) => x[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-56">
				<DropdownMenuLabel className="flex items-center bg-sidebar gap-x-2">
					<Avatar className="h-15 w-15 cursor-pointer hidden md:flex">
						<AvatarImage
							src={user.avatar || undefined}
							alt={user.name || "r"}
						/>
						<AvatarFallback
							className="text-lg tracking-wider text-background font-medium"
							style={{
								backgroundColor: user.colorAvatar || "",
							}}
						>
							{user.name
								.split(" ")
								.map((x) => x[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-0.5">
						<p className="text-lg font-bold truncate line-clamp-1">
							{user.name}
						</p>
						<p className="text-sm text-muted-foreground truncate line-clamp-1">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/settings/profile" className="cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="#" className="cursor-pointer">
							<UsersRound className="mr-2 h-4 w-4" />
							Switch account
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-500 focus:text-red-500 cursor-pointer"
					onSelect={() => onLogout?.()}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
