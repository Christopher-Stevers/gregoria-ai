import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  actionTemplates,
  funnelTemplates,
  statusTemplates,
  stepTemplates,
} from "~/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

const TemplateActionType = z.object({
  name: z.string(),
  statusTemplates: z.array(z.object({ name: z.string() })),
});

const TemplateStepType = z.object({
  name: z.string(),
  actionTemplates: z.array(TemplateActionType),
});

export const FunnelTemplateTypeValidator = z.object({
  stepTemplates: z.array(TemplateStepType),
});

export const funnelTemplateRouter = createTRPCRouter({
  create: teamProcedure
    .input(
      z.object({
        teamId: z.number(),
        funnelTemplate: FunnelTemplateTypeValidator,
        creatorThreadId: z.string(),
        userId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // create funnel template

      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const [templateResult] = await ctx.db
        .insert(funnelTemplates)
        .values({
          teamId: input.teamId,
          creatorThreadId: input.creatorThreadId,
          userId: input.userId,
          name: input.name,
          slug,
        })
        .returning({ id: funnelTemplates.id })
        .execute();
      const funnelTemplateId = templateResult?.id;
      if (!funnelTemplateId) {
        throw new Error("Failed to create template");
      }
      const stepsValue = input.funnelTemplate.stepTemplates.map(
        (step, index) => {
          return {
            name: step.name,
            funnelTemplateId,
            index,
          };
        },
      );
      const stepsResult = await ctx.db
        .insert(stepTemplates)
        .values(stepsValue)
        .returning({ id: stepTemplates.id, name: stepTemplates.name })
        .execute();

      for (const step of input.funnelTemplate.stepTemplates) {
        const currentStepId = stepsResult.find(
          (stepResult) => stepResult.name === step.name,
        )?.id;
        if (!currentStepId) {
          throw new Error("Failed to create step");
        }
        const actionsValue = step.actionTemplates.map((action, index) => {
          return {
            name: action.name,
            stepTemplateId: currentStepId,
            index,
          };
        });
        const actionResults = await ctx.db
          .insert(actionTemplates)
          .values(actionsValue)
          .returning({ id: stepTemplates.id, name: stepTemplates.name })
          .execute();
        for (const action of step.actionTemplates) {
          const currentActionId = actionResults.find(
            (actionResult) => actionResult.name === action.name,
          )?.id;
          if (!currentActionId) {
            throw new Error("Failed to create action");
          }
          const statusValue = action.statusTemplates.map((status, index) => {
            return {
              actionTemplateId: currentActionId,
              trackedStep: step.name,
              name: status.name,
              index,
            };
          });
          await ctx.db.insert(statusTemplates).values(statusValue).execute();
        }
      }

      return "success";
    }),
  get: teamProcedure
    .input(
      z.object({
        slug: z.string(),
        teamId: z.number(),
        includeStatuses: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const includeStatusesObject = input.includeStatuses
        ? { with: { statuses: true } }
        : true;
      const result = await ctx.db.query.funnelTemplates
        .findFirst({
          with: {
            stepTemplates: {
              with: {
                actionTemplates: {
                  with: {
                    statusTemplates: includeStatusesObject as true,
                  },
                },
              },
            },
          },
          where: and(
            eq(funnelTemplates.slug, input.slug),
            eq(funnelTemplates.teamId, input.teamId),
          ),
        })
        .execute();
      return result;
    }),
  getHeaders: teamProcedure
    .input(
      z.object({
        slug: z.string(),
        teamId: z.number(),
        headerIndex: z.number(),
      }),
    )
    .query(async ({ input, ctx: { db } }) => {
      const queryResult = await db.query.funnelTemplates.findFirst({
        with: {
          stepTemplates: {
            where: eq(stepTemplates.index, input.headerIndex),
            with: {
              actionTemplates: true,
            },
          },
        },
        where: and(
          eq(funnelTemplates.slug, input.slug),
          eq(funnelTemplates.teamId, input.teamId),
        ),
      });

      return queryResult?.stepTemplates[0]?.actionTemplates;
    }),
  getTeamFunnelCount: teamProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ input, ctx: { db } }) => {
      const result = await db
        .select({ count: sql`COUNT(*)` })
        .from(funnelTemplates)
        .where(eq(funnelTemplates.teamId, input.teamId))
        .execute();
      return result?.[0]?.count ?? 0;
    }),

  getTeamFunnels: teamProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ input, ctx: { db } }) => {
      const result = await db
        .select({
          id: funnelTemplates.id,
          name: funnelTemplates.name,
          slug: funnelTemplates.slug,
        })
        .from(funnelTemplates)
        .where(eq(funnelTemplates.teamId, input.teamId))
        .execute();
      return result;
    }),
});
