import {
  createTRPCRouter,
  protectedProcedure,
  teamProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import {
  actionTemplates,
  funnelTemplates,
  statusTemplates,
  stepTemplates,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

const TemplateActionType = z.object({
  name: z.string(),
  statusTemplates: z.array(z.object({ name: z.string() })),
});

const TemplateStepType = z.object({
  name: z.string(),
  templateActions: z.array(TemplateActionType),
});

export const FunnelTemplateTypeValidator = z.object({
  templateSteps: z.array(TemplateStepType),
});

export const funnelTemplateRouter = createTRPCRouter({
  create: teamProcedure
    .input(
      z.object({
        teamId: z.number(),
        funnelTemplate: FunnelTemplateTypeValidator,
        creatorThreadId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // create funnel template
      const [templateResult] = await ctx.db
        .insert(funnelTemplates)
        .values({
          teamId: input.teamId,
          creatorThreadId: input.creatorThreadId,
          userId: input.userId,
        })
        .returning({ id: funnelTemplates.id })
        .execute();
      const funnelTemplateId = templateResult?.id;
      if (!funnelTemplateId) {
        throw new Error("Failed to create template");
      }
      const stepsValue = input.funnelTemplate.templateSteps.map(
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

      for (const step of input.funnelTemplate.templateSteps) {
        const currentStepId = stepsResult.find(
          (stepResult) => stepResult.name === step.name,
        )?.id;
        if (!currentStepId) {
          throw new Error("Failed to create step");
        }
        const actionsValue = step.templateActions.map((action, index) => {
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
        for (const action of step.templateActions) {
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
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.db.query.funnelTemplates.findFirst({
        with: {
          stepTemplates: {
            with: {
              actionTemplates: {
                with: {
                  statusTemplates: true,
                },
              },
            },
          },
        },
      });
      return result;
    }),
});
