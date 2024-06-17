"use client";
import Step from "~/components/Member/Step";
import { type FunnelTemplateType } from "~/server/db/static";

const Member = ({ funnelTemplate }: { funnelTemplate: FunnelTemplateType }) => {
  return (
    <div className=" flex flex-col gap-8">
      {funnelTemplate.stepTemplates.map((templateStep, index) => {
        const canHaveParent = index !== 0;
        const parent = funnelTemplate.stepTemplates[0];
        const templateStepWithIndex = { ...templateStep, index };

        if (templateStep === undefined) return null;
        return (
          <div key={templateStep.name} className="bg-accent border-hot p-4">
            <ul>
              <Step
                canHaveParent={canHaveParent}
                templateStep={templateStepWithIndex}
                parent={parent}
              />
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Member;
