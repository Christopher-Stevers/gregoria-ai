import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { and, count, eq, max, sql } from "drizzle-orm";
import {
  actionTemplates,
  statusTemplates,
  stepTemplates,
  statuses,
} from "~/server/db/schema";

export const ownerTemplateRouter = createTRPCRouter({
  getRow: teamProcedure
    .input(
      z.object({
        function: z.string(),
        teamId: z.number(),
        firstStep: z.string().optional(),
        secondStep: z.string().optional(),
        baseStep: z.string().optional(),
        funnelId: z.number(),
        headers: z.array(z.string()),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { db } = ctx;
      switch (input.function) {
        case "getTotalOfStepByResultsBase": {
          const optionalQueryByFirstStep =
            input.firstStep !== input.secondStep
              ? [eq(statuses.parentActionId, actionTemplates.id)]
              : [];

          const secondStep = await db
            .select({
              count: count(),
              actionTemplatesId: actionTemplates.id,
              stepTemplateId: stepTemplates.id,
              stepTemplates: stepTemplates.name,
              actionTemplates: actionTemplates.name,
              actionTemplateId: actionTemplates.id,

              statuses: count(statuses.statusTemplateId),
            })
            .from(stepTemplates)
            .leftJoin(
              actionTemplates,
              eq(stepTemplates.id, actionTemplates.stepTemplateId),
            )
            .leftJoin(
              statusTemplates,
              eq(actionTemplates.id, statusTemplates.actionTemplateId),
            )
            .leftJoin(
              statuses,
              eq(statuses.statusTemplateId, statusTemplates.id),
            )

            .where(
              and(
                eq(stepTemplates.name, input.secondStep!),
                eq(stepTemplates.funnelTemplateId, input.funnelId),
                ...optionalQueryByFirstStep,
              ),
            )
            .groupBy(
              actionTemplates.id,
              stepTemplates.id,
              stepTemplates.name,
              statusTemplates.id,
              actionTemplates.name,
            )
            .execute();
          console.log(secondStep, "secondStep");
          const results: Record<string, number> = {};
          secondStep.forEach((row) => {
            if (
              !results[row.actionTemplates!] ||
              results[row.actionTemplates!]! < row.statuses
            ) {
              results[row.actionTemplates!] = row.statuses;
            }
          });
          return input.headers.map((header) => {
            if (results[header]) {
              return results[header];
            }
            return 0;
          });
        }
      }
    }),
});
