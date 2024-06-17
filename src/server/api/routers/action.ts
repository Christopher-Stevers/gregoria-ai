import { statuses } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, teamProcedure } from "../trpc";
import { count } from "drizzle-orm";
import { funnel } from "~/server/db/static";

export const actionRouter = createTRPCRouter({
  getActionCountWithCurrentBaseAction: publicProcedure
    .input(
      z.object({
        baseActionName: z.string(),
        stepName: z.string(),
        funnelId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const actionCount = await ctx.db
        .select({ value: count() })
        .from(statuses)
        .execute();
      return actionCount[0]?.value ?? 0;
    }),

  getActionStatusCount: publicProcedure
    .input(
      z.object({
        funnelId: z.number(),
        firstStepName: z.string(),
        secondStepName: z.string(),
        statusName: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const actionCount = await ctx.db
        .select({ value: count() })
        .from(statuses)
        .execute();
      return actionCount.map((row) => row.value);
    }),
  getActionStatusPercentage: publicProcedure
    .input(
      z.object({
        funnelId: z.number(),
        firstStepName: z.string(),
        secondStepName: z.string(),
        statusName: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const actionCount = await ctx.db
        .select({ value: count() })
        .from(statuses)
        .execute();
      return actionCount.map((row) => row.value);
    }),
  getPricePercentageByInStepByParent: publicProcedure
    .input(
      z.object({
        funnelId: z.number(),
        firstStepName: z.string(),
        secondStepName: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const actionCount = await ctx.db
        .select({ value: count() })
        .from(statuses)
        .execute();
      return actionCount.map((row) => row.value);
    }),
});
