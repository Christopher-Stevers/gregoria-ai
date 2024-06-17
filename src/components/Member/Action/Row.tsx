import Cell from "./Cell";
import {
  funnel,
  type TemplateActionType,
  type TemplateStepType,
} from "~/server/db/static";

const Row = ({
  templateAction,
  templateStep,
  canHaveParent,
  parent,
}: {
  templateAction: TemplateActionType;
  templateStep: TemplateStepType;
  canHaveParent: boolean;
  parent?: TemplateStepType;
}) => {
  return (
    <tr>
      {templateAction.statusTemplates.map((templateStatus, index) => {
        const templateStatusWithIndex = { ...templateStatus, index };
        const key = `${templateStatus.name}${templateAction.name}header`;
        return (
          <Cell
            parent={parent}
            canHaveParent={canHaveParent}
            templateStatus={templateStatusWithIndex}
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
