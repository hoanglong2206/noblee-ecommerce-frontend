import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroCardProps {
	hero: {
		heroImage: string;
		costSale: number;
		name: string;
		label: string;
		isMain?: boolean;
	};
}

export const HeroCard = ({ hero }: HeroCardProps) => {
	return (
		<div
			className={cn(
				"relative aspect-4/3 overflow-hidden rounded-md w-full group h-full",
				!hero.isMain && "cursor-pointer",
			)}
		>
			<div className="absolute inset-0">
				<Image
					src={hero.heroImage}
					alt={hero.name}
					layout="fill"
					objectFit="cover"
					className={cn(
						!hero.isMain &&
							"group-hover:scale-110 transition-transform duration-300",
					)}
				/>
			</div>

			<div
				className={cn(
					"flex items-center justify-center h-full",
					hero.isMain && "mx-8",
				)}
			>
				<div className="flex flex-col gap-2 justify-center items-start p-8 w-full h-full z-1 select-none">
					<h4
						className={cn(
							"text-sm uppercase text-background font-medium",
							hero.isMain && "text-base font-semibold",
						)}
					>
						{hero.isMain && "Buy1Get1 - "}
						{hero.name}!
					</h4>
					<h2
						className={cn(
							"font-bold",
							hero.isMain
								? "text-yellow-400 text-7xl max-w-75"
								: "text-background text-2xl max-w-2/5",
						)}
					>
						{hero.label}
					</h2>
					<h5
						className={cn(
							"text-background text-base font-medium tracking-wide",
						)}
					>
						Starting at{" "}
						<span className={cn(!hero.isMain && "text-yellow-400")}>
							${hero.costSale}
						</span>
						{hero.isMain && ". Hurry up! Do not miss.."}
					</h5>
					{hero.isMain && (
						<Button
							size={"xl"}
							variant={"secondary"}
							className="rounded-full mt-4 text-base"
						>
							Shop now
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
