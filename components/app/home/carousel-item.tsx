"use client";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
	ArrowUpRight,
	BadgeCheck,
	CreditCard,
	MessagesSquare,
	Package,
} from "lucide-react";
import Link from "next/link";
import { useRef, ElementType } from "react";

export const CarouselAds = () => {
	const ads: { text: string; isLink?: boolean }[] = [
		{ text: "Welcome to store. Fantastic theme! Beautifully designed" },
		{ text: "Discount off 50%.", isLink: true },
		{ text: "Season Sale: Time to refresh your wardrobe.", isLink: true },
	];

	const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

	return (
		<Carousel
			plugins={[plugin.current]}
			opts={{ loop: true }}
			className="w-full max-w-3xl"
		>
			<CarouselContent>
				{ads.map((ad, index) => (
					<CarouselItem
						key={index}
						className="flex items-center gap-1 cursor-default justify-center text-sm select-none"
					>
						<p>{ad.text}</p>
						{ad.isLink && (
							<Link
								href="/"
								className="text-[#93f859] border-b-[#93f859] border-b flex items-center gap-1 hover:opacity-80 transition-opacity"
							>
								Shop now <ArrowUpRight className="h-4 w-4" />
							</Link>
						)}
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};

export const CarouselServices = () => {
	const serviceItem: {
		title: string;
		description: string;
		icon: ElementType;
	}[] = [
		{
			title: "Free Shipping",
			description:
				"Enjoy free worldwide shipping and returns, with customs and duties taxes included.",
			icon: Package,
		},
		{
			title: "Payment Security",
			description:
				"Your security is our priority. All payments are encrypted and processed securely.",
			icon: CreditCard,
		},
		{
			title: "Free Returns",
			description:
				"Free returns within 15 days, please make sure the items are in undamaged condition.",
			icon: BadgeCheck,
		},
		{
			title: "Premium Support",
			description:
				"We support customers 24/7, send questions we willsolve for you immediately.",
			icon: MessagesSquare,
		},
	];
	return (
		<Carousel opts={{ align: "start", loop: true }} className="w-full">
			<CarouselContent className="-ml-2 md:-ml-4 xl:ml-0 xl:grid xl:grid-cols-4 xl:gap-6">
				{serviceItem.map((item) => (
					<CarouselItem
						key={item.title}
						className="pl-2 md:pl-4 basis-full md:basis-1/2 xl:basis-auto xl:p-0 cursor-default select-none"
					>
						<div className="flex flex-col text-center items-center justify-center xl:justify-start gap-x-4 gap-y-2">
							<item.icon className="h-8 w-8 shrink-0" />
							<div className="space-y-1.5">
								<p className="text-lg font-semibold whitespace-nowrap">
									{item.title}
								</p>
								<p className="text-muted-foreground xl:max-w-xs">
									{item.description}
								</p>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
