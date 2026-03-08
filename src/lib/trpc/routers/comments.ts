import { router, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { z } from "zod";

export const commentRouter = router({
	getByExperienceId: protectedProcedure
		.input(z.object({ experienceId: z.string() }))
		.query(async ({ input }) => {
			return await db.experienceComment.findMany({
				where: { experienceId: input.experienceId },
				include: {
					user: {
						select: { name: true, image: true },
					},
				},
				orderBy: { createdAt: "asc" },
			});
		}),

	create: protectedProcedure
		.input(
			z.object({
				experienceId: z.string(),
				content: z.string().min(1),
				parentCommentId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) throw new Error("Unauthorized");

			return await db.experienceComment.create({
				data: {
					experienceId: input.experienceId,
					userId,
					content: input.content,
					parentCommentId: input.parentCommentId,
				},
			});
		}),
});
