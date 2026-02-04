"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Shield } from "lucide-react";

export const RoleListPanel = () => {
	return (
		<Card className="bg-background">
			<CardHeader className="space-y-4">
				<CardTitle>Roles</CardTitle>
				<div className="flex items-center justify-between gap-4">
					<Input
						type="text"
						placeholder="Search roles..."
						className="max-w-sm"
					/>
					<Button size={"icon"} variant={"outline"}>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4"></div>
			</CardContent>
		</Card>
	);
};
