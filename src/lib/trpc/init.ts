import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/auth";

export const createTRPCContext = async () => {
	const session = await auth();
	return {
		session,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
	if (!opts.ctx.session || !opts.ctx.session.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return opts.next({
		ctx: {
			session: { ...opts.ctx.session, user: opts.ctx.session.user },
		},
	});
});
