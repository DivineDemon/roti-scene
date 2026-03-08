"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";

export default function CreateGroupModal() {
	const [isOpen, setIsOpen] = useState(false);
	const utils = trpc.useUtils();

	const createGroup = trpc.groups.create.useMutation({
		onSuccess: () => {
			setIsOpen(false);
			utils.groups.getMyGroups.invalidate();
			utils.experiences.getFeed.invalidate();
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		createGroup.mutate({
			name: formData.get("name") as string,
			description: formData.get("description") as string,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="w-full border-2 border-foreground shadow-neo-sm mt-2 font-black tracking-widest uppercase italic"
				>
					<Plus className="mr-2 h-4 w-4" /> NEW_CIRCLE
				</Button>
			</DialogTrigger>
			<DialogContent className="border-4 border-foreground shadow-neo">
				<DialogHeader>
					<DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
						CREATE_CIRCLE
					</DialogTitle>
					<DialogDescription className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
						Start a new circle to share experiences with friends.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label className="text-sm font-bold uppercase tracking-widest">
							Circle Name
						</Label>
						<Input
							name="name"
							placeholder="e.g. Foodies of NY"
							className="border-2 border-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-bold uppercase tracking-widest">
							Description (Optional)
						</Label>
						<Input
							name="description"
							placeholder="What is this circle about?"
							className="border-2 border-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
					</div>

					<DialogFooter>
						<Button
							type="submit"
							disabled={createGroup.isPending}
							className="w-full h-12 text-lg font-black italic shadow-neo hover:translate-x-1 hover:translate-y-1"
						>
							{createGroup.isPending ? "CREATING..." : "CREATE"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
