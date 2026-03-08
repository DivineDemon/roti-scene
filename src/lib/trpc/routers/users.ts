import { router, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { z } from "zod";

export const userRouter = router({
	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				image: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) throw new Error("Unauthorized");

			return await db.user.update({
				where: { id: userId },
				data: {
					name: input.name,
					image: input.image,
				},
			});
		}),
});
