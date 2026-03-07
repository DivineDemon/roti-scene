import { router, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { z } from "zod";

export const experienceRouter = router({
	getFeed: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		if (!userId) throw new Error("Unauthorized");

		return await db.experience.findMany({
			where: {
				OR: [
					{ userId },
					{
						group: {
							members: {
								some: { userId },
							},
						},
					},
				],
			},
			include: {
				restaurant: true,
				user: {
					select: { name: true, image: true },
				},
				group: {
					select: { name: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}),

	create: protectedProcedure
		.input(
			z.object({
				restaurantName: z.string(),
				cuisine: z.string().optional(),
				address: z.string().optional(),
				rating: z.number().min(1).max(5),
				review: z.string().optional(),
				groupId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) throw new Error("Unauthorized");

			// Find or create restaurant
			let restaurant = await db.restaurant.findFirst({
				where: { name: input.restaurantName },
			});

			if (!restaurant) {
				restaurant = await db.restaurant.create({
					data: {
						name: input.restaurantName,
						cuisine: input.cuisine,
						address: input.address,
						addedById: userId,
					},
				});
			}

			return await db.experience.create({
				data: {
					userId,
					restaurantId: restaurant.id,
					rating: input.rating,
					review: input.review,
					groupId: input.groupId,
				},
			});
		}),
});
