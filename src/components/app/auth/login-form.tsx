"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Logo } from "@/components/app/home";
import { Icons } from "@/lib/icon";

export function LoginForm() {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!email && !password) {
			return;
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full max-w-md mx-auto"
		>
			<Card className="w-full">
				<CardHeader className="space-y-1 text-center">
					<motion.div className="flex items-center justify-center">
						<Logo />
					</motion.div>
					<CardTitle className="text-2xl font-bold">
						Sign in to your account
					</CardTitle>
				</CardHeader>
				<form onSubmit={onSubmit}>
					<CardContent className="px-8">
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-full px-3 hover:bg-transparent cursor-pointer"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										) : (
											<Eye className="h-4 w-4 text-muted-foreground" />
										)}
										<span className="sr-only">Toggle password visibility</span>
									</Button>
								</div>
								<div className="flex justify-end mb-4">
									<Link
										href="#"
										className="text-sm text-primary hover:underline"
									>
										Forgot password?
									</Link>
								</div>
							</div>
						</motion.div>
					</CardContent>
					<CardFooter className="flex flex-col gap-4 px-8">
						<Button className="w-full">Sign In</Button>
						<div className="relative w-full">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t"></span>
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-primary-500 font-medium">
									Or continue with
								</span>
							</div>
						</div>
						<div className="flex items-center justify-center gap-x-3 mb-4 w-full">
							<Button
								variant="outline"
								className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
							>
								<Github className="h-5 w-5" />
								GitHub
							</Button>
							<Button
								variant="outline"
								className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
							>
								<Icons.google className="h-5 w-5" />
								Google
							</Button>
						</div>
						<p className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link href="/register" className="text-primary hover:underline">
								Create account
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</motion.div>
	);
}
