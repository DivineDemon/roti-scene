import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react';
import type { Metadata } from "next";
import { DM_Sans, Space_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Roti Scene",
  description: "Private restaurant sharing for friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${geist.variable} ${spaceMono.variable} antialiased`}
      >
        <NeonAuthUIProvider
          authClient={authClient}
          redirectTo="/"
          emailOTP
        >
          <header className='flex justify-between items-center p-4 h-16 border-b-4 border-black bg-white dark:bg-black'>
            <div className="font-bold text-xl uppercase tracking-tighter">Roti Scene</div>
            <UserButton size="icon" />
          </header>
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
