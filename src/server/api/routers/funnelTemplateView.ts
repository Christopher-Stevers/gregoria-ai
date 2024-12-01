import { string, z } from "zod";
import { createTRPCRouter, teamProcedure } from "../trpc";
import {
  funnelTemplateViewRows,
  funnelTemplateViews,
} from "~/server/db/schema";

export const funnelTemplateViewRouter = createTRPCRouter({
  createRow: teamProcedure
    .input(
      z.object({
        name: z.string(),
        funnelTemplateId: z.number(),
        rows: z.array(
          z.object({
            name: z.string(),
            function: z.string(),
            baseStep: z.string().optional(),
            firstStep: z.string().optional(),
            secondStep: z.string().optional(),
            stage: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const result = await db
        .insert(funnelTemplateViews)
        .values({
          slug: input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
          funnelTemplateId: input.funnelTemplateId,
          name: input.name,
        })
        .returning({ id: funnelTemplateViews.id })
        .execute();
      console.log(result[0]?.id);
      const rowsValues = input.rows.map((row, index) => {
        const viewId = result[0]?.id; // Store the id in a variable
        if (!viewId) throw new Error("Funnel template view ID is undefined"); // Handle the case where id is undefined

        return {
          funnelTemplateViewId: viewId,
          name: row.name,
          index: index,
        };
      });
      const rowResult = await db
        .insert(funnelTemplateViewRows)
        .values(rowsValues)
        .execute();
      console.log("input", input, result, rowResult);
    }),
});
