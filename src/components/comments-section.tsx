"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

export default function CommentsSection({
	experienceId,
}: {
	experienceId: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState("");

	const { data: comments, isLoading } =
		trpc.comments.getByExperienceId.useQuery(
			{ experienceId },
			{ enabled: isOpen },
		);

	const utils = trpc.useUtils();
	const createComment = trpc.comments.create.useMutation({
		onSuccess: () => {
			setContent("");
			utils.comments.getByExperienceId.invalidate({ experienceId });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;
		createComment.mutate({ experienceId, content });
	};

	return (
		<div className="mt-4 pt-4 border-t-2 border-foreground/10">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setIsOpen(!isOpen)}
				className="h-8 px-2 font-black text-[10px] uppercase gap-1 hover:bg-foreground hover:text-background w-full justify-between"
			>
				<span className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4" />
					{isOpen ? "HIDE COMMENTS" : "SHOW COMMENTS"}
				</span>
			</Button>

			{isOpen && (
				<div className="mt-4 space-y-4">
					{isLoading ? (
						<p className="text-xs italic text-muted-foreground animate-pulse">
							Loading comments...
						</p>
					) : comments?.length === 0 ? (
						<p className="text-xs italic text-muted-foreground">
							No comments yet. Be the first!
						</p>
					) : (
						<div className="space-y-3">
							{/* biome-ignore lint/suspicious/noExplicitAny: tRPC return type is inferred */}
							{comments?.map((comment: any) => (
								<div
									key={comment.id}
									className="bg-muted/30 p-3 rounded-md border-l-2 border-foreground"
								>
									<div className="flex items-center gap-2 mb-1">
										<div className="h-5 w-5 bg-secondary border border-foreground rounded-none flex items-center justify-center font-black text-[10px] uppercase">
											{comment.user.name?.charAt(0) || "U"}
										</div>
										<span className="text-xs font-black uppercase tracking-tight italic">
											{comment.user.name}
										</span>
									</div>
									<p className="text-sm">{comment.content}</p>
								</div>
							))}
						</div>
					)}

					<form onSubmit={handleSubmit} className="flex gap-2">
						<Input
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Add a comment..."
							className="border-2 border-foreground bg-background h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
							disabled={createComment.isPending}
						/>
						<Button
							type="submit"
							disabled={!content.trim() || createComment.isPending}
							className="h-10 px-4 border-2 border-foreground font-black italic shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 bg-foreground text-background"
						>
							<Send className="h-4 w-4" />
						</Button>
					</form>
				</div>
			)}
		</div>
	);
}
