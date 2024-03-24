import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import chatCompletion from "~/server/ai/helpers/chatCompletion";

export const aiRouter = createTRPCRouter({
  getText: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        threadId: z.string().optional(),
        runId: z.string().optional(),
        userName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { prompt, threadId, runId, userName } = input;
      const result = await chatCompletion({
        prompt,
        threadId,
        runId,
        userName,
      });

      return result;
    }),
});
