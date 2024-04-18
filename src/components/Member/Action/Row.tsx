import type { Status } from "./types";
import Cell from "./Cell";
import type { Step } from "../Step/types";
import {
  funnel,
  type TemplateActionType,
  type TemplateStepType,
} from "~/server/db/funnel";

const Row = ({
  templateAction,
  templateStep,

  canHaveParent,
  parent,
}: {
  templateAction: TemplateActionType;
  templateStep: TemplateStepType;
  canHaveParent: boolean;
  parent?: Step;
}) => {
  return (
    <tr>
      {templateAction.statusTemplates.map((templateStatus) => {
        const key = `${templateStatus.name}${templateAction.name}header`;
        return (
          <Cell
            parent={parent}
            canHaveParent={canHaveParent}
            templateStatus={templateStatus}
            templateAction={templateAction}
            templateStep={templateStep}
            key={key}
          />
        );
      })}
      {templateAction.statusTemplates.map((stat, index) => {
        const key = `${stat.name}${index}body`;
        const intValue = funnel
          .find((funnelStep) => funnelStep.name === templateStep.name)
          ?.actions.find(
            (funnelAction) => funnelAction.name === templateAction.name,
          )
          ?.statuses.find((status) => status.status === stat.name)?.intValue;
        return (
          <td key={key}>
            <div>{intValue}</div>
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
