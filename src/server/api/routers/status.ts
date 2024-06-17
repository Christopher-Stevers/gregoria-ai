import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { statuses } from "~/server/db/schema";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";

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

export const statusRouter = createTRPCRouter({
  create: teamProcedure
    .input(
      z.object({
        teamId: z.number(),
        userId: z.string(),
        statusTemplateId: z.number(),
        quantity: z.number().optional(),
        parentActionId: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const {
        quantity = 1,
        userId,
        teamId,
        statusTemplateId,
        parentActionId,
      } = input;
      const values = [];
      const baseValue = {
        userId,
        teamId,
        statusTemplateId,
        createdAt: new Date(),
        parentActionId,
      };
      console.log("bsvkend");
      if (quantity >= 1) {
        for (let i = 0; i < quantity; i++) {
          values.push(baseValue);
        }
        console.log(values);
        const result = await db
          .insert(statuses)
          .values(values)
          .returning({ id: statuses.id });

        console.log(result);
      }
      if (quantity < 0) {
        const toDelete = await db
          .select()
          .from(statuses)
          .where(eq(statuses.statusTemplateId, input.statusTemplateId))
          .limit(quantity * -1)
          .orderBy(desc(statuses.createdAt))
          .execute();
        console.log(toDelete);

        await db.delete(statuses).where(
          or(
            inArray(
              statuses.id,
              toDelete.map((d) => d.id),
            ),
          ),
        );
      }
      return "success";
    }),
  get: teamProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        teamId: z.number().optional(),
        statusTemplateId: z.number().optional(),
        isLive: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx: { db } }) => {
      if (!input.isLive) return 0;
      if (!input.userId || !input.teamId || !input.statusTemplateId)
        throw new Error("Missing required fields");
      const result = await db
        .select({ count: sql`COUNT(*)` })
        .from(statuses)
        .where(
          and(
            eq(statuses.userId, input.userId),
            eq(statuses.teamId, input.teamId),
            eq(statuses.statusTemplateId, input.statusTemplateId),
          ),
        )
        .execute();
      const resultParsed = parseInt(result?.[0]?.count as string);
      return resultParsed;
    }),
});
