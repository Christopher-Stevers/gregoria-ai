import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import chatCompletion from "~/server/ai/helpers/chatCompletion";

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

export const aiRouter = createTRPCRouter({
  getText: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        threadId: z.string().optional(),
        runId: z.string().optional(),
        userName: z.string(),
        currentChatHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.object({
              value: z.string(),
            }),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { prompt, threadId, runId, userName } = input;
      const currentChatHistoryLength = input.currentChatHistory.length;

      const result = await chatCompletion({
        prompt,
        threadId,
        runId,
        userName,
      });
      const fullChatHistory = result.content;
      const fullChatHistoryLength = fullChatHistory.length + 2;
      const newChatHistoryLength =
        fullChatHistoryLength - currentChatHistoryLength;

      const newChatHistory = fullChatHistory
        .slice(0, newChatHistoryLength)
        .reverse();

      return {
        ...result,
        content: [...input.currentChatHistory, ...newChatHistory],
      };
    }),
});
