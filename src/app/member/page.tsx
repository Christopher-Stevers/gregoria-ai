"use client";
import Step from "~/components/Member/Step";
import { funnel, funnelTemplate } from "~/server/db/funnel";
import type { Step as StepType } from "~/components/Member/Step/types";

const Member = () => {
  return (
    <div className=" flex flex-col gap-8">
      {funnelTemplate.steps.map((templateStep, index) => {
        const stepLive = funnel.find(
          (funnelStep) => funnelStep.name === templateStep.name,
        );
        const canHaveParent = index !== 0;
        const parent = index === 0 ? {} : funnel[0];
        console.log(stepLive, funnel, templateStep, canHaveParent, parent);

        if (templateStep === undefined) return null;
        return (
          <div key={templateStep.name} className="bg-accent border-hot p-4">
            <ul>
              <Step
                canHaveParent={canHaveParent}
                templateStep={templateStep}
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
