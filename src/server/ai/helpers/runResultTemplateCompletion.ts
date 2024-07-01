    import { type ChatCompletionMessage, type ChatCompletionTool } from 'openai/resources/index.mjs';
import { openAiClient } from './openAiClient';
import { type ToolCall } from 'openai/resources/beta/threads/runs/steps.mjs';

    export const  runResultTemplateCompletion=async (data: { name: string } & object, prompt: string)=> {
        const functionResponses = []
      const messages: ChatCompletionMessage[] = [   
        { role: "assistant", content: `run ${data.name} based on ${prompt} immediately DO not ask for input` },
  
      ];
      const tools: ChatCompletionTool[] = [
        {
          type: "function",
          function: data,
        },
      ];

      const response = await openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        tools: tools,
        tool_choice: "auto", // auto is default, but we'll be explicit
      });


      
      const responseMessage = response?.choices?.[0]?.message;

      // Step 2: check if the model wanted to call a function
      const toolCalls = responseMessage?.tool_calls as (ToolCall & { function: { name: string, arguments: string}}) []
      if (responseMessage?.tool_calls) {
        // Step 3: call the function
        // Note: the JSON response may not always be valid; be sure to handle errors

        // only one function in this example, but you can have multiple
     //   messages.push(responseMessage); // extend conversation with assistant's reply

        for (const toolCall of toolCalls) {
            console.log(toolCall, " I am calling tool")
            if(toolCall.function){
          functionResponses.push(JSON.parse(toolCall.function.arguments))}
        // extend conversation with function response
        }
      }
      const input:ChatCompletionMessage[]= [   
        { role: "assistant", content: `summarize the funnel result template that you've returned, here's what its json looks like ${JSON.stringify(functionResponses)}` },
  
      ];  
      
      const secondResponse = await openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: input,
      });

      const secondResponseMessage = secondResponse.choices[0]?.message
      
        return {messages:[secondResponseMessage], functionResponses};
    }

