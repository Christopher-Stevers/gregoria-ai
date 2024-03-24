import type { Step } from "~/components/Member/Step/types";
import type { Status } from "~/components/Member/Action/types";

const ccStatuses = [
  { status: "initiated" },
  { status: "initiated" },
  { status: "dead line" },
  { status: "dead line" },
  { status: "hang up" },
  { status: "hang up" },
  { status: "deep conversation" },
  { status: "deep conversation" },
  { status: "deep conversation" },
];

const emailStatuses = [
  { status: "spam" },
  { status: "spam" },
  { status: "spam" },
  { status: "spam" },
  { status: "response" },
  { status: "Sales call booked" },
];

const linkedinStatuses = [
  { status: "no response" },
  { status: "no response" },
  { status: "no response" },
  { status: "no response" },

  { status: "conversation" },
  { status: "conversation" },
  { status: "conversation" },
  { status: "discovery call booked" },
  { status: "discovery call booked" },
];
const potentialParents = [
  { name: "cold call", timestamp: 1000000, statuses: ccStatuses },
  { name: "email", timestamp: 1000000, statuses: emailStatuses },
  { name: "linkedin dm", timestamp: 1000000, statuses: linkedinStatuses },
];
const discoveryStatuses = [
  { status: "Sales call booked", parent: potentialParents[0] },
  { status: "Sales call booked", parent: potentialParents[2] },
  { status: "Sales call booked", parent: potentialParents[2] },
  { status: "Reschedule", parent: potentialParents[1] },
  { status: "No Show", parent: potentialParents[2] },
  { status: "No Show", parent: potentialParents[0] },
];
const meetingStatuses = [
  { status: "Sales call booked", parent: potentialParents[2] },
  { status: "No Show", parent: potentialParents[2] },
  { status: "No Show", parent: potentialParents[2] },
  { status: "No Show", parent: potentialParents[0] },
];
const SalesStatuses = [
  {
    status: "Show",
    type: "Sale",
    granular: true,
    parent: potentialParents[0],
  },

  {
    status: "Cancelled",
    type: "Sale",
    granular: true,
    parent: potentialParents[1],
  },

  {
    status: "Reschedule",
    type: "Sale",
    granular: true,
    parent: potentialParents[2],
  },
  { status: "No Show", parent: potentialParents[0] },
];
const offerStatuses = [
  {
    status: "Close",
    intValue: 1000,
    type: "Sale",
    granular: true,
    parent: potentialParents[0],
  },
  {
    status: "Bounced on Price",
    intValue: 2000,
    type: "Sale",
    granular: true,
    parent: potentialParents[1],
  },
  {
    status: "Bounced on Terms",
    intValue: 5000,
    type: "Sale",
    granular: true,
    parent: potentialParents[2],
  },
];

export const actions = [
  { name: "cold call", timestamp: 1000000, statuses: ccStatuses },
  { name: "email", timestamp: 1000000, statuses: emailStatuses },
  { name: "linkedin dm", timestamp: 1000000, statuses: linkedinStatuses },
  { name: "discovery call", timestamp: 1000000, statuses: discoveryStatuses },
  { name: "meeting", timestamp: 1000000, statuses: meetingStatuses },
  { name: "Sale", timestamp: 1000000, statuses: SalesStatuses },
  { name: "Offer", timestamp: 1000000, statuses: offerStatuses },
];
export const steps = [
  { name: "Outreach", actions: [actions[0], actions[1], actions[2]] },
  { name: "Prospect", actions: [actions[3], actions[4]] },
  { name: "Sale", actions: [actions[5]] },
  { name: "Offer", actions: [actions[6]] },
];

