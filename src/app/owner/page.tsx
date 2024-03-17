"use client";
import { getFunnelResults, funnel } from "../../server/db/funnel";

const Owner = () => {
  const { funnelHeaders, funnelRows } = getFunnelResults(funnel);
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
        {funnelRows.map((row, index) => {
          return (
            <tr key={index}>
              <td>{row.name}</td>
              {row.cells.map((cell, index) => {
                const key = `${cell.name}${index}ownerbody`;
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
