"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function AddExperienceModal() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const utils = trpc.useUtils();

	const createExperience = trpc.experiences.create.useMutation({
		onSuccess: () => {
			setIsOpen(false);
			utils.experiences.getFeed.invalidate();
			router.refresh();
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		createExperience.mutate({
			restaurantName: formData.get("restaurant") as string,
			rating: Number(formData.get("rating")),
			review: formData.get("review") as string,
			// Default to no group if not specified
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="lg" variant="accent">
					<Plus className="mr-2 h-6 w-6 stroke-[3px]" /> Add Experience
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl border-4 border-foreground shadow-neo">
				<DialogHeader>
					<DialogTitle className="text-3xl font-black italic tracking-tighter">
						ADD_A_SCENE
					</DialogTitle>
					<DialogDescription className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
						Share your latest dining discovery with the group.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					<div className="space-y-2">
						<Label
							htmlFor="restaurant"
							className="text-sm font-bold uppercase tracking-widest"
						>
							Restaurant Name
						</Label>
						<Input
							id="restaurant"
							name="restaurant"
							placeholder="Where did you go?"
							className="border-2 border-foreground bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor="date"
								className="text-sm font-bold uppercase tracking-widest"
							>
								Visit Date
							</Label>
							<Input
								id="date"
								name="date"
								type="date"
								className="border-2 border-foreground bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="rating"
								className="text-sm font-bold uppercase tracking-widest"
							>
								Rating (1-5)
							</Label>
							<Input
								id="rating"
								name="rating"
								type="number"
								min="1"
								max="5"
								defaultValue="5"
								className="border-2 border-foreground bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="review"
							className="text-sm font-bold uppercase tracking-widest"
						>
							The Review
						</Label>
						<Textarea
							id="review"
							name="review"
							placeholder="Tell us about the vibes and the flavor..."
							className="border-2 border-foreground bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
							required
						/>
					</div>

					<DialogFooter>
						<Button
							type="submit"
							disabled={createExperience.isPending}
							className="w-full sm:w-auto h-14 px-12 text-lg font-black italic shadow-neo hover:translate-x-1 hover:translate-y-1"
						>
							{createExperience.isPending ? "SHARING..." : "POST_TO_FEED"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
