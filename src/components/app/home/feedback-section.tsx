"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";

export const FeedbackSection = () => {
	const testimonials = [
		{
			id: 1,
			rating: 5,
			title: "Best Online Eletronic Site",
			text: "I always find something useful and affordable in this store.",
			author: "Robert Smith",
			profilePicture: "/images/image.png",
			location: "USA",
			product: {
				image: "/images/image.png",
				name: "3-in-1 Wireless Charger for Apple Devices",
				price: "3.200.000₫",
			},
		},
		{
			id: 2,
			rating: 5,
			title: "Great Selection and Quality",
			text: "Great selection of electronics at reasonable prices.",
			author: "Allen Lyn",
			profilePicture: "/images/image.png",
			location: "France",
			product: {
				image: "/images/image.png",
				name: "SoundForm Rise",
				price: "2.133.000₫",
				originalPrice: "2.667.000₫",
			},
		},
		{
			id: 3,
			rating: 5,
			title: "Best Customer Service",
			text: "Top-notch customer service and a wide range of electronic.",
			author: "Peter Rope",
			location: "USA",
			profilePicture: "/images/image.png",
			product: {
				image: "/images/image.png",
				name: "UltraGlass 2 Treated Screen Protector for iPhone 15 Pro",
				price: "1.067.000₫",
				originalPrice: "1.200.000₫",
			},
		},
		{
			id: 4,
			rating: 4,
			title: "Fast Shipping",
			text: "Delivery was super fast and the packaging was secure.",
			author: "Sarah Connor",
			location: "UK",
			profilePicture: "/images/image.png",
			product: {
				image: "/images/image.png",
				name: "MagSafe Charger",
				price: "900.000₫",
			},
		},
	];

	const showNavigation = testimonials.length > 3;

	return (
		<section className="w-full py-20 px-4 md:px-8 bg-muted/45">
			<div className="container mx-auto">
				{/* Header */}
				<div className="text-center mb-12 space-y-6">
					<h2 className="text-4xl md:text-5xl font-semibold text-balance">
						Customer Feedback
					</h2>
					<p className="text-muted-foreground">
						See what our satisfied customers have to say about our
						electronic accessories.
					</p>
				</div>

				<div className="px-4 md:px-12">
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-4">
							{testimonials.map((testimonial) => (
								<CarouselItem
									key={testimonial.id}
									className="pl-8 md:basis-1/2 lg:basis-1/3"
								>
									<div className="bg-background rounded-lg p-6 h-full flex flex-col justify-between group border">
										<div>
											<div className="flex gap-1 mb-4">
												{Array.from({
													length: testimonial.rating,
												}).map((_, i) => (
													<span
														key={i}
														className="text-lime-500 text-2xl"
													>
														★
													</span>
												))}
											</div>

											<h3 className="text-lg font-semibold mb-2 line-clamp-1">
												{testimonial.title}
											</h3>

											<p className="text-foreground text-lg mb-6 min-h-21">
												"{testimonial.text}"
											</p>

											<div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
												<Avatar size="lg">
													<AvatarImage
														src={
															testimonial.profilePicture
														}
													/>
													<AvatarFallback>
														{testimonial.author
															.split(" ")
															.map((x) => x[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-semibold">
														{testimonial.author}
													</p>
													<p className="text-sm text-muted-foreground">
														Customer from{" "}
														{testimonial.location}
													</p>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-4 w-full">
											<div className="w-16 h-16 relative shrink-0 bg-gray-100 rounded overflow-hidden">
												{/* <Image src={testimonial.product.image} fill alt="" /> */}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">
													{testimonial.product.name}
												</p>
												<div className="flex items-center gap-2 mt-1">
													{testimonial.product
														.originalPrice && (
														<span className="text-xs text-muted-foreground line-through">
															{
																testimonial
																	.product
																	.originalPrice
															}
														</span>
													)}
													<span className="text-sm font-semibold text-red-500">
														{
															testimonial.product
																.price
														}
													</span>
												</div>
											</div>
											<Button
												variant={"outline"}
												className="opacity-0 group-hover:opacity-100 border-foreground hover:bg-foreground hover:text-background rounded-full size-10 transition-all"
											>
												<ArrowUpRight className="size-5" />
											</Button>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>

						{showNavigation && (
							<>
								<CarouselPrevious className="hidden md:flex -left-12" />
								<CarouselNext className="hidden md:flex -right-12" />

								<div className="flex justify-center gap-4 mt-8 md:hidden">
									<CarouselPrevious className="static translate-y-0" />
									<CarouselNext className="static translate-y-0" />
								</div>
							</>
						)}
					</Carousel>
				</div>
			</div>
		</section>
	);
};
