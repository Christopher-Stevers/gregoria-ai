import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import chatCompletion from "~/server/ai/helpers/chatCompletion";
import { createResultRow } from "~/server/ai/helpers/resultRowCreation";
import { runResultTemplateCompletion } from "~/server/ai/helpers/runResultTemplateCompletion";

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

export const ViewTemplateTypeValidator = z.array(
  z.object({
    name: z.string(),
    baseStep: z.string(),
    firstStep: z.string(),
    function: z.string(),
    secondStep: z.string(),
  }),
);

export const aiRouter = createTRPCRouter({
  generateMemberTemplate: protectedProcedure
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
      console.log(input, "my input");
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
  generateOwnerTemplateRow: protectedProcedure
    .input(
      z.object({
        memberTemplate: FunnelTemplateTypeValidator,
        ownerTemplate: ViewTemplateTypeValidator.nullable(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { memberTemplate, prompt } = input;
      const extendedPrompt = `Can you help my applicatoin create a marketing funnel view based on my unique needs as expressed here, ${prompt}, ${input.ownerTemplate && `this is what they currently have and probably want to extend it ${JSON.stringify(input.ownerTemplate)} Make the text portion of your reply as though you are replying to the users prompt: ${input.prompt}`}?`;
      const gptFunction = createResultRow(memberTemplate);
      const result = await runResultTemplateCompletion(
        gptFunction,
        extendedPrompt,
      );

      return result;
    }),
});
