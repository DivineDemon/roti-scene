"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Users, Utensils, Star } from "lucide-react";
import AddExperienceModal from "@/components/add-experience-modal";
import CommentsSection from "@/components/comments-section";
import CreateGroupModal from "@/components/groups/create-group-modal";
import InviteLinkModal from "@/components/groups/invite-link-modal";

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
								SCANNING_CIRCLES...
							</p>
						) : !groups || groups.length === 0 ? (
							<div className="space-y-4">
								<p className="text-muted-foreground font-medium italic">
									You haven't joined any circles yet.
								</p>
								<CreateGroupModal />
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{/* biome-ignore lint/suspicious/noExplicitAny: tRPC return type is inferred */}
								{groups.map((group: any) => (
									<div
										key={group.id}
										className="border-2 border-foreground p-3 flex justify-between items-center"
									>
										<div>
											<p className="font-black uppercase tracking-tight">
												{group.name}
											</p>
											<p className="text-xs font-bold opacity-70">
												{group._count.members} MEMBERS {"//"}{" "}
												{group._count.experiences} SCENES
											</p>
										</div>
										<InviteLinkModal groupId={group.id} />
									</div>
								))}
								<CreateGroupModal />
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
													{exp.priceLevel ? "$".repeat(exp.priceLevel) : ""}
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
											{exp.photos && exp.photos.length > 0 && (
												<div className="mt-2 mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
													{exp.photos.map((photo: string) => (
														// biome-ignore lint/performance/noImgElement: arbitrary image domain
														<img
															key={photo}
															src={photo}
															alt="Restaurant"
															className="h-32 object-cover border-2 border-foreground"
														/>
													))}
												</div>
											)}
											<p className="font-medium italic leading-relaxed">
												"{exp.review}"
											</p>

											{exp.items && exp.items.length > 0 && (
												<div className="mt-4 space-y-3">
													<p className="text-xs font-black uppercase tracking-widest border-b-2 border-foreground/20 pb-1">
														Items Consumed
													</p>
													{exp.items.map(
														(item: {
															id: string;
															name: string;
															photoUrls: string[];
														}) => (
															<div
																key={item.id}
																className="flex flex-col gap-1"
															>
																<p className="text-sm font-bold">{item.name}</p>
																{item.photoUrls &&
																	item.photoUrls.length > 0 && (
																		<div className="flex gap-2 min-h-16">
																			{item.photoUrls.map((url: string) => (
																				// biome-ignore lint/performance/noImgElement: arbitrary image domain
																				<img
																					key={url}
																					src={url}
																					alt={item.name}
																					className="h-16 object-cover border-2 border-foreground"
																				/>
																			))}
																		</div>
																	)}
															</div>
														),
													)}
												</div>
											)}

											<div className="mt-4 pt-4 border-t-2 border-foreground/10 flex items-center">
												<div className="flex items-center gap-2">
													<div className="h-6 w-6 bg-secondary border border-foreground rounded-none flex items-center justify-center font-black text-[10px] uppercase">
														{exp.user.name?.charAt(0) || "U"}
													</div>
													<span className="text-xs font-black uppercase tracking-tight italic">
														{exp.user.name}
													</span>
												</div>
											</div>
											<CommentsSection experienceId={exp.id} />
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
