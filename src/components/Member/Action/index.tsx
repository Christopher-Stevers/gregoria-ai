"use client";
import { capitalize, getUniqueArray } from "~/lib";
import type { Action as ActionType } from "./types";
import Row from "./Row";
import { Step } from "../Step/types";

const Action = ({
  action,
  canHaveParent,
  parent,
}: {
  canHaveParent: boolean;
  action: ActionType;
  parent?: Step;
}) => {
  const currentStatuses = action.statuses.map((statusObj) => {
    return statusObj.status;
  });

  const uniqueStatuses = getUniqueArray(currentStatuses);
  interface StatusObjType {
    status: string;
    intValue?: number;
  }
  const currentStats = action.statuses
    .filter((status) => {
      return status.granular && typeof status.intValue === "number";
    })
    .reduce(
      (accum: StatusObjType[], elem: { status: string; intValue?: number }) => {
        const currentStatusObj = accum.find(
          (value) => value.status === elem.status,
        );

        if (currentStatusObj) {
          const currentQuantity = currentStatusObj.intValue ?? 0;
          const newQuantity = currentQuantity + (elem.intValue ?? 0);
          return accum.map((elem) => {
            if (elem.status === currentStatusObj.status) {
              return { ...currentStatusObj, intValue: newQuantity };
            } else return elem;
          });
        }
        return [...accum, elem];
      },
      [] as StatusObjType[],
    );
  return (
    <table className=" w-full ">
      <thead>
        <tr>
          {uniqueStatuses.map((status) => {
            return (
              <th key={status} className=" flex-1 rounded-md p-2 text-left">
                {capitalize(status)}
              </th>
            );
          })}
          {currentStats.map((stat, index) => {
            const key = `${stat.status}${index}`;
            return (
              <th
                key={key}
                className="text-left"
              >{`${capitalize(stat.status)} ${capitalize(action.name)} Value`}</th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        <Row
          parent={parent}
          uniqueStatuses={uniqueStatuses}
          currentStats={currentStats}
          action={action}
          canHaveParent={canHaveParent}
        />
      </tbody>
    </table>
  );
};

export default Action;
