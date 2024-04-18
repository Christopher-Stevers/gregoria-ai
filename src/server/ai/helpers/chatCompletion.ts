import { type FunnelTemplateType } from "~/server/db/funnel";
import { openAiClient } from "./openAiClient";
import { sleep } from "~/lib/index";
import {
  type TextContentBlock,
  type MessagesPage,
  type Text,
} from "openai/resources/beta/threads/messages/messages.mjs";
import { FunnelTemplateTypeValidator } from "~/server/api/routers/ai";
import { funnelTemplate } from "./functionTemplate";
export type ChatMessage = {
  role: "user" | "assistant";
  content: Omit<Text, "annotations">;
};

const createChatCompletion = async ({
  prompt,
  threadId,
  runId,
  userName,
}: {
  prompt: string;
  threadId?: string;
  runId?: string;
  userName: string;
}) => {
  if (!threadId) {
    threadId = (await openAiClient.beta.threads.create()).id;
  }

  await openAiClient.beta.threads.messages.create(threadId, {
    role: "user",
    content: prompt,
  });
  if (!runId) {
    runId = (
      await openAiClient.beta.threads.runs.create(threadId, {
        assistant_id: "asst_PNVichBmkJNAGh4cyfCnvYdr",
        instructions: `This user wants to be a marketing guru, please address him as ${userName} make sure you call generate Funnel template one an only one time you recieve a message but but keep your replies short. In your first message produce this ${JSON.stringify(funnelTemplate)} as the funnel template. In your text replies try to elicit more information about the steps, actions and statuses your user wants if it makes sense in context`,
      })
    ).id;
  }
  let newFunnelTemplate: FunnelTemplateType | undefined;
  const generateFunnelTemplate = async (
    generatedFunnelTemplate: FunnelTemplateType,
  ) => {
    // check if the generated funnel template is the same type
    // as the original funnel template
    try {
      FunnelTemplateTypeValidator.parse(generatedFunnelTemplate);
      newFunnelTemplate = generatedFunnelTemplate;
      return JSON.stringify(generatedFunnelTemplate);
    } catch (e) {
      console.error(e);
      return "Funnel template type was invalid";
    }
  };

  const checkStatusAndPrintMessages = async (
    threadId: string,
    runId: string,
  ): Promise<MessagesPage> => {
    const runStatus = await openAiClient.beta.threads.runs.retrieve(
      threadId,
      runId,
    );
    if (runStatus.status === "completed") {
      const messages = await openAiClient.beta.threads.messages.list(threadId);

      return messages;
    } else if (runStatus.status === "requires_action") {
      const requiredAction =
        runStatus.required_action?.submit_tool_outputs.tool_calls;
      if (!requiredAction) throw new Error("No required action found");
      const toolsOutput = [];
      for (const action of requiredAction) {
        const funcName = action.function.name;
        const functionArguments = JSON.parse(
          action.function.arguments,
        ) as FunnelTemplateType;

        if (funcName === "generateFunnelTemplate") {
          const output = await generateFunnelTemplate(functionArguments);
          toolsOutput.push({
            tool_call_id: action.id,
            output: output,
          });
        }
      }

      await openAiClient.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: toolsOutput,
      });

      await sleep(1000);
      return await checkStatusAndPrintMessages(threadId, runId);
    } else {
      await sleep(1000);
      return await checkStatusAndPrintMessages(threadId, runId);
    }
  };
  const result = await checkStatusAndPrintMessages(threadId, runId);

  const content = result.data
    .map((message) => {
      return message.content
        .filter((value) => value.type === "text")
        .map((content) => {
          return {
            content: (content as TextContentBlock).text,
            role: message.role,
          };
        });
    })
    .flat() as ChatMessage[];
  return {
    newFunnelTemplate,
    threadId,
    content,
    runId,
  };
};

export default createChatCompletion;
