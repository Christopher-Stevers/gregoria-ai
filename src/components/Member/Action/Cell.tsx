import { useState } from "react";
import Input from "~/components/base/input";
import Dropdown from "./Dropdown";
import { type Step } from "../Step/types";
import {
  type TemplateActionType,
  type TemplateStepType,
  funnel,
} from "~/server/db/funnel";
type TemplateStatusType = TemplateActionType["statusTemplates"][0];

const Cell = ({
  templateStatus,
  templateAction,
  templateStep,
  canHaveParent,
  parent,
}: {
  templateStatus: TemplateStatusType;
  templateAction: TemplateActionType;
  templateStep: TemplateStepType;
  canHaveParent: boolean;
  parent?: Step;
}) => {
  const statusCount = funnel
    .find((funnelStep) => funnelStep.name === templateStep.name)
    ?.actions.find((funnelAction) => funnelAction.name === templateAction.name)
    ?.statuses.filter((status) => status.status === templateStatus.name).length;
  const [statefulCount, setStatefulCount] = useState(statusCount ?? 0);

  const handleOneUp = () => {
    if (!canHaveParent) {
      setStatefulCount((current) => current + 1);
    }
  };

  const items =
    parent?.actions?.map((action) => {
      return {
        name: action.name,
        onClick: () => {
          setStatefulCount((current) => current + 1);
        },
      };
    }) ?? [];

  return (
    <td
      key={templateStatus.name.concat("row")}
      className="  flex-1 rounded-md p-2"
    >
      <div className="relative flex gap-2">
        {canHaveParent ? (
          <Dropdown items={items}>
            <div className="bg-accent   h-6 w-6 border-2 border-main">
              <span className="relative -top-1"> +</span>
            </div>
          </Dropdown>
        ) : (
          <button
            onClick={handleOneUp}
            className="bg-accent   h-6 w-6 border-2 border-main"
          >
            <span className="relative -top-1"> +</span>
          </button>
        )}
        <Input
          className="w-12 bg-transparent"
          value={statefulCount.toString()}
          setValue={() => {
            return void 0;
          }}
        />
      </div>
    </td>
  );
};

export default Cell;
