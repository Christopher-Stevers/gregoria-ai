import type { ResultsTemplateRow } from "~/server/db/static";
import { comfyTable } from ".";
import { api } from "~/trpc/react";
import { useTeam } from "~/providers/TeamProvider";

const TableRow = ({
  ownerTemplate,
  row,
  funnelId,
  tableHeaders,
}: {
  funnelId: number;
  ownerTemplate: { name: string; resultsTemplate: ResultsTemplateRow[] };
  row: ResultsTemplateRow;
  tableHeaders: string[];
}) => {
  const { teamId } = useTeam();
  const { data: viewableRow } = api.ownerTemplate.getRow.useQuery({
    funnelId,
    teamId,
    function: row.function,
    firstStep: row.firstStep,
    secondStep: row.secondStep,
    baseStep: row.baseStep,
    headers: tableHeaders,
  });
  console.log(row);

  console.log(viewableRow);
  return (
    <tr key={row.name}>
      <td className={comfyTable}>{row.name}</td>
      {viewableRow?.map((cell, index) => (
        <td key={index} className={comfyTable}>
          {cell}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
