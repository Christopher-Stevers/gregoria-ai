import { useState } from "react";
import { Action } from "./types";
import Input from "~/components/base/input";
import Dropdown from "./Dropdown";
import { Step } from "../Step/types";
import { DefaultViewBuilderCore } from "drizzle-orm/pg-core";

const Cell = ({
  action,
  status,
  canHaveParent,
  parent,
}: {
  action: Action;
  status: string;
  canHaveParent: boolean;
  parent?: Step;
}) => {
  const statusCount = action.statuses.filter((innerStatusObj) => {
    return innerStatusObj.status === status;
  }).length;
  const [statefulCount, setStatefulCount] = useState(statusCount);

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
    <td key={status.concat("row")} className="  flex-1 rounded-md p-2">
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

export default Cell;
