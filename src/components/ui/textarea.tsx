import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex field-sizing-content min-h-32 w-full rounded-none border-4 border-black dark:border-white bg-white dark:bg-black px-4 py-2 text-base font-bold transition-all outline-none placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
