"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Eye, EyeOff, Github, Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/lib/icon";
import { Logo } from "../home";
import { cn } from "@/lib/utils";
import {
	useRegisterMutation,
	useResendOtpMutation,
	useSendOtpMutation,
	useVerifyOtpMutation,
} from "@/features/auth/query";
import { isApiError } from "@/features/api-client";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/useToastStore";

// Step 1: Email Input
function EmailStep({
	email,
	setEmail,
	disabled,
}: {
	email: string;
	setEmail: (email: string) => void;
	disabled: boolean;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email address</Label>
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						id="email"
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="pl-10"
						disabled={disabled}
					/>
				</div>
			</div>
			<p className="text-xs text-muted-foreground">
				We&apos;ll send a verification code to this email address.
			</p>
		</div>
	);
}

// Step 2: OTP Verification
function OTPStep({
	otp,
	setOtp,
	email,
	countdown,
	onResend,
	verifyAttempts,
	resendPending,
}: {
	otp: string;
	setOtp: (otp: string) => void;
	email: string;
	countdown: number;
	onResend: () => void;
	verifyAttempts: number;
	resendPending: boolean;
}) {
	return (
		<div className="space-y-4">
			<div className="text-center space-y-2">
				<p className="text-sm text-muted-foreground">
					We sent a verification code to
				</p>
				<p className="font-medium">{email}</p>
			</div>

			<div className="flex justify-center">
				<InputOTP maxLength={6} value={otp} onChange={setOtp}>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
			</div>

			<div className="text-center space-y-2">
				<p className="text-xs text-muted-foreground">
					Attempts remaining: {3 - verifyAttempts}/3
				</p>
				{countdown > 0 ? (
					<p className="text-sm text-muted-foreground">
						Resend code in{" "}
						<span className="font-medium text-foreground">{countdown}s</span>
					</p>
				) : (
					<Button
						variant="link"
						className="text-sm p-0 h-auto"
						onClick={onResend}
						disabled={resendPending}
					>
						{resendPending ? (
							<>
								<Loader2 className="mr-2 h-3 w-3 animate-spin" /> Resending...
							</>
						) : (
							"Resend verification code"
						)}
					</Button>
				)}
			</div>
		</div>
	);
}

// Step 3: Account Details
function AccountDetailsStep({
	email,
	fullname,
	setFullname,
	password,
	setPassword,
	showPassword,
	setShowPassword,
	disabled,
}: {
	email: string;
	fullname: string;
	setFullname: (name: string) => void;
	password: string;
	setPassword: (password: string) => void;
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
	disabled: boolean;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email-readonly">Email</Label>
				<Input
					id="email-readonly"
					type="email"
					value={email}
					disabled
					className="bg-muted"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="fullname">Full name</Label>
				<Input
					id="fullname"
					type="text"
					placeholder="Enter your full name"
					value={fullname}
					onChange={(e) => setFullname(e.target.value)}
					disabled={disabled}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="Create a password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="pr-10"
						disabled={disabled}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4 text-muted-foreground" />
						) : (
							<Eye className="h-4 w-4 text-muted-foreground" />
						)}
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Password must be at least 8 characters
				</p>
			</div>
		</div>
	);
}

