"use client";

import { useState } from "react";
import { StyledInput } from "~/components/base/input";
import H4 from "~/components/base/h4";
import { api } from "~/trpc/react";
import { type ChatMessage as ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import { useSession } from "next-auth/react";

const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <div
      className={`bg-accent flex w-fit ${message.role === "system" ? "self-end" : "self-start"} gap-2 rounded-md p-2 px-4`}
    >
      <div>{message.content}</div>
    </div>
  );
};

const ChatMessages = ({ chatHistory }: { chatHistory: ChatMessageType[] }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {chatHistory.map((message) => {
        return <ChatMessage key={message.content} message={message} />;
      })}
    </div>
  );
};

const CreateProject = () => {
  const [promptText, setPromptText] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const { mutate } = api.ai.getText.useMutation({
    onSuccess: (data) => {
      console.log(data, "my data");
      setThreadId(data.threadId);
      setChatHistory([
        ...chatHistory,
        { content: data.content?.join("/n") ?? "", role: "system" },
      ]);
    },
  });
  const setValue = (value: string) => {
    setPromptText(value);
  };
  const handleEnter = (value: string) => {
    const newChatHistory: ChatMessageType[] = [
      ...chatHistory,
      { content: value, role: "user" },
    ];
    setChatHistory(newChatHistory);
    mutate({ prompt: value, threadId, userName: "dave" });
    setPromptText("");
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <p>Create Project: Step 1 configure member input</p>
        <p>
          Warning: this can not be undone once your team members have begun
          adding data
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-start-1 col-end-2">
          <H4>Chat</H4>
          <ChatMessages chatHistory={chatHistory} />
        </div>
        <div className="col-start-2 col-end-4 flex-1">
          <H4>Result</H4>
        </div>
      </div>
      <div className="fixed bottom-0 w-[calc(100%-144px)]  p-4">
        <StyledInput
          className="bg-accent w-full border-main text-text"
          value={promptText}
          setValue={setValue}
          onEnter={() => handleEnter(promptText)}
        />
      </div>
    </div>
  );
};

export default CreateProject;
