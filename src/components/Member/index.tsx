"use client";

import H3 from "~/components/base/h3";
import { Tab } from "@headlessui/react";

import Action from "./Action";

const Step = ({
  step,
  canHaveParent,
}: {
  canHaveParent: boolean;
  step: {
    name: string;
    actions: (
      | {
          name: string;
          statuses: { status: string }[];
        }
      | undefined
    )[];
  };
}) => {
  return (
    <div key={step.name} className="bg-accent border-hot p-4">
      <div className="flex justify-between">
        <H3> {step.name}</H3>Timescale: Week
      </div>
      <ul>
        <Tab.Group>
          <Tab.List>
            {step.actions.map((action) => {
              if (!action) return null;

              return (
                <Tab key={action.name} className="tab min-w-[32px] px-4">
                  {action.name}
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            {step.actions.map((action) => {
              if (!action) return null;

              return (
                <Tab.Panel className={"border-2 border-hot"} key={action.name}>
                  <Action action={action} canHaveParent={canHaveParent} />
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
