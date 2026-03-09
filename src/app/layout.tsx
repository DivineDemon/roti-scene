import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { TRPCProvider } from "@/lib/trpc/client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const spaceMono = Space_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: "Roti Scene",
	description: "Private restaurant sharing and rating for buddies.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("font-sans", geist.variable)}
		>
			<body className={`${geist.variable} ${spaceMono.variable} antialiased`}>
				<SessionProvider>
					<TRPCProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<Header />
							<main>{children}</main>
						</ThemeProvider>
					</TRPCProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
