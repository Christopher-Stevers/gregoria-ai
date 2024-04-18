import type { Step } from "~/components/Member/Step/types";
import type { Action, Status } from "~/components/Member/Action/types";

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
  { status: "sale booked" },
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
  { status: "sale booked", parent: potentialParents[0] },
  { status: "sale booked", parent: potentialParents[2] },
  { status: "sale booked", parent: potentialParents[2] },
  { status: "reschedule", parent: potentialParents[1] },
  { status: "no show", parent: potentialParents[2] },
  { status: "no show", parent: potentialParents[0] },
];
const meetingStatuses = [
  { status: "sale booked", parent: potentialParents[2] },
  { status: "no show", parent: potentialParents[2] },
  { status: "no show", parent: potentialParents[2] },
  { status: "no show", parent: potentialParents[0] },
];
const SalesStatuses = [
  {
    status: "show",
    type: "Sale",
    granular: true,
    parent: potentialParents[0],
  },

  {
    status: "no show",
    type: "Sale",
    granular: true,
    parent: potentialParents[1],
  },

  {
    status: "reschedule",
    type: "Sale",
    granular: true,
    parent: potentialParents[2],
  },
  { status: "no show", parent: potentialParents[0] },
];
const offerStatuses = [
  {
    status: "close",
    intValue: 1000,
    type: "Sale",
    granular: true,
    parent: potentialParents[0],
  },
  {
    status: "bounced on price",
    intValue: 2000,
    type: "Sale",
    granular: true,
    parent: potentialParents[1],
  },
  {
    status: "bounced on terms",
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
  { name: "outreach", actions: [actions[0], actions[1], actions[2]] },
  { name: "prospect", actions: [actions[3], actions[4]] },
  { name: "sale", actions: [actions[5]] },
  { name: "offer", actions: [actions[6]] },
];

type Funnel = Step[];
export const funnel: Funnel = [
  steps[0] as Step,
  steps[1] as Step,
  steps[2] as Step,
  steps[3] as Step,
];
const ccstatusTemplates = [
  { name: "initiated" },
  { name: "dead line" },
  { name: "hang up" },
  { name: "deep conversation" },
];
const emailstatusTemplates = [
  { name: "spam" },
  { name: "response" },
  { name: "sale booked" },
];
const linkedinstatusTemplates = [
  { name: "no response" },
  { name: "conversation" },
  { name: "discovery call booked" },
];
const discoverystatusTemplates = [
  { name: "sale booked" },
  { name: "reschedule" },
  { name: "no show" },
];
const meetingstatusTemplates = [{ name: "sale booked" }, { name: "no Show" }];
const salestatusTemplates = [
  { name: "show" },
  { name: "cancelled" },
  { name: "reschedule" },
  { name: "no show" },
];
const offerstatusTemplates = [
  { name: "Close", intValue: 1000 },
  { name: "bounced on price", intValue: 2000 },
  { name: "bounced on terms", intValue: 5000 },
];
const actionTemplates = [
  { name: "cold call", statusTemplates: ccstatusTemplates },
  { name: "email", statusTemplates: emailstatusTemplates },
  { name: "linkedin dm", statusTemplates: linkedinstatusTemplates },
  { name: "discovery call", statusTemplates: discoverystatusTemplates },
  { name: "meeting", statusTemplates: meetingstatusTemplates },
  { name: "Sale", statusTemplates: salestatusTemplates },
  { name: "Offer", statusTemplates: offerstatusTemplates },
];
const stepTemplates: TemplateStepType[] = [
  {
    name: "Outreach",
    actionTemplates: [
      actionTemplates[0] as TemplateActionType,
      actionTemplates[1] as TemplateActionType,
      actionTemplates[2] as TemplateActionType,
    ],
  },
  {
    name: "Prospect",
    actionTemplates: [
      actionTemplates[3] as TemplateActionType,
      actionTemplates[4] as TemplateActionType,
    ],
  },
  {
    name: "Sale",
    actionTemplates: [actionTemplates[5] as TemplateActionType],
  },

  {
    name: "Offer",
    actionTemplates: [actionTemplates[6] as TemplateActionType],
  },
];

export const funnelTemplate: FunnelTemplateType = {
  stepTemplates,
};

export type TemplateActionType = {
  name: string;
  statusTemplates: { name: string }[];
};
export type TemplateStepType = {
  name: string;
  actionTemplates: TemplateActionType[];
};
export type FunnelTemplateType = {
  stepTemplates: TemplateStepType[];
};

const getActionCountWithCurrentBaseAction = (
  funnel: Funnel,
  currentActionName: string,
  stepName: string,
) => {
  const step = funnel.find((step) => {
    return step.name === stepName;
  })!;
  const stepNum = funnel.findIndex((step) => {
    return step.name === stepName;
  });

  const discoveryActionsWithCurrentActionNameStatuses = step.actions.reduce(
    (accum, action) => {
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
    },
    [] as Status[],
  );

  return discoveryActionsWithCurrentActionNameStatuses.length;
};
const getFunnelHeaders = (funnel: Funnel, firstStepName: string) => {
  const step = funnel.find((step) => {
    return step.name === firstStepName;
  });
  if (!step) return [];
  return step.actions.map((action) => {
    return action.name;
  });
};
const getStepVsStep = (
  funnel: Funnel,
  baseStep: string,
  firstStep: string,
  secondStep: string,
) => {
  const funnelHeaders = getFunnelHeaders(funnel, baseStep);
  const result = funnelHeaders.map((elem) => {
    const secondStepActions = getActionCountWithCurrentBaseAction(
      funnel,
      elem,
      secondStep,
    );
    const firstStepActions = getActionCountWithCurrentBaseAction(
      funnel,
      elem,
      firstStep,
    );

    return (secondStepActions / firstStepActions) * 100;
  });
  return result;
};
/*
const totalOutreach = {
  name: "Total Outreach",
  cells: funnelHeaders.map((elem) => {
    return getActionCountWithCurrentBaseAction(funnel, elem, "prospect");
  }),
};
const outVsDiscovery = {
  name: "Outreach vs Discovery",
  cells: getStepVsStep(funnel, "outreach", 1),
};
const salesVsDiscovery = {
  name: "Sales vs Discovery",
  cells: getStepVsStep(funnel, 1, 2),
};

const discoveryCalls = {
  name: "Discovery Calls",
  cells: funnelHeaders.map((elem) => {
    const discoveryCalls = getActionCountWithCurrentBaseAction(
      funnel,
      elem,
      "prospect",
    );

    return discoveryCalls;
  }),
};

const getStatusToProspectStages = (funnel: Funnel, stepName: string) => {
  const currentStep = funnel.find((step) => {
    return step.name === stepName;
  });
  const stepNum = funnel.findIndex((step) => {
    return step.name === stepName;
  });
  const statuseOfCurrentStep = currentStep?.actions.reduce(
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
  );
  const statusesByPropsectStageWithCurrentParent = statuseOfCurrentStep.map(
    (elem) => {
      if (stepNum === resultsBase) {
      }
      const cellsRaw = funnelHeaders.map((header) => {
        const statuses = elem.statuses.filter((status) => {
          const parentName =
            stepNum === resultsBase ? header : status?.parent?.name;
          return parentName === header;
        });
        return statuses.length;
      });
      const cellsPercentage = cellsRaw.map((cell, index) => {
        const currentAction = funnelHeaders[index];
        if (!currentAction) return resultsBase;
        const currentActionCount = getActionCountWithCurrentBaseAction(
          funnel,
          currentAction,
          stepName,
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
    },
  );
  return statusesByPropsectStageWithCurrentParent?.flat() ?? [];
};
*/
const getTotalOfStepByResultsBase = (
  funnel: Funnel,
  firstStepName: string,
  secondStepName: string,
) => {
  const funnelHeaders = getFunnelHeaders(funnel, firstStepName);
  return funnelHeaders.map((elem) => {
    return getActionCountWithCurrentBaseAction(funnel, elem, secondStepName);
  });
};

export const FunnelResultsTemplate = [
  {
    name: "Total Outreach",
    function: "getTotalOfStepByResultsBase",
    firstStep: "outreach",
    secondStep: "outreach",
  },
  {
    name: "Outreach vs Prospects",
    function: "getStepVsStep",
    baseStep: "outreach",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "reschedule count",
    function: "getStatusTotalProspectStage",
    stage: "reschedule",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "reschedule rate",
    function: "getStatusPercentageOfStage",
    stage: "reschedule",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "no show count",
    function: "getStatusTotalProspectStage",
    stage: "reschedule",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "no show rate",
    function: "getStatusPercentageOfStage",
    stage: "no show",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "Sales call booked count",
    function: "getStatusTotalProspectStage",
    stage: "sale booked",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "sales call booked rate",
    function: "getStatusPercentageOfStage",
    stage: "sale booked",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "Total follow up",
    function: "getTotalOfStepByResultsBase",
    firstStep: "outreach",
    secondStep: "prospect",
  },
  {
    name: "Sales call no show count",
    function: "getStatusTotalProspectStage",
    stage: "no show",
    firstStep: "outreach",
    secondStep: "sale",
  },
  {
    name: "Sales call no show rate",
    function: "getStatusPercentageOfStage",
    stage: "no show",
    firstStep: "outreach",
    secondStep: "sale",
  },
  {
    name: "Sales call shows",
    function: "getStatusTotalProspectStage",
    stage: "show",
    firstStep: "outreach",
    secondStep: "sale",
  },
  {
    name: "Sales call show rate",
    function: "getStatusPercentageOfStage",
    stage: "show",
    firstStep: "outreach",
    secondStep: "sale",
  },
  {
    name: "Sales vs Outreach",
    function: "getStepVsStep",
    baseStep: "outreach",
    firstStep: "prospect",
    secondStep: "sale",
  },
  {
    name: "Offers bounced on price",
    function: "getStatusTotalProspectStage",
    stage: "bounced on price",
    firstStep: "outreach",
    secondStep: "offer",
  },
  {
    name: "Percent of offers bounced on price",
    function: "getStatusPercentageOfStage",
    stage: "bounced on price",
    firstStep: "outreach",
    secondStep: "offer",
  },
  {
    name: "Offers bounced on terms",
    function: "getStatusTotalProspectStage",
    stage: "bounced on terms",
    firstStep: "outreach",
    secondStep: "offer",
  },
  {
    name: "Percent of offers bounced on terms",
    function: "getStatusPercentageOfStage",
    stage: "bounced on terms",
    firstStep: "outreach",
    secondStep: "offer",
  },
  {
    name: "Offers closed",
    function: "getStatusTotalProspectStage",
    stage: "close",
    firstStep: "outreach",
    secondStep: "offer",
  },
  {
    name: "Percent of offers closed",
    function: "getStatusPercentageOfStage",
    stage: "close",
    firstStep: "outreach",
    secondStep: "offer",
  },
];

const getActionStatusCount = (
  funnel: Funnel,
  firstStepName: string,
  secondStepName: string,
  statusName: string,
) => {
  const baseStep = funnel.find((step) => step.name === firstStepName);
  const currentStep = funnel.find((step) => step.name === secondStepName)!;
  const currentStatuses = currentStep.actions
    .map((step) => {
      return step.statuses.filter((status) => status.status === statusName);
    })
    .flat();
  return baseStep?.actions.map((action) => {
    return currentStatuses.filter((status) => {
      return status.parent?.name === action.name;
    }).length;
  });
};

const getActionStatusPercentage = (
  funnel: Funnel,
  firstStepName: string,
  secondStepName: string,
  statusName: string,
) => {
  const baseStep = funnel.find((step) => step.name === firstStepName);
  const currentStep = funnel.find((step) => step.name === secondStepName)!;
  const currentStatuses = currentStep.actions
    .map((step) => {
      return step.statuses.filter((status) => status.status === statusName);
    })
    .flat();
  const allStatuses = currentStep.actions
    .map((action) => action.statuses)
    .flat();
  return baseStep?.actions.map((action) => {
    const currentStatusesOfAction = currentStatuses.filter((status) => {
      return status.parent?.name === action.name;
    }).length;
    const allStatusesOfAction = allStatuses.filter((status) => {
      return status.parent?.name === action.name;
    }).length;
    return (100 * currentStatusesOfAction) / allStatusesOfAction;
  });
};

export type funnelResultsTemplateType = typeof FunnelResultsTemplate;
const renderFunnelRow = (
  funnel: Funnel,
  FunnelRowTemplateItem: funnelResultsTemplateType[number],
) => {
  switch (FunnelRowTemplateItem.function) {
    case "getTotalOfStepByResultsBase":
      return getTotalOfStepByResultsBase(
        funnel,
        FunnelRowTemplateItem.firstStep,
        FunnelRowTemplateItem.secondStep,
      );
    case "getStepVsStep":
      return getStepVsStep(
        funnel,
        FunnelRowTemplateItem.baseStep!,
        FunnelRowTemplateItem.firstStep,
        FunnelRowTemplateItem.secondStep,
      );
    case "getStatusTotalProspectStage":
      return getActionStatusCount(
        funnel,
        FunnelRowTemplateItem.firstStep,
        FunnelRowTemplateItem.secondStep,
        FunnelRowTemplateItem.stage!,
      );
    case "getStatusPercentageOfStage":
      return getActionStatusPercentage(
        funnel,
        FunnelRowTemplateItem.firstStep,
        FunnelRowTemplateItem.secondStep,
        FunnelRowTemplateItem.stage!,
      );
    case "getPricePercentageByInStepByParent":
      return getPricePercentageByInStepByParent(
        funnel,
        FunnelRowTemplateItem.firstStep,
        FunnelRowTemplateItem.secondStep,
      );
  }
};

const renderFunnelRowWithName = (
  funnel: Funnel,
  funnelTemplateItem: funnelResultsTemplateType[number],
) => {
  const cells = renderFunnelRow(funnel, funnelTemplateItem);
  return { name: funnelTemplateItem.name, cells };
};
/*
const getFunnelResultsFromTemplate = (
  funnel: Funnel,
  FunnelResultsTemplate: funnelResultsTemplateType,
) => {
  const funnelResults = FunnelResultsTemplate;
};
*/

const getCombinedPrice = (statuses: Status[]) => {
  return statuses.reduce((accum, totalPrice) => {
    if (totalPrice.intValue === undefined) return accum;
    return totalPrice.intValue + accum;
  }, 0);
};

const getPricePercentageByInStepByParent = (
  funnel: Funnel,
  firstStepName: string,
  secondStepName: string,
) => {
  const targetStep = funnel.find((step) => step.name === secondStepName)!;
  const totalPriceInStep = targetStep?.actions.reduce((accum, action) => {
    const combinedPrice = getCombinedPrice(action.statuses);
    return combinedPrice + accum;
  }, 0);
  const funnelHeaders = getFunnelHeaders(funnel, firstStepName);
  const result = funnelHeaders.map((header) => {
    const totalPriceInStepByParent = targetStep.actions.reduce(
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
  return result;
};

export const getFunnelResults = (
  funnel: Funnel,
  FunnelResultsTemplate: funnelResultsTemplateType,
) => {
  const funnelHeaders = getFunnelHeaders(funnel, "outreach");
  const funnelRows = FunnelResultsTemplate.map((template) => {
    return renderFunnelRowWithName(funnel, template);
  });
  return { funnelHeaders, funnelRows };
};
