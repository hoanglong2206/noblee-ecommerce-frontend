import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ElementType, useMemo } from "react";

export interface StatsHeaderProps {
	stats: {
		label: string;
		value: string;
		icon: ElementType;
		color: string;
		change?: string;
	}[];
}

export const StatsHeader = ({ stats }: StatsHeaderProps) => {
	const length = useMemo(() => stats.length, [stats]);
	return (
		<div
			className={cn("grid w-full gap-4", {
				"grid-cols-1": length === 1,
				"grid-cols-2": length === 2,
				"grid-cols-3": length === 3,
				"grid-cols-4": length >= 4,
			})}
		>
			{stats.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<Card key={index} className="overflow-hidden">
						<CardContent className=" flex items-center gap-4">
							<div className={cn("p-3 rounded-lg", stat.color)}>
								<Icon className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<div className="flex items-baseline justify-between gap-2">
									<p className="text-2xl font-bold text-foreground">
										{stat.value}
									</p>
									{stat.change && (
										<Badge
											variant={
												stat.change.startsWith("+") ? "success" : "destructive"
											}
										>
											{stat.change}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">{stat.label}</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};
