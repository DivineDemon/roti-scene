import { router } from "../init";
import { experienceRouter } from "./experiences";
import { groupRouter } from "./groups";

export const appRouter = router({
	experiences: experienceRouter,
	groups: groupRouter,
});

export type AppRouter = typeof appRouter;
