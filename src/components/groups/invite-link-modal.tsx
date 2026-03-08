"use client";

import { useState } from "react";
import { Link2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";

export default function InviteLinkModal({ groupId }: { groupId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [inviteUrl, setInviteUrl] = useState<string | null>(null);

	const createInvite = trpc.groups.createInvite.useMutation({
		onSuccess: (data) => {
			const url = `${window.location.origin}/invite/${data.token}`;
			setInviteUrl(url);
		},
	});

	const handleGenerate = () => {
		createInvite.mutate({ groupId });
	};

	const handleCopy = () => {
		if (inviteUrl) {
			navigator.clipboard.writeText(inviteUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open) setInviteUrl(null);
			}}
		>
			<DialogTrigger asChild>
				<Button
					size="sm"
					variant="outline"
					onClick={(e) => e.stopPropagation()}
				>
					<Link2 className="h-3 w-3 mr-1" /> INVITE
				</Button>
			</DialogTrigger>
			<DialogContent className="border-4 border-foreground shadow-neo sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
						INVITE_LINK
					</DialogTitle>
					<DialogDescription className="font-bold uppercase text-xs tracking-widest text-muted-foreground">
						Generate a private invite link. Expires in 10 minutes.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{!inviteUrl ? (
						<Button
							onClick={handleGenerate}
							disabled={createInvite.isPending}
							className="w-full h-12 text-lg font-black italic shadow-neo-sm hover:translate-x-1 hover:translate-y-1"
						>
							{createInvite.isPending ? "GENERATING..." : "GENERATE_LINK"}
						</Button>
					) : (
						<div className="flex gap-2">
							<Input
								readOnly
								value={inviteUrl}
								className="border-2 border-foreground bg-background font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
							/>
							<Button
								size="icon"
								onClick={handleCopy}
								className="shrink-0 border-2 border-foreground"
							>
								{copied ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
