"use client";
import { useState } from "react";
import Input from "~/components/base/input";
import { capitalize, getUniqueArray } from "~/lib";
import AddAction from "./AddAction";
export interface StatusObjType {
  status: string;
  intValue?: number;
  granular?: boolean;
}

export interface ActionObjType {
  name: string;
  statuses: StatusObjType[];
}
const Action = ({
  action,
  canHaveParent,
}: {
  canHaveParent: boolean;
  action: ActionObjType;
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
          <>
            {uniqueStatuses.map((status) => {
              return (
                <th key={status} className=" flex-1 rounded-md p-2 text-left">
                  {capitalize(status)}
                </th>
              );
            })}
            {currentStats.map((stat, index) => {
              return (
                <th
                  key={index}
                  className="text-left"
                >{`${capitalize(stat.status)} ${capitalize(action.name)} Value`}</th>
              );
            })}
          </>
        </tr>
      </thead>
      <tbody>
        <tr>
          <ActionRow
            uniqueStatuses={uniqueStatuses}
            currentStats={currentStats}
            action={action}
            canHaveParent={canHaveParent}
          />
        </tr>
      </tbody>
    </table>
  );
};

export const ActionCell = ({
  action,
  status,
  canHaveParent,
}: {
  action: ActionObjType;
  status: string;
  canHaveParent: boolean;
}) => {
  const statusCount = action.statuses.filter((innerStatusObj) => {
    return innerStatusObj.status === status;
  }).length;
  const [statefulCount, setStatefulCount] = useState(statusCount);
  const [showModal, setShowModal] = useState(false);
  const handleOneUp = () => {
    if (canHaveParent) {
      setShowModal(true);
    }
    setStatefulCount((current) => current + 1);
  };

  return (
    <td key={status.concat("row")} className="  flex-1 rounded-md p-2">
      <div className="relative flex gap-2">
        <button
          onClick={handleOneUp}
          className="bg-accent   h-6 w-6 border-2 border-main"
        >
          <span className="relative -top-1"> +</span>
        </button>
        <AddAction
          showModal={showModal}
          setShowModal={setShowModal}
          name={action.name}
        />
        <Input
          className="bg-transparent"
          value={statefulCount.toString()}
          setValue={() => {
            return void 0;
          }}
        />
      </div>
    </td>
  );
};

export const ActionRow = ({
  uniqueStatuses,
  currentStats,
  action,
  canHaveParent,
}: {
  uniqueStatuses: string[];
  currentStats: StatusObjType[];
  action: { name: string; statuses: StatusObjType[] };
  canHaveParent: boolean;
}) => {
  <div className=""></div>;

  return (
    <>
      {uniqueStatuses.map((status) => {
        return (
          <ActionCell
            canHaveParent={canHaveParent}
            status={status}
            key={action.name}
            action={action}
          />
        );
      })}
      {currentStats.map((stat, index) => {
        return (
          <td key={index}>
            <div>{stat.intValue}</div>
          </td>
        );
      })}
    </>
  );
};

export default Action;
