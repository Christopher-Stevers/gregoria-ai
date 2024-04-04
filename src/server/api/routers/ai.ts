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
      const currentChatHistoryLength = input.currentChatHistory.length
    
      const result = await chatCompletion({
        prompt,
        threadId,
        runId,
        userName,
        
      });
const fullChatHistory = result.content
const fullChatHistoryLength = fullChatHistory.length+2
const newChatHistoryLength = fullChatHistoryLength - currentChatHistoryLength
console.log(newChatHistoryLength, fullChatHistory.length, "newChatHistoryLength")
const newChatHistory = (fullChatHistory.slice(0, newChatHistoryLength)).reverse()
console.log(newChatHistory, "newChatHistory")
      return {...result, content: [...input.currentChatHistory,...newChatHistory]};
    }),
});
