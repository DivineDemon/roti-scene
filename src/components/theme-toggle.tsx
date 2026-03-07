"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="h-11 w-11 border-2 border-border shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all"
				>
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					className="z-50 min-w-32 overflow-hidden rounded-none border-2 border-border bg-background p-1 text-foreground shadow-neo animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
				>
					<DropdownMenu.Item
						className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm font-bold outline-none transition-colors hover:bg-accent hover:text-white focus:bg-accent focus:text-white data-disabled:pointer-events-none data-disabled:opacity-50"
						onClick={() => setTheme("light")}
					>
						<Sun className="mr-2 h-4 w-4" />
						<span>Light</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm font-bold outline-none transition-colors hover:bg-accent hover:text-white focus:bg-accent focus:text-white data-disabled:pointer-events-none data-disabled:opacity-50"
						onClick={() => setTheme("dark")}
					>
						<Moon className="mr-2 h-4 w-4" />
						<span>Dark</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="relative flex cursor-default select-none items-center px-2 py-1.5 text-sm font-bold outline-none transition-colors hover:bg-accent hover:text-white focus:bg-accent focus:text-white data-disabled:pointer-events-none data-disabled:opacity-50"
						onClick={() => setTheme("system")}
					>
						<Monitor className="mr-2 h-4 w-4" />
						<span>System</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
