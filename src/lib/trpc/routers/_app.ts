import { router } from "../init";
import { experienceRouter } from "./experiences";
import { groupRouter } from "./groups";
import { commentRouter } from "./comments";
import { userRouter } from "./users";

export const appRouter = router({
	experiences: experienceRouter,
	groups: groupRouter,
	comments: commentRouter,
	users: userRouter,
});

export type AppRouter = typeof appRouter;
