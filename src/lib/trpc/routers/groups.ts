import { router, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { z } from "zod";

export const groupRouter = router({
	getMyGroups: protectedProcedure.query(async ({ ctx }) => {
		return await db.group.findMany({
			where: {
				members: {
					some: { userId: ctx.session.user.id },
				},
			},
			include: {
				_count: {
					select: { members: true, experiences: true },
				},
			},
		});
	}),

	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) throw new Error("Unauthorized");

			return await db.group.create({
				data: {
					name: input.name,
					description: input.description,
					createdById: userId,
					members: {
						create: {
							userId,
							role: "ADMIN",
						},
					},
				},
			});
		}),
});
