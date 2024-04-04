"use client";

import { use, useEffect, useState } from "react";
import { StyledInput } from "~/components/base/input";
import H4 from "~/components/base/h4";
import { api } from "~/trpc/react";
import { type ChatMessage as ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import { getSession } from "next-auth/react";
import Member from "~/components/Member";
import {
  FunnelTemplateType,
  funnelTemplate as funnelTemplateInitial,
} from "~/server/db/funnel";

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

const ChatMessages = ({ chatHistory }: { chatHistory: ChatMessageType[] }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {chatHistory.map((message) => {
        return <ChatMessage key={message.content.value} message={message} />;
      })}
    </div>
  );
};

const CreateProject = () => {
  const [doOnce, setDoOnce] = useState(true);
  const [funnelTemplate, setFunnelTemplate] = useState<FunnelTemplateType>(
    funnelTemplateInitial,
  );
  const [promptText, setPromptText] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const { mutate } = api.ai.getText.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");
      if (data.content) {
        setThreadId(data.threadId);
        setChatHistory(data.content);
        if (data.newFunnelTemplate && data.newFunnelTemplate.steps.length > 0) {
          setFunnelTemplate(data.newFunnelTemplate);
        }
      }
    },
  });
  const setValue = (value: string) => {
    setPromptText(value);
  };
  const handleEnter = async (value: string) => {
    const user = await getSession();
    const name = user?.user?.name;
    const newChatHistory: ChatMessageType[] = [
      ...chatHistory,
      { content: { value }, role: "user" },
    ];
    setChatHistory(newChatHistory);
    mutate({
      prompt: value,
      threadId,
      userName: name ?? "",
      currentChatHistory: chatHistory,
    });

    setPromptText("");
  };
  useEffect(() => {
    if (doOnce) {
      getSession()
        .then((user) => {
          const userName = user?.user?.name ?? "";
          const value =
            "Can you help me create a marketing funnel based on my unique needs?";
          const newChatHistory: ChatMessageType[] = [
            { content: { value }, role: "user" },
            {
              content: {
                value:
                  "Sure, I can help with that Would you like to modify this template or start from scratch?",
              },
              role: "assistant",
            },
          ];
          setChatHistory(newChatHistory);
          setDoOnce(false);
        })
        .catch((err) => console.log(err));
    }
  }, [mutate, doOnce, setDoOnce, threadId]);
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

          <Member funnelTemplate={funnelTemplate} />
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
