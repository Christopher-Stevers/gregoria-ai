import { OpenAI } from "openai";
import { env } from "~/env";

export const openAiClient = new OpenAI({
  apiKey: env.OPENAI_KEY,
});
