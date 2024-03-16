import type { Status } from "./types";
import Cell from "./Cell";
import { Step } from "../Step/types";

const Row = ({
  uniqueStatuses,
  currentStats,
  action,
  canHaveParent,
  parent,
}: {
  uniqueStatuses: string[];
  currentStats: Status[];
  action: { name: string; statuses: Status[] };
  canHaveParent: boolean;
  parent?: Step;
}) => {
  return (
    <tr>
      {uniqueStatuses.map((status) => {
        const key = `${status}${action.name}header`;
        return (
          <Cell
            parent={parent}
            canHaveParent={canHaveParent}
            status={status}
            key={key}
            action={action}
          />
        );
      })}
      {currentStats.map((stat, index) => {
        const key = `${stat.status}${index}body`;
        return (
          <td key={key}>
            <div>{stat.intValue}</div>
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
