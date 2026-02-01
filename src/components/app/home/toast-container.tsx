"use client";

import { useToastStore } from "@/store/useToastStore";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
	const { toasts } = useToastStore();

	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-25 flex flex-col gap-2 pointer-events-none">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={cn(
						"pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-75 animate-in slide-in-from-right-full duration-300",
						toast.type === "success" &&
							"bg-white border-l-4 border-green-500 text-slate-800",
						toast.type === "error" &&
							"bg-white border-l-4 border-red-500 text-slate-800",
						toast.type === "info" &&
							"bg-white border-l-4 border-blue-500 text-slate-800",
					)}
				>
					{toast.type === "success" && (
						<CheckCircle className="w-5 h-5 text-green-500" />
					)}
					{toast.type === "error" && (
						<XCircle className="w-5 h-5 text-red-500" />
					)}
					{toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}

					<span className="font-medium text-sm">{toast.message}</span>
				</div>
			))}
		</div>
	);
}
