"use client";

import H3 from "~/components/base/h3";
import { Tab } from "@headlessui/react";

import Action from "../Action";
import type { TemplateStepType } from "~/server/db/static";
import { useFunnel } from "~/providers/MemberProvider";

const Step = ({
  templateStep,
  canHaveParent,
  parent,
}: {
  canHaveParent: boolean;
  templateStep: TemplateStepType;
  parent?: TemplateStepType;
}) => {
  const { isLive } = useFunnel();
  return (
    <div key={templateStep.name} className="bg-accent border-hot p-4">
      <div className="flex justify-between">
        <H3> {templateStep.name}</H3>
        {isLive && "Timescale: Week"}
      </div>
      <ul>
        <Tab.Group>
          <Tab.List>
            {templateStep.actionTemplates.map((templateAction) => {
              if (!templateAction) return null;

              return (
                <Tab
                  key={templateAction.name}
                  className="tab min-w-[32px] px-4"
                >
                  {templateAction.name}
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            {templateStep.actionTemplates.map((templateAction, index) => {
              const templateActionWithIndex = {
                ...templateAction,
                index,
              };
              if (!templateAction) return null;

              return (
                <Tab.Panel
                  className={"border-2 border-hot"}
                  key={templateAction.name}
                >
                  <Action
                    parent={parent}
                    templateStep={templateStep}
                    templateAction={templateActionWithIndex}
                    canHaveParent={canHaveParent}
                  />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </ul>
    </div>
  );
};

export default Step;
