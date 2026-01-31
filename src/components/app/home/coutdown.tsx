"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
	targetDate: string | Date; // ví dụ: '2026-02-01T23:59:59'
};

type TimeLeft = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

function getTimeLeft(target: Date): TimeLeft {
	const diff = target.getTime() - new Date().getTime();

	if (diff <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	return {
		days: Math.floor(diff / (1000 * 60 * 60 * 24)),
		hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((diff / (1000 * 60)) % 60),
		seconds: Math.floor((diff / 1000) % 60),
	};
}

export function Countdown({ targetDate }: CountdownProps) {
	const memoizedTarget = useMemo(() => new Date(targetDate), [targetDate]);
	const fallbackTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
	const [timeLeft, setTimeLeft] = useState<TimeLeft>(fallbackTime);

	useEffect(() => {
		const updateTime = () => setTimeLeft(getTimeLeft(memoizedTarget));

		updateTime();
		const timer = setInterval(updateTime, 1000);

		return () => clearInterval(timer);
	}, [memoizedTarget]);

	return (
		<div className="flex items-center gap-3">
			<span className="font-semibold text-base">Hurry up! Offer ends in:</span>

			<div className="flex gap-2">
				<TimeBox value={timeLeft.days} />
				<TimeBox value={timeLeft.hours} />
				<TimeBox value={timeLeft.minutes} />
				<TimeBox value={timeLeft.seconds} />
			</div>
		</div>
	);
}

function TimeBox({ value }: { value: number }) {
	return (
		<div className="bg-destructive/80 text-background px-2 py-1 text-center min-w-11 rounded-md shadow-sm">
			<span className="font-bold text-lg tabular-nums">
				{String(value).padStart(2, "0")}
			</span>
		</div>
	);
}
