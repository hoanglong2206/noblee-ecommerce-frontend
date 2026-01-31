"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Countdown } from "./coutdown";
import Link from "next/link";
import { TextUnderline } from "@/components/ui/text-underline";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export const MainSection = () => {
	return (
		<div className="w-full py-12 px-4 md:px-8 space-y-12">
			<div className="container mx-auto space-y-8">
				<PromoBanner />
				<ProductSection isBestDeal products={[]} title="Today's Best Deals" />
				<FeaturedProductSlider />
				<ProductSection products={[]} title="Best Selling" />
			</div>
		</div>
	);
};

const ProductSection = ({
	products,
	title,
	isBestDeal,
}: {
	products: any[];
	title: string;
	isBestDeal?: boolean;
}) => {
	return (
		<div className="">
			<div className="flex items-center justify-between">
				<div className="text-3xl font-medium">{title}</div>
				{isBestDeal ? (
					<Countdown targetDate="2026-02-01T23:59:59" />
				) : (
					<TextUnderline as={Link} href="11" size="lg" className="font-medium">
						View All
					</TextUnderline>
				)}
			</div>
			<Carousel opts={{ loop: true }} className="w-full h-full max-w-3xl">
				<CarouselContent></CarouselContent>
			</Carousel>
		</div>
	);
};

function PromoBanner() {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const promoCode = "GET35PSL";

	const handleCopy = () => {
		navigator.clipboard.writeText(promoCode);

		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 5000);
	};

	return (
		<div className="container mx-auto max-w-6xl">
			<div className="relative flex w-full items-center justify-between overflow-hidden rounded-md xl:rounded-full bg-[#002E25] py-6 px-4 shadow-lg xl:px-12 xl:py-6">
				<div className="absolute bottom-8 -left-16 h-64 w-64 z-1 rounded-full bg-[#0F5A4F] opacity-0 xl:opacity-100"></div>
				<div className="absolute top-8 -left-16 h-64 w-64 rounded-full bg-[#169e8a] opacity-0 xl:opacity-100"></div>
				<div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-[#0F5A4F] opacity-0 xl:opacity-100"></div>
				<div className="absolute -right-16 bottom-10 h-64 w-64 z-1 rounded-full bg-[#169e8a] opacity-0 xl:opacity-100"></div>
				<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-20"></div>

				<div className="relative z-10 flex w-full flex-col items-center justify-between gap-4 xl:flex-row">
					<div className="flex items-center gap-1 xl:gap-10 flex-col xl:flex-row">
						<h2 className="font-bold text-background text-xl xl:text-2xl">
							Big Promotion <br className="hidden xl:flex" /> Grab Your
							Vouchers!
						</h2>
						<div className="text-sm text-background text-justify px-10 xl:px-0">
							<p>
								Up to 35% Off everything code.
								<br className="hidden xl:flex" /> Limited time only. Excludes
								selected lines.
							</p>
						</div>
					</div>

					<div className="flex items-center gap-12">
						<button
							onClick={handleCopy}
							className="flex cursor-pointer items-center gap-2 font-bold text-[#FFD700] transition-transform active:scale-95"
							title="Click to copy code"
						>
							{isCopied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}

							{promoCode}
						</button>

						<Button
							size={"xl"}
							variant={"secondary"}
							className="text-base rounded-full"
						>
							Shop Sale
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function FeaturedProductSlider() {
	const slides = [
		{
			id: 1,
			mainImage:
				"https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop", // Ảnh loa/cây cối
			category: "SAVE 30-50% ELECTRONICS",
			title: "Small Size Big Sound",
			description:
				"A mini speaker with powerful and dynamic sound. Compact and portable, perfect for any space and easy to carry anywhere.",
			product: {
				image:
					"https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=100&q=80",
				name: "Portable Wireless Speakers Music Speakers New 2025",
				price: "$135.00",
				oldPrice: "$148.00",
			},
		},
		{
			id: 2,
			mainImage:
				"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop", // Ảnh Laptop
			category: "NEW ARRIVAL - LAPTOPS",
			title: "Power & Portability",
			description:
				"Experience the next level of computing with ultra-fast processors and stunning retina display.",
			product: {
				image:
					"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=100&q=80",
				name: "ProBook Ultra Slim 15-inch 2025 Edition",
				price: "$999.00",
				oldPrice: "$1200.00",
			},
		},
		{
			id: 3,
			mainImage:
				"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", // Ảnh Tai nghe
			category: "PREMIUM AUDIO",
			title: "Immersive Silence",
			description:
				"Active noise cancelling headphones that let you focus on what matters most. Crystal clear audio quality.",
			product: {
				image:
					"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80",
				name: "Noise Cancelling Over-Ear Studio Headphones",
				price: "$249.00",
				oldPrice: "$300.00",
			},
		},
	];

	const [currentIndex, setCurrentIndex] = useState(0);

	const handleDotClick = (index: number) => {
		setCurrentIndex(index);
	};

	const currentSlide = slides[currentIndex];

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-100 2xl:min-h-125">
				<div className="relative group h-100 xl:h-full overflow-hidden rounded-2xl">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{
								duration: 0.4,
								ease: "easeOut",
							}}
							className="absolute inset-0"
						>
							<Image
								key={currentIndex}
								src={currentSlide.mainImage}
								alt={currentSlide.title}
								layout="fill"
								objectFit="cover"
								className="group-hover:scale-110 transition-transform"
							/>
						</motion.div>
					</AnimatePresence>
					<div className="absolute inset-0 bg-foreground/5"></div>
				</div>

				<div className="flex flex-col justify-center p-8 xl:p-12 bg-muted rounded-2xl">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className="text-center min-h-75 flex flex-col justify-between"
						>
							<div>
								<p className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground/80">
									{currentSlide.category}
								</p>

								<h2 className="mb-4 text-2xl font-semibold xl:text-4xl leading-tight">
									{currentSlide.title}
								</h2>

								<p className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-base">
									{currentSlide.description}
								</p>
							</div>

							<div className="mb-10 flex items-center gap-4 rounded-full bg-background py-5 px-10 shadow-sm border border-muted max-h-18.75">
								<div className="shrink-0 overflow-hidden">
									<Image
										src={currentSlide.product.image}
										alt="thumb"
										width={50}
										height={50}
										objectFit="cover"
									/>
								</div>

								<div className="flex flex-1 items-center justify-between gap-4 select-none">
									<div className="font-semibold line-clamp-2 hover:text-destructive/80 transition-colors cursor-pointer text-start">
										{currentSlide.product.name}
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xl font-semibold text-destructive/80">
											{currentSlide.product.price}
										</span>
										<span className="text-muted-foreground font-medium line-through">
											{currentSlide.product.oldPrice}
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					<div className="flex items-center justify-center gap-2">
						{slides.map((_, index) => (
							<button
								key={index}
								onClick={() => handleDotClick(index)}
								className="relative flex items-center justify-center p-2 cursor-pointer"
							>
								{index === currentIndex && (
									<motion.div
										layoutId="activeDotOutline"
										className="absolute h-5 w-5 rounded-full border border-foreground"
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
									/>
								)}
								<div
									className={`h-2 w-2 rounded-full transition-colors duration-300 ${
										index === currentIndex
											? "bg-foreground"
											: "bg-muted-foreground"
									}`}
								/>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
