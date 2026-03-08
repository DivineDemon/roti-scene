"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import { User } from "lucide-react";

export default function ProfilePage() {
	const { data: session, update, status } = useSession();
	const router = useRouter();
	const [name, setName] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (session?.user?.name) {
			setName(session.user.name);
		}
	}, [session]);

	const updateProfile = trpc.users.updateProfile.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			let imageUrl = session?.user?.image || "";
			if (imageFile) {
				const formData = new FormData();
				formData.append("image", imageFile);
				const res = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});
				if (res.ok) {
					const data = await res.json();
					imageUrl = data.url;
				}
			}

			await updateProfile.mutateAsync({
				name,
				image: imageUrl,
			});
			await update({ name, image: imageUrl });
		} catch (error) {
			console.error("Failed to update profile", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (status === "loading") return null;

	return (
		<div className="container mx-auto max-w-lg p-6 pb-24 space-y-8">
			<div>
				<h1 className="text-5xl font-black uppercase tracking-tighter">
					EDIT_PROFILE
				</h1>
				<p className="text-muted-foreground uppercase text-sm font-bold tracking-widest italic">
					Customize your appearance in the scene.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex justify-center border-4 border-foreground p-6 bg-muted/20">
					{imageFile ? (
						// biome-ignore lint/performance/noImgElement: arbitrary image domain
						<img
							src={URL.createObjectURL(imageFile)}
							alt="Avatar"
							className="h-32 w-32 border-4 border-foreground object-cover shadow-neo-sm"
						/>
					) : session?.user?.image ? (
						// biome-ignore lint/performance/noImgElement: arbitrary image domain
						<img
							src={session.user.image}
							alt="Avatar"
							className="h-32 w-32 border-4 border-foreground object-cover shadow-neo-sm"
						/>
					) : (
						<div className="h-32 w-32 border-4 border-foreground bg-secondary flex items-center justify-center shadow-neo-sm">
							<User className="h-16 w-16" />
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold uppercase tracking-widest">
						Profile Picture
					</Label>
					<Input
						type="file"
						accept="image/*"
						onChange={(e) => setImageFile(e.target.files?.[0] || null)}
						className="file:px-4 file:mr-4 file:border-r-4 file:text-white file:font-semibold file:h-10 file:bg-primary p-0"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold uppercase tracking-widest">
						Name
					</Label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<Button
					type="submit"
					disabled={isSaving}
					className="w-full h-14 text-lg font-black italic shadow-neo hover:translate-x-1 hover:translate-y-1 mt-4"
				>
					{isSaving ? "SAVING..." : "SAVE_CHANGES"}
				</Button>
			</form>
		</div>
	);
}
