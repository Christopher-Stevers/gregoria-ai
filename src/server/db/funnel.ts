import type { Status } from "~/components/Member/Action/types";
import { api } from "~/trpc/server";
import { type Funnel } from "./static";
import type { FetchedFunnel } from "~/app/owner/[slug]/page";
/*
const getActionCountWithCurrentBaseAction = (
  funnelId: string,
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
};*/
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
  funnelId: number,
  funnelHeaders: string[],
  baseStep: string,
  firstStep: string,
  secondStep: string,
) => {
  const result = Promise.all(
    funnelHeaders.map(async (elem) => {
      const secondStepActions =
        await api.action.getActionCountWithCurrentBaseAction.query({
          funnelId,
          baseActionName: elem,
          stepName: secondStep,
        });
      const firstStepActions =
        await api.action.getActionCountWithCurrentBaseAction.query({
          funnelId,
          baseActionName: elem,
          stepName: firstStep,
        });

      return (secondStepActions / firstStepActions) * 100;
    }),
  );
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
const getTotalOfStepByResultsBase = async (
  funnelId: number,
  firstStepName: string,
  funnelHeaders: string[],
) => {
  return await Promise.all(
    funnelHeaders.map(async (elem) => {
      return api.action.getActionCountWithCurrentBaseAction.query({
        funnelId,
        baseActionName: elem,
        stepName: firstStepName,
      });
    }),
  );
};

export const funnelResultsTemplate = [
  {
    name: "Total Outreach",
    function: "getTotalOfStepByResultsBase",
    firstStep: "Lead Generation",
    secondStep: "Lead Generation",
  },
  {
    name: "Lead Generation vs Prospects",
    function: "getStepVsStep",
    baseStep: "Lead Generation",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "reschedule count",
    function: "getStatusTotalProspectStage",
    stage: "reschedule",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "reschedule rate",
    function: "getStatusPercentageOfStage",
    stage: "reschedule",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "no show count",
    function: "getStatusTotalProspectStage",
    stage: "reschedule",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "no show rate",
    function: "getStatusPercentageOfStage",
    stage: "no show",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "Sales call booked count",
    function: "getStatusTotalProspectStage",
    stage: "sale booked",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "sales call booked rate",
    function: "getStatusPercentageOfStage",
    stage: "sale booked",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "Total follow up",
    function: "getTotalOfStepByResultsBase",
    firstStep: "Lead Generation",
    secondStep: "prospect",
  },
  {
    name: "Sales call no show count",
    function: "getStatusTotalProspectStage",
    stage: "no show",
    firstStep: "Lead Generation",
    secondStep: "sale",
  },
  {
    name: "Sales call no show rate",
    function: "getStatusPercentageOfStage",
    stage: "no show",
    firstStep: "Lead Generation",
    secondStep: "sale",
  },
  {
    name: "Sales call shows",
    function: "getStatusTotalProspectStage",
    stage: "show",
    firstStep: "Lead Generation",
    secondStep: "sale",
  },
  {
    name: "Sales call show rate",
    function: "getStatusPercentageOfStage",
    stage: "show",
    firstStep: "Lead Generation",
    secondStep: "sale",
  },
  {
    name: "Sales vs Lead Generation",
    function: "getStepVsStep",
    baseStep: "Lead Generation",
    firstStep: "prospect",
    secondStep: "sale",
  },
  {
    name: "Offers bounced on price",
    function: "getStatusTotalProspectStage",
    stage: "bounced on price",
    firstStep: "Lead Generation",
    secondStep: "offer",
  },
  {
    name: "Percent of offers bounced on price",
    function: "getStatusPercentageOfStage",
    stage: "bounced on price",
    firstStep: "Lead Generation",
    secondStep: "offer",
  },
  {
    name: "Offers bounced on terms",
    function: "getStatusTotalProspectStage",
    stage: "bounced on terms",
    firstStep: "Lead Generation",
    secondStep: "offer",
  },
  {
    name: "Percent of offers bounced on terms",
    function: "getStatusPercentageOfStage",
    stage: "bounced on terms",
    firstStep: "Lead Generation",
    secondStep: "offer",
  },
  {
    name: "Offers closed",
    function: "getStatusTotalProspectStage",
    stage: "close",
    firstStep: "Lead Generation",
    secondStep: "offer",
  },
  {
    name: "Percent of offers closed",
    function: "getStatusPercentageOfStage",
    stage: "close",
    firstStep: "Lead Generation",
    secondStep: "offer",
  },
];
/*
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
*/

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

export type funnelResultsTemplateType = typeof funnelResultsTemplate;
const renderFunnelRow = async (
  funnelId: number,
  FunnelRowTemplateItem: funnelResultsTemplateType[number],
  funnelHeaders: string[],
) => {
  switch (FunnelRowTemplateItem.function) {
    case "getTotalOfStepByResultsBase":
      return getTotalOfStepByResultsBase(
        funnelId,
        FunnelRowTemplateItem.firstStep,
        funnelHeaders,
      );
    case "getStepVsStep":
      return getStepVsStep(
        funnelId,
        funnelHeaders,
        FunnelRowTemplateItem.baseStep!,
        FunnelRowTemplateItem.firstStep,
        FunnelRowTemplateItem.secondStep,
      );
    case "getStatusTotalProspectStage":
      return api.action.getActionStatusCount.query({
        funnelId,
        firstStepName: FunnelRowTemplateItem.firstStep,
        secondStepName: FunnelRowTemplateItem.secondStep,
        statusName: FunnelRowTemplateItem.stage!,
      });
    case "getStatusPercentageOfStage":
      return api.action.getActionStatusCount.query({
        funnelId,
        firstStepName: FunnelRowTemplateItem.firstStep,
        secondStepName: FunnelRowTemplateItem.secondStep,
        statusName: FunnelRowTemplateItem.stage!,
      });
    case "getPricePercentageByInStepByParent":
      return api.action.getPricePercentageByInStepByParent.query({
        funnelId,
        firstStepName: FunnelRowTemplateItem.firstStep,
        secondStepName: FunnelRowTemplateItem.secondStep,
      });
  }
};

const renderFunnelRowWithName = async (
  funnelId: number,
  funnelTemplateItem: funnelResultsTemplateType[number],
  funnelHeaders: string[],
) => {
  const cells = await renderFunnelRow(
    funnelId,
    funnelTemplateItem,
    funnelHeaders,
  );
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

export const getFunnelResults = async (
  funnelId: number | undefined,
  funnelResultsTemplate: funnelResultsTemplateType,
  slug: string,
  teamId: number,
) => {
  if (!funnelId) return { funnelHeaders: [], funnelRows: [] };
  const funnelTemplateHeaders = await api.funnelTemplate.getHeaders.query({
    slug,
    teamId,
    headerIndex: 0,
  });
  const funnelHeaders =
    funnelTemplateHeaders?.map((header) => {
      return header.name;
    }) ?? [];
  const funnelRows = await Promise.all(
    funnelResultsTemplate.map(async (template) => {
      return await renderFunnelRowWithName(funnelId, template, funnelHeaders);
    }),
  );
  return { funnelHeaders, funnelRows };
};
