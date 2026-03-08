"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { User as UserIcon } from "lucide-react";

export function Header() {
	const pathname = usePathname();
	const { data: session } = useSession();

	// Hide the entire header on landing and auth pages
	const isAuthPage = pathname === "/login" || pathname === "/register";
	const isLandingPage = pathname === "/";
	const shouldHideHeader = isLandingPage || isAuthPage;

	if (shouldHideHeader) return null;

	return (
		<header className="flex justify-between items-center p-4 h-16 border-b-4 border-foreground bg-background">
			<Link
				href="/dashboard"
				className="font-bold text-xl uppercase tracking-tighter hover:bg-foreground hover:text-background transition-colors px-2"
			>
				ROTI_SCENE
			</Link>
			<div className="flex items-center gap-4">
				<ThemeToggle />
				{session && (
					<>
						<Button
							variant="outline"
							size="icon"
							asChild
							className="border-2 border-foreground shadow-neo-sm hover:translate-x-px hover:translate-y-px"
						>
							<Link href="/profile">
								<UserIcon className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							variant="outline"
							onClick={() => signOut({ callbackUrl: "/" })}
							className="font-bold border-2 border-foreground shadow-neo-sm hover:translate-x-px hover:translate-y-px"
						>
							LOG_OUT
						</Button>
					</>
				)}
			</div>
		</header>
	);
}
