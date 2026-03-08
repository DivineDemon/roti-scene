"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function InvitePage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = use(params);
	const { status } = useSession();
	const router = useRouter();

	const {
		data: inviteInfo,
		isLoading: loadingInvite,
		error,
	} = trpc.groups.getInviteInfo.useQuery(
		{ token },
		{
			retry: false,
		},
	);

	const joinMutation = trpc.groups.joinWithInvite.useMutation({
		onSuccess: () => {
			router.push("/");
		},
	});

	if (loadingInvite || status === "loading") {
		return (
			<div className="container mx-auto p-12 text-center flex items-center justify-center font-bold tracking-widest italic animate-pulse">
				LOADING_INVITE...
			</div>
		);
	}

	if (error || !inviteInfo) {
		return (
			<div className="container mx-auto p-12 text-center space-y-4">
				<h1 className="text-4xl font-black italic uppercase">INVALID_INVITE</h1>
				<p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
					This invite link doesn't exist or is malformed.
				</p>
			</div>
		);
	}

	if (inviteInfo.isExpired) {
		return (
			<div className="container mx-auto p-12 text-center space-y-6 flex flex-col items-center">
				<h1 className="text-4xl font-black italic uppercase">INVITE_EXPIRED</h1>
				<p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
					This 10-minute invite link has expired.
				</p>
				{status === "authenticated" ? (
					<div className="space-y-4 mt-4 text-center">
						<p className="text-xs uppercase font-bold text-muted-foreground italic">
							Already part of the system? Try logging in again to refresh your
							session.
						</p>
						<Button
							onClick={() => router.push("/login")}
							variant="outline"
							className="h-12 px-8 font-black italic shadow-neo-sm border-2 border-foreground uppercase"
						>
							LOGIN_AGAIN
						</Button>
					</div>
				) : null}
			</div>
		);
	}

	const handleJoin = () => {
		if (status === "unauthenticated") {
			router.push(`/register?callbackUrl=/invite/${token}`);
			return;
		}

		joinMutation.mutate({ token });
	};

	return (
		<div className="container mx-auto p-12 flex justify-center">
			<div className="max-w-md w-full border-4 border-foreground bg-background p-8 shadow-neo text-center space-y-6">
				<div className="mx-auto h-16 w-16 border-4 border-foreground bg-primary flex items-center justify-center shadow-neo-sm">
					<Users className="h-8 w-8 text-foreground" />
				</div>
				<div>
					<h1 className="text-3xl font-black uppercase italic tracking-tighter">
						JOIN_CIRCLE
					</h1>
					<p className="text-muted-foreground uppercase text-xs font-bold tracking-widest mt-2 leading-relaxed">
						You've been invited to join <br />
						<span className="text-foreground border-b-2 border-foreground font-black text-sm">
							{inviteInfo.groupName}
						</span>
						.
					</p>
				</div>

				<Button
					onClick={handleJoin}
					disabled={joinMutation.isPending}
					className="w-full h-14 text-lg font-black italic shadow-neo hover:translate-x-1 hover:translate-y-1 mt-4"
				>
					{joinMutation.isPending
						? "JOINING..."
						: status === "unauthenticated"
							? "REGISTER_TO_JOIN"
							: "JOIN_NOW"}
				</Button>
			</div>
		</div>
	);
}
