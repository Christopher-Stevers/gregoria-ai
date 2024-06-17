import { type ChatMessageType } from "~/server/ai/helpers/chatCompletion";
import type { FunnelTemplateType } from "~/server/db/static";
import { capitalize } from "~/lib";
import H4 from "~/components/base/h4";
import ChatMessages from "./ChatMessages";
import MemberProvider from "~/providers/MemberProvider";
import Member from "../Member";
import { StyledInput } from "../base/input";

const OwnerProvider = ({
  isLive,
  children,
}: {
  isLive: boolean;
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};
const Owner = ({ ownerTemplate }: { ownerTemplate: null }) => {
  return <div>Currently showing sample data</div>;
};
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

        {ownerTemplate == null && stage === "owner" && (
          <OwnerProvider isLive={false}>
            <Owner ownerTemplate={ownerTemplate} />
          </OwnerProvider>
        )}
      </div>
    </div>
  );
};

export default TemplateCreator;
