import { openAiClient } from "./openAiClient";
import { sleep } from "~/lib/index";
export type ChatMessage = { role: "system" | "user"; content: string };

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
        instructions: `This user wants to be a marketing guru, please address him as ${userName}`,
      })
    ).id;
  }

  const checkStatusAndPrintMessages = async (
    threadId: string,
    runId: string,
  ) => {
    const runStatus = await openAiClient.beta.threads.runs.retrieve(
      threadId,
      runId,
    );
    if (runStatus.status === "completed") {
      const messages = await openAiClient.beta.threads.messages.list(threadId);

      return messages;
    } else {
      await sleep(5000);
    }
  };
  return {
    threadId,
    content: (await checkStatusAndPrintMessages(threadId, runId))?.data.map(
      (message) =>
        message.content
          .map((content) => {
            if (content.type === "text") return content.text;
            else return "";
          })
          .join(""),
    ),
    runId,
  };
};

export default createChatCompletion;
