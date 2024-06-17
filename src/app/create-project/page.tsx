"use client";

import { useEffect, useState } from "react";
import { StyledInput } from "~/components/base/input";
import { api } from "~/trpc/react";
import { type ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import { getSession } from "next-auth/react";
import SaveFunnel from "~/components/CreateProject/SaveFunnel";
import { useTeam } from "~/providers/TeamProvider";
import {
  funnelTemplate as newFunctionTemplate,
  type FunnelTemplateType,
} from "~/server/db/static";
import TemplateCreator from "~/components/CreateProject/TemplateCreator";

const StageSelector = ({
  setStage,
  stage,
}: {
  setStage: (value: "member" | "owner") => void;
  stage: "member" | "owner";
}) => {
  return (
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
      <StageSelector setStage={setStage} stage={stage} />
      <TemplateCreator
        stage={stage}
        setFunnelName={setFunnelName}
        chatHistory={chatHistory}
        funnelName={funnelName}
        funnelTemplate={funnelTemplate}
      />
      <div className="fixed bottom-0 flex w-[calc(100%-144px)] gap-4 p-4">
        <StyledInput
          className="bg-accent w-full border-main text-text"
          value={promptText}
          setValue={setValue}
          onEnter={() => handleEnter(promptText)}
        />
        {funnelTemplate && (
          <SaveFunnel
            funnelName={funnelName}
            threadId={threadId}
            funnelTemplate={funnelTemplate}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProject;
