"use client";

import { Plus, X } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AddExperienceModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [items, setItems] = useState<
		{ id: string; name: string; files: File[] }[]
	>([]);
	const router = useRouter();
	const utils = trpc.useUtils();

	const createExperience = trpc.experiences.create.useMutation({
		onSuccess: () => {
			setIsOpen(false);
			setItems([]);
			utils.experiences.getFeed.invalidate();
			router.refresh();
		},
	});

	const uploadImages = async (files: File[]): Promise<string[]> => {
		const urls: string[] = [];
		for (const file of files) {
			if (file.size === 0) continue;
			const formData = new FormData();
			formData.append("image", file);
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});
			if (res.ok) {
				const data = await res.json();
				urls.push(data.url);
			}
		}
		return urls;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		setIsUploading(true);

		try {
			const rawPhotos = formData.getAll("restaurantPhotos") as File[];
			const restaurantPhotos = await uploadImages(rawPhotos);

			const uploadedItems = await Promise.all(
				items.map(async (item) => ({
					name: item.name,
					photoUrls: await uploadImages(item.files),
				})),
			);

			createExperience.mutate({
				restaurantName: formData.get("restaurant") as string,
				priceLevel: Number(formData.get("priceLevel")),
				rating: Number(formData.get("rating")),
				review: formData.get("review") as string,
				photos: restaurantPhotos,
				items: uploadedItems.filter((i) => i.name.trim() !== ""),
			});
		} catch (error) {
			console.error("Upload failed", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="lg" variant="accent">
					<Plus className="mr-2 h-6 w-6 stroke-[3px]" /> Add Experience
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-4 border-foreground shadow-neo">
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
						<Label className="text-sm font-bold uppercase tracking-widest">
							Restaurant Name
						</Label>
						<Input
							name="restaurant"
							placeholder="Where did you go?"
							className="border-2 border-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold uppercase tracking-widest">
							Restaurant Photos
						</Label>
						<Input
							name="restaurantPhotos"
							type="file"
							multiple
							accept="image/*"
							className="border-2 border-foreground bg-background cursor-pointer"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-bold uppercase tracking-widest">
								Price
							</Label>
							<Select name="priceLevel" defaultValue="3">
								<SelectTrigger className="border-2 border-foreground bg-background focus:ring-0 flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
									<SelectValue placeholder="Price" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">$</SelectItem>
									<SelectItem value="2">$$</SelectItem>
									<SelectItem value="3">$$$</SelectItem>
									<SelectItem value="4">$$$$</SelectItem>
									<SelectItem value="5">$$$$$</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-bold uppercase tracking-widest">
								Rating (1-5)
							</Label>
							<Input
								name="rating"
								type="number"
								min="1"
								max="5"
								defaultValue="5"
								className="border-2 border-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
								required
							/>
						</div>
					</div>

					<div className="space-y-4 border-2 border-foreground p-4 bg-muted/20 rounded-md">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-bold uppercase tracking-widest">
								Items Consumed
							</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									setItems([
										...items,
										{ id: crypto.randomUUID(), name: "", files: [] },
									])
								}
								className="h-8 border-2 border-foreground font-black bg-background"
							>
								<Plus className="h-4 w-4 mr-1" /> Add Item
							</Button>
						</div>
						{items.map((item, index) => (
							<div key={item.id} className="flex gap-2 items-start">
								<div className="flex-1 space-y-2">
									<Input
										placeholder="Item name"
										value={item.name}
										onChange={(e) => {
											const newItems = [...items];
											newItems[index].name = e.target.value;
											setItems(newItems);
										}}
										className="border-2 border-foreground bg-background"
									/>
									<Input
										type="file"
										multiple
										accept="image/*"
										onChange={(e) => {
											const newItems = [...items];
											newItems[index].files = Array.from(e.target.files || []);
											setItems(newItems);
										}}
										className="border-2 border-foreground bg-background cursor-pointer"
									/>
								</div>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={() => setItems(items.filter((_, i) => i !== index))}
									className="shrink-0 border-2 border-foreground"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold uppercase tracking-widest">
							The Review
						</Label>
						<Textarea
							name="review"
							placeholder="Tell us about the vibes and the flavor..."
							className="border-2 border-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
							required
						/>
					</div>

					<DialogFooter>
						<Button
							type="submit"
							disabled={createExperience.isPending || isUploading}
							className="w-full sm:w-auto h-14 px-12 text-lg font-black italic shadow-neo hover:translate-x-1 hover:translate-y-1"
						>
							{isUploading
								? "UPLOADING..."
								: createExperience.isPending
									? "SHARING..."
									: "POST_TO_FEED"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
