import { type ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import type { FunnelTemplateType } from "~/server/db/static";
import { capitalize } from "~/lib";
import H4 from "~/components/base/h4";
import ChatMessages from "./ChatMessages";
import MemberProvider from "~/providers/MemberProvider";
import Member from "../Member";
import { StyledInput } from "../base/input";
import OwnerProvider from "../Owner/OwnerProvider";
import Owner from "../Owner";

const TemplateCreator = ({
  funnelTemplate,
  chatHistory,
  setFunnelName,
  funnelName,
  stage,
}: {
  funnelTemplate: FunnelTemplateType | null;
  chatHistory: ChatMessageType[];
  stage: string;

  funnelName: string;
  setFunnelName: (value: string) => void;
}) => {
  const ownerTemplate = null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className=" col-start-1 col-end-2 max-h-[calc(100vh-250px)] overflow-y-scroll">
        <H4>Chat</H4>
        <ChatMessages chatHistory={chatHistory} />
      </div>
      <div className="col-start-2 col-end-4 max-h-[calc(100vh-250px)] flex-1 overflow-y-scroll">
        <H4>{capitalize(stage)} dashboard</H4>
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
  );
};

export default TemplateCreator;
