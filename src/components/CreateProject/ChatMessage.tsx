import type { ChatMessageType } from "~/server/ai/helpers/chatCompletion";

export type ChatMessage = {
  role: "user" | "assistant";
  content: Omit<Text, "annotations">;
};

const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <div
      className={`bg-accent flex w-fit ${message.role === "assistant" ? "self-end" : "self-start"} gap-2 rounded-md p-2 px-4`}
    >
      <div className="max-w-[300px] whitespace-pre-wrap ">
        {message.content.value}
      </div>
    </div>
  );
};

export default ChatMessage;
