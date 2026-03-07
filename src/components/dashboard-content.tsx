"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Plus, Users, Utensils, Star, MessageSquare } from "lucide-react";
import AddExperienceModal from "@/components/add-experience-modal";

export default function DashboardContent() {
	const { data: session } = useSession();
	const { data: experiences, isLoading: loadingFeed } =
		trpc.experiences.getFeed.useQuery();
	const { data: groups, isLoading: loadingGroups } =
		trpc.groups.getMyGroups.useQuery();

	return (
		<div className="container mx-auto p-4 md:p-6 pb-24">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
				<div>
					<h1 className="text-5xl font-black uppercase tracking-tighter">
						THE_SCENE
					</h1>
					<p className="text-muted-foreground uppercase text-sm font-bold tracking-widest italic">
						Welcome back, {session?.user?.name || "Member"}. Here's what's
						cooking.
					</p>
				</div>
				<AddExperienceModal />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Groups */}
				<div className="lg:col-span-1 space-y-8">
					<div className="border-4 border-foreground bg-background p-6 shadow-neo">
						<h2 className="text-2xl font-black uppercase mb-4 italic flex items-center gap-2">
							<Users className="h-6 w-6" /> MY_GROUPS
						</h2>

						{loadingGroups ? (
							<p className="text-muted-foreground font-medium italic animate-pulse">
								SCANNIG_CIRCLES...
							</p>
						) : !groups || groups.length === 0 ? (
							<div className="space-y-4">
								<p className="text-muted-foreground font-medium italic">
									You haven't joined any circles yet.
								</p>
								<Button
									variant="outline"
									className="w-full border-2 border-foreground shadow-neo-sm"
								>
									<Plus className="mr-2 h-4 w-4" /> CREATE_NEW_CIRCLE
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{/* biome-ignore lint/suspicious/noExplicitAny: tRPC return type is inferred */}
								{groups.map((group: any) => (
									<div
										key={group.id}
										className="border-2 border-foreground p-3 hover:bg-foreground hover:text-background transition-colors cursor-pointer group"
									>
										<p className="font-black uppercase tracking-tight">
											{group.name}
										</p>
										<p className="text-xs font-bold opacity-70 group-hover:opacity-100">
											{group._count.members} MEMBERS {"//"}
											{group._count.experiences} SCENES
										</p>
									</div>
								))}
								<Button
									variant="outline"
									className="w-full border-2 border-foreground shadow-neo-sm mt-2"
								>
									<Plus className="mr-2 h-4 w-4" /> NEW_CIRCLE
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Right Column: Feed */}
				<div className="lg:col-span-2 space-y-8">
					<div className="border-4 border-foreground bg-background p-6 shadow-neo">
						<h2 className="text-2xl font-black uppercase mb-6 italic flex items-center gap-2">
							<Utensils className="h-6 w-6" /> RECENT_VIBES
						</h2>

						{loadingFeed ? (
							<p className="text-muted-foreground font-medium italic animate-pulse">
								FETCHING_TRUTH...
							</p>
						) : !experiences || experiences.length === 0 ? (
							<div className="border-2 border-foreground border-dashed p-12 text-center">
								<p className="font-bold italic uppercase">
									Silence in the scene.
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Add an experience to break the ice.
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-8">
								{/* biome-ignore lint/suspicious/noExplicitAny: tRPC return type is inferred */}
								{experiences.map((exp: any) => (
									<div
										key={exp.id}
										className="border-4 border-foreground bg-background shadow-neo overflow-hidden"
									>
										<div className="p-4 border-b-4 border-foreground bg-primary/20 flex justify-between items-center">
											<div>
												<h3 className="text-xl font-black uppercase italic tracking-tight underline">
													{exp.restaurant.name}
												</h3>
												{exp.group && (
													<span className="text-[10px] font-black uppercase bg-foreground text-background px-1.5 py-0.5 mt-1 inline-block">
														IN: {exp.group.name}
													</span>
												)}
											</div>
											<div className="text-right">
												<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
													{exp.visitDate
														? new Date(exp.visitDate).toLocaleDateString()
														: ""}
												</p>
												<div className="flex gap-0.5 mt-1 justify-end">
													{[1, 2, 3, 4, 5].map((star) => (
														<Star
															key={`star-${exp.id}-${star}`}
															className={`h-3 w-3 ${star <= (exp.rating || 0) ? "fill-foreground" : "text-muted-foreground opacity-30"}`}
														/>
													))}
												</div>
											</div>
										</div>
										<div className="p-4">
											<p className="font-medium italic leading-relaxed">
												"{exp.review}"
											</p>
											<div className="mt-4 pt-4 border-t-2 border-foreground/10 flex justify-between items-center">
												<div className="flex items-center gap-2">
													<div className="h-6 w-6 bg-secondary border border-foreground rounded-none flex items-center justify-center font-black text-[10px] uppercase">
														{exp.user.name?.charAt(0) || "U"}
													</div>
													<span className="text-xs font-black uppercase tracking-tight italic">
														{exp.user.name}
													</span>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 px-2 font-black text-[10px] uppercase gap-1 hover:bg-foreground hover:text-background"
												>
													<MessageSquare className="h-3 w-3" /> COMMENTS (0)
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
