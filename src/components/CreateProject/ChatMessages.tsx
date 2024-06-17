import type { ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import ChatMessage from "./ChatMessage";

const ChatMessages = ({ chatHistory }: { chatHistory: ChatMessageType[] }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {chatHistory.map((message) => {
        return <ChatMessage key={message.content.value} message={message} />;
      })}
    </div>
  );
};

export default ChatMessages;
