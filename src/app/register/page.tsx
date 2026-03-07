"use client";

import { useState, useTransition } from "react";
import { register } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = (formData: FormData) => {
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		setError("");
		setSuccess("");

		startTransition(() => {
			register({ name, email, password }).then((data) => {
				if ("error" in data) {
					setError(data.error);
				} else if ("success" in data) {
					setSuccess(data.success);
				}
			});
		});
	};

	return (
		<div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
			<div className="absolute top-8 right-8">
				<ThemeToggle />
			</div>
			<div className="w-full max-w-[400px] border-4 border-foreground bg-background p-8 shadow-neo">
				<h1 className="mb-6 text-3xl font-black italic tracking-tighter">
					JOIN_THE_SCENE
				</h1>

				<form action={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="name"
							className="text-sm font-bold uppercase tracking-widest"
						>
							Name
						</label>
						<Input
							id="name"
							name="name"
							placeholder="Your Name"
							className="border-2 border-foreground bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-sm font-bold uppercase tracking-widest"
						>
							Email
						</label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="friend@roti.scene"
							className="border-2 border-foreground bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="password"
							className="text-sm font-bold uppercase tracking-widest"
						>
							Password
						</label>
						<div className="relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder="******"
								className="border-2 border-foreground bg-background pr-10 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
								required
								disabled={isPending}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>

					{error && (
						<div className="border-2 border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive">
							{error}
						</div>
					)}
					{success && (
						<div className="border-2 border-emerald-500 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-500">
							{success}
						</div>
					)}

					<Button
						type="submit"
						className="w-full"
						size="lg"
						disabled={isPending}
					>
						{isPending ? "CREATING_ACCOUNT..." : "JOIN_NOW"}
					</Button>
				</form>

				<div className="mt-6 text-center text-sm font-medium">
					Already in the scene?{" "}
					<Link
						href="/login"
						className="font-bold underline decoration-4 underline-offset-4 hover:bg-foreground hover:text-background"
					>
						LOGIN_HERE
					</Link>
				</div>
			</div>
		</div>
	);
}
