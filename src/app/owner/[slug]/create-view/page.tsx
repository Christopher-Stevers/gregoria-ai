"use client";

import { useEffect, useState } from "react";
import { StyledInput } from "~/components/base/input";
import { api } from "~/trpc/react";
import { type ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import { getSession } from "next-auth/react";
import SaveFunnel from "~/components/CreateProject/SaveFunnel";
import { useTeam } from "~/providers/TeamProvider";
import {
  ResultsTemplateRow,
  funnelTemplate as newFunctionTemplate,
  type FunnelTemplateType,
} from "~/server/db/static";
import TemplateCreator from "~/components/CreateProject/TemplateCreator";
import { Result } from "drizzle-orm/sqlite-core";
import OwnerProvider from "~/components/Owner/OwnerProvider";
import Owner from "~/components/Owner";
import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
/*
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
};*/

const CreateProject = ({ params: { slug } }: { params: { slug: string } }) => {
  const { teamId } = useTeam();
  const [viewName, setViewName] = useState("");

  const { data: funnelTemplate } = api.funnelTemplate.get.useQuery({
    teamId,
    slug,
    includeStatuses: true,
  });
  const [promptText, setPromptText] = useState("");
  const stage = "owner";

  const { data: teamFunnelCount } =
    api.funnelTemplate.getTeamFunnelCount.useQuery({ teamId });
  const [resultsTemplate, setResultsTemplate] = useState<
    ResultsTemplateRow[] | null
  >(null);
  const [funnelName, setFunnelName] = useState(
    teamFunnelCount !== undefined ? "loopy" : "",
  );
  useEffect(() => {
    const numCount = teamFunnelCount && parseInt(teamFunnelCount as string);

    if (typeof numCount === "number" && funnelName === "") {
      setFunnelName(`Funnel Template ${numCount + 1}`);
    }
  }, [teamFunnelCount, funnelName, setFunnelName]);

  const { mutate: generateOwnerTemplate } =
    api.ai.generateOwnerTemplateRow.useMutation({
      onSuccess: (data) => {
        setResultsTemplate(
          data.functionResponses as unknown as ResultsTemplateRow[],
        );
        console.log("results", data.functionResponses);
      },
    });

  const setValue = (value: string) => {
    setPromptText(value);
  };
  const handleEnter = async (value: string) => {
    if (funnelTemplate) {
      generateOwnerTemplate({
        memberTemplate: funnelTemplate,
        ownerTemplate: resultsTemplate,
        prompt: value,
      });
    }
  }; /*
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
  }, [ doOnce, setDoOnce, threadId]);*/
  const { mutate: createView } = api.funnelTemplateView.createRow.useMutation();
  const saveView = async () => {
    if (funnelTemplate && viewName && resultsTemplate) {
      createView({
        name: viewName,
        teamId: teamId,
        funnelTemplateId: funnelTemplate.id,
        rows: resultsTemplate.map((row) => ({
          name: row.name,
          function: row.function,
          baseStep: row.baseStep,
          firstStep: row.firstStep,
          secondStep: row.secondStep,
          stage: row.stage,
        })),
      });
    }
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <StyledInput
        className="bg-accent w-full border-main text-text"
        value={viewName}
        setValue={setViewName}
      />
      {funnelTemplate && resultsTemplate && stage === "owner" && (
        <OwnerProvider>
          <Owner
            funnelId={funnelTemplate.id}
            slug={slug}
            ownerTemplate={{ name: "default", resultsTemplate }}
          />
        </OwnerProvider>
      )}
      <div className="fixed bottom-0 flex w-[calc(100%-144px)] gap-4 p-4">
        <StyledInput
          className="bg-accent w-full border-main text-text"
          value={promptText}
          setValue={setValue}
          onEnter={() => handleEnter(promptText)}
        />
        <button onClick={saveView}>
          <FolderArrowDownIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
