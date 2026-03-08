import { router, protectedProcedure, publicProcedure } from "../init";
import { db } from "@/lib/db";
import { z } from "zod";
import crypto from "node:crypto";

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

	getInviteInfo: publicProcedure
		.input(z.object({ token: z.string() }))
		.query(async ({ input }) => {
			const invite = await db.groupInvite.findUnique({
				where: { token: input.token },
				include: { group: { select: { name: true } } },
			});
			if (!invite) throw new Error("Invalid invite");
			return {
				groupId: invite.groupId,
				groupName: invite.group.name,
				isExpired: invite.expiresAt < new Date(),
			};
		}),

	createInvite: protectedProcedure
		.input(z.object({ groupId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) throw new Error("Unauthorized");

			// Ensure user is member of group
			const membership = await db.groupMember.findUnique({
				where: { userId_groupId: { userId, groupId: input.groupId } },
			});

			if (!membership) throw new Error("Not a member of this group");

			const token = crypto.randomBytes(32).toString("hex");

			return await db.groupInvite.create({
				data: {
					groupId: input.groupId,
					token,
					expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
				},
			});
		}),

	joinWithInvite: protectedProcedure
		.input(z.object({ token: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) throw new Error("Unauthorized");

			const invite = await db.groupInvite.findUnique({
				where: { token: input.token },
			});

			if (!invite) throw new Error("Invalid invite");
			if (invite.expiresAt < new Date()) throw new Error("Invite expired");

			const existingMember = await db.groupMember.findUnique({
				where: { userId_groupId: { userId, groupId: invite.groupId } },
			});

			if (existingMember) return { success: true, groupId: invite.groupId };

			await db.groupMember.create({
				data: {
					userId,
					groupId: invite.groupId,
					role: "MEMBER",
				},
			});

			return { success: true, groupId: invite.groupId };
		}),
});
