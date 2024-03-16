"use client";
import Step from "~/components/Member";
import { funnel } from "~/server/db/funnel";

const Member = () => {
  return (
    <div className=" flex flex-col gap-8">
      {funnel.map((step, index) => {
        const canHaveParent = index !== 0;
        if (step?.actions === undefined) return null;
        return (
          <div key={step.name} className="bg-accent border-hot p-4">
            <ul>
              <Step canHaveParent={canHaveParent} step={step} />
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Member;
