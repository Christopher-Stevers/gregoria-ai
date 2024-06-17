"use server";
import { api } from "~/trpc/server";
import {
  getFunnelResults,
  funnelResultsTemplate,
} from "../../../server/db/funnel";
import type { RouterOutputs } from "~/trpc/shared";
export type FetchedFunnel =
  | NonNullable<RouterOutputs["funnel"]["get"]>["stepTemplates"]
  | undefined;
const Owner = async ({ params: { slug } }: { params: { slug: string } }) => {
  const teamResponse = await api.team.getUserTeams.query(undefined);
  const teamId = teamResponse?.[0]?.team?.id as unknown as number;
  const funnel = await api.funnel.get.query({ teamId, slug });
  const { funnelHeaders, funnelRows } = await getFunnelResults(
    funnel?.id,
    funnelResultsTemplate,
    slug,
    teamId,
  );
  return (
    <table>
      <thead>
        <tr>
          <td></td>
          {funnelHeaders.map((header) => {
            const key = `${header}ownerheader`;
            return (
              <th key={key} className="px-4">
                {header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {funnelRows
          .filter((row) => {
            return row.hasOwnProperty("cells");
          })
          .map((row, index) => {
            return (
              <tr key={index}>
                <td>{row.name}</td>
                {row?.cells?.map((cell, index) => {
                  const key = `${row.name}${index}ownerbody`;
                  return (
                    <td className="px-4" key={key}>
                      {cell?.toFixed()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Owner;