type Funnel = Step[];
export const funnel: Funnel = [
  steps[0] as Step,
  steps[1] as Step,
  steps[2] as Step,
  steps[3] as Step,
];
const ccTemplateStatuses = [
  { name: "initiated" },
  { name: "dead line" },
  { name: "hang up" },
  { name: "deep conversation" },
];
const emailTemplateStatuses = [
  { name: "spam" },
  { name: "response" },
  { name: "Sales call booked" },
];
const linkedinTemplateStatuses = [
  { name: "no response" },
  { name: "conversation" },
  { name: "discovery call booked" },
];
const discoveryTemplateStatuses = [
  { name: "Sales call booked" },
  { name: "Reschedule" },
  { name: "No Show" },
];
const meetingTemplateStatuses = [
  { name: "Sales call booked" },
  { name: "No Show" },
];
const saleTemplateStatuses = [
  { name: "Show" },
  { name: "Cancelled" },
  { name: "Reschedule" },
  { name: "No Show" },
];
const offerTemplateStatuses = [
  { name: "Close", intValue: 1000 },
  { name: "Bounced on Price", intValue: 2000 },
  { name: "Bounced on Terms", intValue: 5000 },
];
const templateActions = [
  { name: "cold call", templateStatuses: ccTemplateStatuses },
  { name: "email", templateStatuses: emailTemplateStatuses },
  { name: "linkedin dm", templateStatuses: linkedinTemplateStatuses },
  { name: "discovery call", templateStatuses: discoveryTemplateStatuses },
  { name: "meeting", templateStatuses: meetingTemplateStatuses },
  { name: "Sale", templateStatuses: saleTemplateStatuses },
  { name: "Offer", templateStatuses: offerTemplateStatuses },
  ,
];
const templateSteps: TemplateStepType[] = [
  {
    name: "Outreach",
    templateActions: [
      templateActions[0] as TemplateActionType,
      templateActions[1] as TemplateActionType,
      templateActions[2] as TemplateActionType,
    ],
  },
  {
    name: "Prospect",
    templateActions: [
      templateActions[3] as TemplateActionType,
      templateActions[4] as TemplateActionType,
    ],
  },
  {
    name: "Sale",
    templateActions: [templateActions[5] as TemplateActionType],
  },

  {
    name: "Offer",
    templateActions: [templateActions[6] as TemplateActionType],
  },
];

export const funnelTemplate: FunnelTemplateType = {
  id: "funnel",
  steps: templateSteps,
};

export type TemplateActionType = {
  name: string;
  templateStatuses: { name: string }[];
};
export type TemplateStepType = {
  name: string;
  templateActions: TemplateActionType[];
};
export type FunnelTemplateType = {
  id: string;
  steps: TemplateStepType[];
};

const getActionCountWithCurrentBaseAction = (
  currentActionName: string,
  stepNum: number,
) => {
  console.log(funnelTemplate, "funnelTemplate");
  const discoveryActionsWithCurrentActionNameStatuses = funnel[
    stepNum
  ]!.actions.reduce((accum, action) => {
    if (stepNum === 0) {
      if (action.name === currentActionName) {
        return [...accum, ...action.statuses];
      } else return accum;
    } else {
      const filteredStatuses = action.statuses.filter((status: Status) => {
        return status?.parent?.name === currentActionName;
      });
      return [...accum, ...filteredStatuses];
    }
  }, [] as Status[]);

  return discoveryActionsWithCurrentActionNameStatuses.length;
};

