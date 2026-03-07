import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
	const session = await auth();

	// If already logged in, send to dashboard
	if (session) {
		redirect("/dashboard");
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center selection:bg-foreground selection:text-background">
			{/* Top Navigation for Landing */}
			<div className="absolute top-8 flex w-full max-w-7xl justify-between px-8">
				<h1 className="text-2xl font-black italic tracking-tighter">
					ROTI_SCENE
				</h1>
				<ThemeToggle />
			</div>

			{/* Hero Section */}
			<div className="relative z-10 space-y-8">
				<div className="inline-block border-4 border-foreground bg-yellow-400 px-6 py-2 shadow-neo-sm transform -rotate-2">
					<span className="text-lg font-black uppercase tracking-widest text-black">
						PRIVATE_ACCESS_ONLY
					</span>
				</div>

				<h2 className="text-7xl font-black uppercase leading-[0.9] tracking-tighter md:text-9xl">
					EAT.
					<br />
					SHARE.
					<br />
					STAY_REAL.
				</h2>

				<p className="mx-auto max-w-xl text-xl font-bold italic leading-tight text-muted-foreground md:text-2xl">
					The restricted restaurant scene for your internal circle. No public
					reviews, no bots, just your friends' truth.
				</p>

				<div className="flex flex-col items-center justify-center gap-6 pt-8 md:flex-row">
					<Button
						asChild
						size="xl"
						className="h-20 w-full min-w-[280px] text-2xl font-black shadow-neo hover:translate-x-1 hover:translate-y-1 md:w-auto"
					>
						<Link href="/register">JOIN_THE_CIRCLE</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="xl"
						className="h-20 w-full min-w-[280px] border-4 border-foreground bg-background text-2xl font-black shadow-neo hover:translate-x-1 hover:translate-y-1 md:w-auto"
					>
						<Link href="/login">LOG_IN</Link>
					</Button>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="fixed bottom-12 right-12 z-0 hidden lg:block">
				<div className="h-64 w-64 border-8 border-foreground bg-primary/20 shadow-neo" />
			</div>
			<div className="fixed left-12 top-1/2 z-0 hidden -translate-y-1/2 lg:block">
				<div className="h-48 w-48 rounded-full border-8 border-foreground bg-emerald-500/20 shadow-neo" />
			</div>

			{/* Footer Branding */}
			<div className="absolute bottom-8 w-full text-center">
				<p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
					EST_2024 {"//"} ENCRYPTED_VIBES
				</p>
			</div>
		</main>
	);
}