export function RegisterForm() {
	const [currentStep, setCurrentStep] = useState<number>(0);

	// Step 1 state
	const [email, setEmail] = useState<string>("");

	// Step 2 state
	const [otp, setOtp] = useState<string>("");
	const [countdown, setCountdown] = useState<number>(60);
	const [verifyAttempts, setVerifyAttempts] = useState<number>(0);

	// Step 3 state
	const [fullname, setFullname] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const router = useRouter();
	const addToast = useToastStore((state) => state.addToast);
	const sendOtpMutation = useSendOtpMutation();
	const resendOtpMutation = useResendOtpMutation();
	const verifyOtpMutation = useVerifyOtpMutation();
	const registerMutation = useRegisterMutation();
	const isSendPending = sendOtpMutation.isPending;
	const isResendPending = resendOtpMutation.isPending;
	const isVerifyPending = verifyOtpMutation.isPending;
	const isRegisterPending = registerMutation.isPending;
	const loading = isSendPending || isVerifyPending || isRegisterPending;

	// Countdown timer for OTP resend
	useEffect(() => {
		if (currentStep === 1 && countdown > 0) {
			const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [currentStep, countdown]);

	// Reset OTP state when moving to step 2
	const startOTPCountdown = useCallback(() => {
		setCountdown(60);
		setOtp("");
	}, []);

	// Validate email format
	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Step 1: Check email
	const handleEmailContinue = async () => {
		const normalized = email.trim().toLowerCase();
		if (!normalized) {
			addToast("Please enter your email address", "error");
			return;
		}

		if (!isValidEmail(normalized)) {
			addToast("Please enter a valid email address", "error");
			return;
		}

		try {
			await sendOtpMutation.mutateAsync({ email: normalized });
			setEmail(normalized);
			startOTPCountdown();
			setVerifyAttempts(0);
			setCurrentStep(1);
			addToast("Verification code sent.", "success");
		} catch (error) {
			if (isApiError(error)) {
				addToast(error.message || "Unable to send verification code.", "error");
			} else {
				addToast("Unexpected error occurred. Please try again.", "error");
			}
		}
	};

	// Step 2: Verify OTP
	const handleVerifyOTP = async () => {
		const normalized = email.trim().toLowerCase();
		if (otp.length !== 6) {
			addToast("Please enter the 6-digit verification code.", "error");
			return;
		}

		try {
			await verifyOtpMutation.mutateAsync({ email: normalized, otp });
			setCurrentStep(2);
			setVerifyAttempts(0);
			addToast("Email verified successfully.", "success");
		} catch (error) {
			const nextAttempts = verifyAttempts + 1;
			setVerifyAttempts(nextAttempts);
			if (isApiError(error)) {
				addToast(error.message || "Invalid verification code.", "error");
			} else {
				addToast("Unexpected error occurred. Please try again.", "error");
			}
			if (nextAttempts >= 3) {
				setOtp("");
				addToast(
					"Maximum attempts reached. Please request a new code.",
					"error",
				);
			}
		}
	};

	// Resend OTP
	const handleResendOTP = async () => {
		if (countdown > 0 || isResendPending) {
			return;
		}
		setVerifyAttempts(0);
		const normalized = email.trim().toLowerCase();
		try {
			await resendOtpMutation.mutateAsync({ email: normalized });
			startOTPCountdown();
			addToast("Verification code resent.", "info");
		} catch (error) {
			if (isApiError(error)) {
				addToast(
					error.message || "Failed to resend verification code.",
					"error",
				);
			} else {
				addToast("Unexpected error occurred. Please try again.", "error");
			}
		}
	};

	// Step 3: Create account
	const handleCreateAccount = async () => {
		const trimmedName = fullname.trim();
		if (!trimmedName) {
			addToast("Please enter your full name", "error");
			return;
		}

		if (!password) {
			addToast("Please create a password", "error");
			return;
		}

		if (password.length < 8) {
			addToast("Password must be at least 8 characters", "error");
			return;
		}

		try {
			await registerMutation.mutateAsync({
				email: email.trim().toLowerCase(),
				fullName: trimmedName,
				password,
			});
			addToast("Account created successfully.", "success");
			router.replace("/");
		} catch (error) {
			if (isApiError(error)) {
				const details = error.details ?? {};
				const resolveDetail = (value?: string | string[]) => {
					if (!value) {
						return undefined;
					}
					return Array.isArray(value) ? value.join(" ") : value;
				};
				const nextErrors: {
					fullName?: string;
					password?: string;
					general?: string;
				} = {
					fullName: resolveDetail(details?.fullName as string | string[]),
					password: resolveDetail(details?.password as string | string[]),
				};
				nextErrors.general =
					nextErrors.fullName || nextErrors.password
						? error.message || "Registration failed."
						: error.message || "Registration failed.";
				const messages = [
					nextErrors.fullName,
					nextErrors.password,
					nextErrors.general,
				].filter(Boolean) as string[];
				if (messages.length) {
					messages.forEach((message) => addToast(message, "error"));
				}
			} else {
				addToast("Unexpected error occurred. Please try again.", "error");
			}
		}
	};

	// Go back to previous step
	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep((s) => s - 1);
		}
	};

	// Get step title and description
	const getStepInfo = () => {
		switch (currentStep) {
			case 0:
				return {
					title: "Create an account",
					description: "Enter your email to get started",
				};
			case 1:
				return {
					title: "Verify your email",
					description: "Enter the 6-digit code we sent you",
				};
			case 2:
				return {
					title: "Complete your profile",
					description: "Fill in your details to finish registration",
				};
			default:
				return { title: "", description: "" };
		}
	};

	const stepInfo = getStepInfo();

	// Check if can proceed to next step
	const canContinue = () => {
		switch (currentStep) {
			case 0:
				return email.length > 0;
			case 1:
				return otp.length === 6 && verifyAttempts < 3;
			case 2:
				return fullname.trim().length > 0 && password.length >= 8;
			default:
				return false;
		}
	};

	// Handle next/submit action
	const handleNext = () => {
		switch (currentStep) {
			case 0:
				handleEmailContinue();
				break;
			case 1:
				handleVerifyOTP();
				break;
			case 2:
				handleCreateAccount();
				break;
		}
	};

	// Get button text
	const getButtonText = () => {
		if (loading) {
			switch (currentStep) {
				case 0:
					return "Checking...";
				case 1:
					return "Verifying...";
				case 2:
					return "Creating account...";
			}
		}
		switch (currentStep) {
			case 0:
				return "Continue";
			case 1:
				return "Verify";
			case 2:
				return "Create account";
			default:
				return "Continue";
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full max-w-md mx-auto"
		>
			<Card className="w-full">
				<CardHeader className="space-y-1 text-center">
					{/* Step indicators */}
					<div className="flex justify-center gap-2 mb-4">
						{[0, 1, 2].map((step) => (
							<div
								key={step}
								className={`h-2 w-8 rounded-full transition-colors ${
									step <= currentStep ? "bg-primary" : "bg-muted"
								}`}
							/>
						))}
					</div>
					<motion.div className="flex items-center justify-center">
						<Logo />
					</motion.div>
					<CardTitle className="text-2xl font-bold">{stepInfo.title}</CardTitle>
					<CardDescription>{stepInfo.description}</CardDescription>
				</CardHeader>

				<CardContent className="px-8">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							{currentStep === 0 && (
								<EmailStep
									email={email}
									setEmail={setEmail}
									disabled={loading}
								/>
							)}
							{currentStep === 1 && (
								<OTPStep
									otp={otp}
									setOtp={setOtp}
									email={email}
									countdown={countdown}
									onResend={handleResendOTP}
									verifyAttempts={verifyAttempts}
									resendPending={isResendPending}
								/>
							)}
							{currentStep === 2 && (
								<AccountDetailsStep
									email={email}
									fullname={fullname}
									setFullname={setFullname}
									password={password}
									setPassword={setPassword}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
									disabled={loading}
								/>
							)}
						</motion.div>
					</AnimatePresence>
				</CardContent>

				<CardFooter className="flex flex-col gap-4 px-8">
					{/* Navigation buttons */}
					<div className="flex items-center w-full gap-2">
						{currentStep > 0 && (
							<Button
								variant="outline"
								onClick={handleBack}
								disabled={loading}
								className="flex items-center gap-2 bg-transparent"
							>
								<ArrowLeft className="h-4 w-4" />
								Back
							</Button>
						)}
						<Button
							className={cn("ml-auto", {
								"w-full": currentStep === 0,
							})}
							onClick={handleNext}
							disabled={!canContinue() || loading}
						>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{getButtonText()}
						</Button>
					</div>

					{/* Social login - only show on first step */}
					{currentStep === 0 && (
						<>
							<div className="relative w-full">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-card px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

							<div className="flex items-center justify-center gap-x-3 w-full">
								<Button
									variant="outline"
									className="flex-1 flex items-center justify-center gap-2 bg-transparent"
								>
									<Github className="h-5 w-5" />
									GitHub
								</Button>
								<Button
									variant="outline"
									className="flex-1 flex items-center justify-center gap-2 bg-transparent"
								>
									<Icons.google className="h-5 w-5" />
									Google
								</Button>
							</div>
						</>
					)}

					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
