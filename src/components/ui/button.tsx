import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-none border-4 border-border bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-4 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-hover",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				outline:
					"border-4 border-border bg-background hover:bg-muted text-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/90",
				ghost:
					"border-transparent shadow-none hover:bg-muted hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
				destructive: "bg-red-500 text-white hover:bg-red-600",
				link: "border-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none text-primary underline-offset-4 hover:underline",
				accent: "bg-accent text-white hover:bg-accent/90",
			},
			size: {
				default: "h-11 px-6",
				xs: "h-8 px-3 text-xs",
				sm: "h-9 px-4 text-sm",
				lg: "h-14 px-8 text-lg",
				xl: "h-16 px-10 text-xl",
				icon: "size-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
