"use client";
import { capitalize } from "~/lib";
import Row from "./Row";
import {
  type TemplateActionType,
  type TemplateStepType,
} from "~/server/db/static";

const Action = ({
  templateAction,
  templateStep,
  canHaveParent,
  parent,
}: {
  canHaveParent: boolean;
  templateAction: TemplateActionType;
  templateStep: TemplateStepType;
  parent?: TemplateStepType;
}) => {
  return (
    <table className=" w-full ">
      <thead>
        <tr>
          {templateAction.statusTemplates.map((status) => {
            const statusName = status.name;
            return (
              <th key={statusName} className=" flex-1 rounded-md p-2 text-left">
                {capitalize(statusName)}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        <Row
          parent={parent}
          templateAction={templateAction}
          templateStep={templateStep}
          canHaveParent={canHaveParent}
        />
      </tbody>
    </table>
  );
};

export default Action;
