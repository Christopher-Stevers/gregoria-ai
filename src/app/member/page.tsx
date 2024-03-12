"use client";
const actionProgress = ["planned", "failed", "succeeded"];

import H3 from "~/components/base/h3";
import { Tab } from "@headlessui/react";
import { StyledInput } from "~/components/base/input";
import { funnel } from "~/server/db/funnel";

const Member = () => {
  return (
    <div>
      {JSON.stringify(funnel)}

      {funnel.map((step) => {
        if (!step) return null;
        return (
          <div key={step.name} className="bg-accent border-hot p-4">
            <H3> {step.name}</H3>
            <ul>
              <Tab.Group>
                <Tab.List>
                  {step.actions.map((action) => {
                    if (!action) return null;

                    return (
                      <>
                        <Tab key={action.name} className="tab">
                          {action.name}
                        </Tab>
                      </>
                    );
                  })}

                  <Tab.Panels>
                    {step.actions.map((action) => {
                      if (!action) return null;

                      return (
                        <>
                          <Tab.Panel>
                            <div className="flex h-96 w-full ">
                              {actionProgress.map((progress) => {
                                return (
                                  <div
                                    key={progress}
                                    className="m-4 flex-1 rounded-md bg-white/10 p-4"
                                  >
                                    <H3>{progress}</H3>
                                    <StyledInput
                                      value={action[progress].toString()}
                                      setValue={(value) => {
                                        action[progress] = value;
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </Tab.Panel>
                        </>
                      );
                    })}
                  </Tab.Panels>
                </Tab.List>
              </Tab.Group>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Member;