export const getFunnelResults = (funnel: Funnel) => {
  const funnelHeaders = funnel[0]!.actions.map((step) => {
    return step.name;
  });
  const totalOutreach = {
    name: "Total Outreach",
    cells: funnelHeaders.map((elem) => {
      return getActionCountWithCurrentBaseAction(elem, 0);
    }),
  };
  const getStepVsStep = (
    funnel: Funnel,
    firstStep: number,
    secondStep: number,
  ) => {
    const result = funnelHeaders.map((elem) => {
      const secondStepActions = getActionCountWithCurrentBaseAction(
        elem,
        secondStep,
      );
      const firstStepActions = getActionCountWithCurrentBaseAction(
        elem,
        firstStep,
      );

      return (secondStepActions / firstStepActions) * 100;
    });
    return result;
  };

  const outVsDiscovery = {
    name: "Outreach vs Discovery",
    cells: getStepVsStep(funnel, 0, 1),
  };

  const discoveryCalls = {
    name: "Discovery Calls",
    cells: funnelHeaders.map((elem) => {
      const discoveryCalls = getActionCountWithCurrentBaseAction(elem, 1);

      return discoveryCalls;
    }),
  };

  const getStatusToProspectStages = (funnel: Funnel, stepNum: number) => {
    const statusesByPropsectStageWithCurrentParent = funnel[stepNum]?.actions
      .reduce(
        (accum, action) => {
          const localAccum = [...accum];
          action.statuses.forEach((status: Status) => {
            const accumIndex = localAccum.findIndex((elem) => {
              return elem.name === status.status;
            });
            if (accumIndex === -1) {
              localAccum.push({ name: status.status, statuses: [status] });
            } else {
              localAccum[accumIndex]?.statuses.push(status);
            }
          });
          return localAccum;
        },
        [] as { name: string; statuses: Status[] }[],
      )
      .map((elem) => {
        if (stepNum === 0) {
          console.log(elem, "local");
        }
        const cellsRaw = funnelHeaders.map((header) => {
          const statuses = elem.statuses.filter((status) => {
            const parentName = stepNum === 0 ? header : status?.parent?.name;
            return parentName === header;
          });
          return statuses.length;
        });
        const cellsPercentage = cellsRaw.map((cell, index) => {
          const currentAction = funnelHeaders[index];
          if (!currentAction) return 0;
          const currentActionCount = getActionCountWithCurrentBaseAction(
            currentAction,
            stepNum,
          );
          return (cell / currentActionCount) * 100;
        });
        const step = funnel[stepNum];
        if (!step) return [];
        const stepName = step.name;
        const result = [
          { name: `${stepName} ${elem.name}`, cells: cellsRaw },
          {
            name: `${stepName} ${elem.name}  Percentage`,
            cells: cellsPercentage,
          },
        ];
        return result;
      });
    return statusesByPropsectStageWithCurrentParent?.flat() ?? [];
  };

  const getCombinedPrice = (statuses: Status[]) => {
    return statuses.reduce((accum, totalPrice) => {
      if (totalPrice.intValue === undefined) return accum;
      return totalPrice.intValue + accum;
    }, 0);
  };

  const getPricePercentageByInStepByParent = (
    funnel: Funnel,
    stepNum: number,
  ) => {
    const totalPriceInStep = funnel[stepNum]?.actions.reduce(
      (accum, action) => {
        const combinedPrice = getCombinedPrice(action.statuses);
        return combinedPrice + accum;
      },
      0,
    );
    const result = funnelHeaders.map((header) => {
      const totalPriceInStepByParent = funnel[stepNum]?.actions.reduce(
        (accum, action) => {
          const filteredStatuses = action.statuses.filter((status) => {
            return status.parent?.name === header;
          });
          const combinedPrice = getCombinedPrice(filteredStatuses);
          return combinedPrice + accum;
        },
        0,
      );
      if (!totalPriceInStep || !totalPriceInStepByParent) return 0;

      return (totalPriceInStepByParent / totalPriceInStep) * 100;
    });
    console.log(result, "result");
    return {
      name: "Percentage of Cash Collected",
      cells: result,
    };
  };

  const funnelRows = [
    totalOutreach,
    outVsDiscovery,
    discoveryCalls,
    ...getStatusToProspectStages(funnel, 1),

    ...getStatusToProspectStages(funnel, 2),

    ...getStatusToProspectStages(funnel, 3),
    getPricePercentageByInStepByParent(funnel, 3),
  ];
  return { funnelHeaders, funnelRows };
};
