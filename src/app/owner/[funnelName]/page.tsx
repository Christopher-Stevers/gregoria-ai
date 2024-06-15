"use server";
import { api } from "~/trpc/server";
import {
  getFunnelResults,
  FunnelResultsTemplate,
} from "../../../server/db/funnel";
import { funnel } from "~/server/db/static";

const Owner = async ({
  params: { funnelName },
}: {
  params: { funnelName: string };
}) => {
  const teamResponse = await api.team.getUserTeams.query(undefined);
  const teamId = teamResponse?.[0]?.team?.id as unknown as number;

  const { funnelHeaders, funnelRows } = await getFunnelResults(
    funnel,
    FunnelResultsTemplate,
    funnelName,
    teamId,
  );
  return (
    <table>
      <thead>
        <tr>
          <td></td>
          {funnelHeaders.map((header) => {
            const key = `${header}ownerheader`;
            return <th key={key}>{header}</th>;
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
                  return <td key={key}>{cell?.toFixed()}</td>;
                })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Owner;
