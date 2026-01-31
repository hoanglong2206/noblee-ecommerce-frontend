"use client";
import { Footer, Header } from "@/components/app/layout";
import type React from "react";
interface AppLayoutProps {
	children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="grow">{children}</main>
			<Footer />
		</div>
	);
}
