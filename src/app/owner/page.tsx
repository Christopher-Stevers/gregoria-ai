"use client";
import {
  getFunnelResults,
  funnel,
  FunnelResultsTemplate,
} from "../../server/db/funnel";

const Owner = () => {
  const { funnelHeaders, funnelRows } = getFunnelResults(
    funnel,
    FunnelResultsTemplate,
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
