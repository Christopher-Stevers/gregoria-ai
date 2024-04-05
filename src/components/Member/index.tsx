"use client";
import Step from "~/components/Member/Step";
import { type FunnelTemplateType, funnel } from "~/server/db/funnel";
import type { Step as StepType } from "~/components/Member/Step/types";

const Member = ({ funnelTemplate }: { funnelTemplate: FunnelTemplateType }) => {
  return (
    <div className=" flex flex-col gap-8">
      {funnelTemplate.templateSteps.map((templateStep, index) => {
        const canHaveParent = index !== 0;
        const parent = index === 0 ? {} : funnel[0];

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
