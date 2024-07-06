import { useTeam } from "~/providers/TeamProvider";
import { ResultsTemplateRow } from "~/server/db/static";
import TableRow from "~/components/Owner/TableRow";

import { api } from "~/trpc/react";

export const comfyTable = "bg-accent m-4 whitespace-nowrap p-2 px-4";
const Owner = ({
  ownerTemplate,
  funnelId,
  slug,
}: {
  funnelId: number;
  ownerTemplate: { name: string; resultsTemplate: ResultsTemplateRow[] };
  slug: string;
}) => {
  const { teamId } = useTeam();
  const { data: headers } = api.funnelTemplate.getHeaders.useQuery({
    slug,
    teamId,
    headerIndex: 0,
  });
  if (!headers) return null;

  return (
    <div>
      The data within this table are just placeholders, once you have live data,
      we{`'`}ll use that.
      <table className="">
        <tr>
          <td></td>
          {headers.map((header) => (
            <td key={header.name}>
              <div className={comfyTable}>{header.name}</div>
            </td>
          ))}
        </tr>

        {ownerTemplate.resultsTemplate.map((row) => (
          <TableRow
            tableHeaders={headers.map((header) => header.name)}
            funnelId={funnelId}
            key={row.name}
            ownerTemplate={ownerTemplate}
            row={row}
          />
        ))}
      </table>
    </div>
  );
};

export default Owner;
