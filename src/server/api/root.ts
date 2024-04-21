import { createTRPCRouter } from "~/server/api/trpc";
import { teamRouter } from "./routers/team";
import { aiRouter } from "./routers/ai";
import { funnelTemplateRouter } from "./routers/funnelTemplate";
import { statusRouter } from "./routers/status";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  ai: aiRouter,
  funnelTemplate: funnelTemplateRouter,
  status: statusRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
