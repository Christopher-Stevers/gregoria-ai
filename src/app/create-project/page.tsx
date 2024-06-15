"use client";

import { useEffect, useState } from "react";
import { StyledInput } from "~/components/base/input";
import H4 from "~/components/base/h4";
import { api } from "~/trpc/react";
import { type ChatMessage as ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import { getSession } from "next-auth/react";
import Member from "~/components/Member";
import { capitalize } from "~/lib";
import SaveFunnel from "~/components/CreateProject/SaveFunnel";
import { useTeam } from "~/providers/TeamProvider";
import {
  funnelTemplate as newFunctionTemplate,
  type FunnelTemplateType,
} from "~/server/db/static";
import MemberProvider from "~/providers/MemberProvider";

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
  const { teamId } = useTeam();
  const [doOnce, setDoOnce] = useState(true);
  const [funnelTemplate, setFunnelTemplate] =
    useState<FunnelTemplateType | null>(newFunctionTemplate);
  const [promptText, setPromptText] = useState("");
  const [stage, setStage] = useState<"member" | "owner">("member");
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const { data: teamFunnelCount } =
    api.funnelTemplate.getTeamFunnelCount.useQuery({ teamId });
  const [funnelName, setFunnelName] = useState(
    teamFunnelCount !== undefined ? "loopy" : "",
  );
  useEffect(() => {
    const numCount = teamFunnelCount && parseInt(teamFunnelCount as string);

    if (typeof numCount === "number" && funnelName === "") {
      setFunnelName(`Funnel Template ${numCount + 1}`);
    }
  }, [teamFunnelCount, funnelName, setFunnelName]);
  const { mutate } = api.ai.getText.useMutation({
    onSuccess: (data) => {
      if (data.content) {
        setThreadId(data.threadId);
        setChatHistory(data.content);
        if (
          data.newFunnelTemplate &&
          data.newFunnelTemplate?.stepTemplates.length > 0
        ) {
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
      const value =
        "Can you help me create a marketing funnel based on my unique needs?";
      const newChatHistory: ChatMessageType[] = [
        { content: { value }, role: "user" },
        {
          content: {
            value:
              "Sure, I can help with that Would you like to start with our template or start from scratch?",
          },
          role: "assistant",
        },
      ];
      setChatHistory(newChatHistory);
      setDoOnce(false);
    }
  }, [mutate, doOnce, setDoOnce, threadId]);
  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <div className="flex justify-between">
          <button
            className={`bg-accent border-2 ${stage === "member" ? "border-hot" : "border-main"} px-4 py-2`}
            onClick={() => setStage("member")}
          >
            Stage 1 configure member input
          </button>
          <button
            className={`bg-accent border-2 ${stage === "owner" ? "border-hot" : "border-main"} px-4 py-2`}
            onClick={() => setStage("owner")}
          >
            Stage 2 configure owner dashboard
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-start-1 col-end-2 max-h-[calc(100vh-250px)] overflow-y-scroll">
          <H4>Chat</H4>
          <ChatMessages chatHistory={chatHistory} />
        </div>
        <div className="col-start-2 col-end-4 max-h-[calc(100vh-250px)] flex-1 overflow-y-scroll">
          <H4>{capitalize(stage)} interface</H4>
          <div>
            <StyledInput
              className="bg-accent w-full border-main text-text"
              setValue={setFunnelName}
              value={funnelName}
              placeholder={"Funnel Name"}
            />
          </div>

          {funnelTemplate !== null && stage === "member" && (
            <MemberProvider isLive={false}>
              <Member funnelTemplate={funnelTemplate} />
            </MemberProvider>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 flex w-[calc(100%-144px)] gap-4 p-4">
        <StyledInput
          className="bg-accent w-full border-main text-text"
          value={promptText}
          setValue={setValue}
          onEnter={() => handleEnter(promptText)}
        />
        <SaveFunnel
          funnelName={funnelName}
          threadId={threadId}
          funnelTemplate={funnelTemplate}
        />
      </div>
    </div>
  );
};

export default CreateProject;
