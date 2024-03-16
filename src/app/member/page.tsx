"use client";
import Step from "~/components/Member/Step";
import { funnel } from "~/server/db/funnel";
import { Step as StepType } from "~/components/Member/Step/types";

const Member = () => {
  return (
    <div className=" flex flex-col gap-8">
      {funnel.map((step, index) => {
        const canHaveParent = index !== 0;
        const parent = index === 0 ? {} : funnel[index - 1];
        if (step?.actions === undefined) return null;
        return (
          <div key={step.name} className="bg-accent border-hot p-4">
            <ul>
              <Step
                canHaveParent={canHaveParent}
                step={step}
                parent={parent as StepType}
              />
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Member;
