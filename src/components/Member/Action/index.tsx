"use client";
import { capitalize, getUniqueArray } from "~/lib";
import type { Action as ActionType } from "./types";
import Row from "./Row";
import type { Step } from "../Step/types";
import {
  funnel,
  type TemplateActionType,
  type TemplateStepType,
} from "~/server/db/funnel";

const Action = ({
  templateAction,
  templateStep,
  canHaveParent,
  parent,
}: {
  canHaveParent: boolean;
  templateAction: TemplateActionType;
  templateStep: TemplateStepType;
  parent?: Step;
}) => {
  return (
    <table className=" w-full ">
      <thead>
        <tr>
          {templateAction.templateStatuses.map((status) => {
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
