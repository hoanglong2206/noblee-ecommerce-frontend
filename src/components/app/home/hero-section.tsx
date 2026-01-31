"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ElementType, useRef } from "react";
import { HeroCard } from "./hero-card";
import {
	Camera,
	Headphones,
	Keyboard,
	Laptop,
	LaptopMinimal,
	Menu,
	Smartphone,
	Watch,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const HeroSection = () => {
	const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

	const heros: {
		heroImage: string;
		costSale: number;
		name: string;
		label: string;
		isMain?: boolean;
	}[] = [
		{
			heroImage: "/apple.webp",
			costSale: 100,
			name: "AirPods",
			label: "Buy1Get1 Ipod 5",
		},
		{
			heroImage: "/camera.webp",
			costSale: 375,
			name: "Camera",
			label: "Up to 50% Off",
			isMain: true,
		},
		{
			heroImage: "/samsung.webp",
			costSale: 150,
			name: "Headphones",
			label: "Sale 50% Off",
		},
		{
			heroImage: "/watch.webp",
			costSale: 425,
			name: "Watch",
			label: "Save! 30-50%",
			isMain: true,
		},
	];

	return (
		<div className="w-full py-10 px-4 md:px-8 bg-muted/45">
			<div className="container mx-auto grid grid-cols-1 xl:grid-cols-11 gap-4">
				<CategoriesBar />
				<div className="xl:col-span-6">
					<Carousel
						plugins={[plugin.current]}
						opts={{ loop: true }}
						className="w-full h-full"
					>
						<CarouselContent>
							{heros
								.filter((hero) => hero.isMain)
								.map((hero, index) => (
									<CarouselItem
										key={index}
										className="flex items-center gap-1 cursor-default justify-center text-sm select-none"
									>
										<HeroCard hero={hero} />
									</CarouselItem>
								))}
						</CarouselContent>
					</Carousel>
				</div>
				<div className="flex flex-col gap-4 xl:col-span-3">
					{heros
						.filter((hero) => !hero.isMain)
						.map((hero, index) => (
							<HeroCard key={index} hero={hero} />
						))}
				</div>
			</div>
		</div>
	);
};

const CategoriesBar = () => {
	const menuItems: { icon: ElementType; label: string }[] = [
		{
			icon: Laptop,
			label: "Computer & Laptop",
		},
		{
			icon: LaptopMinimal,
			label: "Tablets & iPad",
		},
		{
			icon: Smartphone,
			label: "Smart Phones",
		},
		{
			icon: Watch,
			label: "Smart Watches",
		},
		{
			icon: Headphones,
			label: "Headphones",
		},
		{
			icon: Camera,
			label: "Cameras",
		},
		{
			icon: Keyboard,
			label: "Keyboard & Mouse",
		},
	];
	return (
		<aside className="hidden lg:flex flex-col rounded-md shadow-md col-span-2">
			<div className="flex items-center justify-start gap-1.5 text-lg px-4 py-3 bg-primary text-background font-medium rounded-t-md cursor-default select-none">
				<Menu className="size-5" />
				Categories
			</div>
			<div className="px-4 py-2">
				{menuItems.map((item, index) => (
					<div key={index}>
						<div className="flex items-center hover:text-primary transition-colors cursor-pointer font-medium gap-2 px-1 py-2 select-none">
							<item.icon />
							{item.label}
						</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>
		</aside>
	);
};
