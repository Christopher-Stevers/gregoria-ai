import { ResultsTemplateRow } from "~/server/db/static";

const Owner = ({
  ownerTemplate,
}: {
  ownerTemplate: { name: string; resultsTemplate: ResultsTemplateRow[] };
}) => {
  return (
    <div>
      The data within this table are just placeholders, once you have live data,
      we{`'`}ll use that.
    </div>
  );
};

export default Owner;
