"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BadgePercent,
	ExternalLink,
	FolderTree,
	LayoutDashboard,
	ListOrdered,
	LucideIcon,
	Package,
	Receipt,
	Shield,
	ShoppingCart,
	Star,
	Ticket,
	UserCog,
	Users,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "../home";

type NavigationItem = {
	label: string;
	href: string;
	icon: LucideIcon;
};

const mainMenuItems: NavigationItem[] = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Order Management", href: "/admin/orders", icon: ShoppingCart },
	{ label: "Customers", href: "/admin/customers", icon: Users },
	{ label: "Coupon Code", href: "/admin/coupons", icon: Ticket },
	{ label: "Categories", href: "/admin/categories", icon: FolderTree },
	{ label: "Transaction", href: "/admin/transactions", icon: Receipt },
	{ label: "Brand", href: "/admin/brands", icon: BadgePercent },
];

const productMenuItems: NavigationItem[] = [
	{ label: "Add Products", href: "/admin/products/add", icon: Package },
	{ label: "Product List", href: "/admin/products", icon: ListOrdered },
	{ label: "Product Reviews", href: "/admin/products/reviews", icon: Star },
];

const adminMenuItems: NavigationItem[] = [
	{ label: "Admin role", href: "/admin/roles", icon: UserCog },
	{
		label: "Control Authority",
		href: "/admin/authority",
		icon: Shield,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname() ?? "/admin";
	const normalizedPath = pathname.replace(/\/$/, "") || "/admin";
	const allMenuItems = [
		...mainMenuItems,
		...productMenuItems,
		...adminMenuItems,
	];
	const activeHref =
		allMenuItems.reduce<string | null>((match, item) => {
			const normalizedHref = item.href.replace(/\/$/, "");
			const matches =
				normalizedPath === normalizedHref ||
				normalizedPath.startsWith(`${normalizedHref}/`);

			if (!matches) {
				return match;
			}

			if (!match || normalizedHref.length > match.length) {
				return normalizedHref;
			}

			return match;
		}, null) ?? "/admin";

	const renderMenuItems = (items: NavigationItem[]) =>
		items.map((item) => {
			const normalizedHref = item.href.replace(/\/$/, "");
			const isRoot = normalizedHref === "/admin";
			const isActive = isRoot
				? activeHref === "/admin"
				: activeHref === normalizedHref;

			return (
				<SidebarMenuItem key={item.label}>
					<SidebarMenuButton
						asChild
						tooltip={item.label}
						className={cn(
							"flex items-center gap-3 text-sm transition-colors",
							isActive &&
								"bg-sidebar-primary/20 text-primary/90 font-semibold hover:bg-sidebar-primary/30 hover:text-primary",
						)}
						aria-current={isActive ? "page" : undefined}
					>
						<Link href={item.href} className="flex items-center gap-2">
							<item.icon className="h-5 w-5" />
							<span className="truncate">{item.label}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		});

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Logo />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="flex items-center justify-between">
						Main
					</SidebarGroupLabel>
					<SidebarMenu>{renderMenuItems(mainMenuItems)}</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Products</SidebarGroupLabel>
					<SidebarMenu>{renderMenuItems(productMenuItems)}</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Administration</SidebarGroupLabel>
					<SidebarMenu>{renderMenuItems(adminMenuItems)}</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu></SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						tooltip="My shop"
						className="flex items-center gap-3 text-sm transition-colors"
					>
						<Link href="/" className="flex items-center gap-2">
							<Package className="h-5 w-5" />
							Your Shop
							<ExternalLink className="h-5 w-5 ml-auto" />
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
