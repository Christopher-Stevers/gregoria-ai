import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { actionTemplates, funnelTemplates } from "~/server/db/schema";
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

export const funnelRouter = createTRPCRouter({
  get: teamProcedure
    .input(z.object({ teamId: z.number(), slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const funnel = await ctx.db.query.funnelTemplates.findFirst({
        where: and(
          eq(funnelTemplates.teamId, input.teamId),
          eq(funnelTemplates.slug, input.slug),
        ),
        with: {
          stepTemplates: {
            with: {
              actionTemplates: {
                with: {
                  statusTemplates: {
                    with: {
                      statuses: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return funnel;
    }),
});
