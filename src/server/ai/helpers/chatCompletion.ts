import { type FunnelTemplateType } from "~/server/db/funnel";
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
    threadId = (await openAiClient.beta.threads.create()).id;
  

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
  let newFunnelTemplate: FunnelTemplateType = {} as  FunnelTemplateType;
  const generateFunnelTemplate = async (generatedFunnelTemplate: FunnelTemplateType) => {
    newFunnelTemplate = generatedFunnelTemplate;
    return generatedFunnelTemplate;
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
    } else if(runStatus.status === "requires_action"){
      const requiredAction = runStatus.required_action?.submit_tool_outputs.tool_calls
      if(!requiredAction) return null;
      const toolsOutput = []
for(const action of requiredAction){
  const funcName = action.function.name;
  const functionArguments = JSON.parse(action.function.arguments) as FunnelTemplateType
 
  if (funcName === "generateFunnelTemplate") {
    const output = await generateFunnelTemplate(functionArguments);
    toolsOutput.push({
        tool_call_id: action.id,
        output: JSON.stringify(output)  
    });
} 
}
      
await openAiClient.beta.threads.runs.submitToolOutputs(
  threadId,
  runId,
  { tool_outputs: toolsOutput}
);

    }
    else {
      await sleep(1000);
      await checkStatusAndPrintMessages(threadId, runId);
    }
  };
   const result = await checkStatusAndPrintMessages(threadId, runId)
   console.log(result, "end result")
  return {
    newFunnelTemplate,
    threadId,
    content: (result)?.data.map(
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
