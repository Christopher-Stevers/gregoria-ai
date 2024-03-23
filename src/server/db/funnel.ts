import { type Step } from "~/components/Member/Step/types";
import { type Status } from "~/components/Member/Action/types";

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
    status: "completed",
    intValue: 5000,
    type: "Sale",
    granular: true,
    parent: potentialParents[0],
  },

  {
    status: "completed",
    intValue: 5000,
    type: "Sale",
    granular: true,
    parent: potentialParents[1],
  },

  {
    status: "completed",
    intValue: 5000,
    type: "Sale",
    granular: true,
    parent: potentialParents[2],
  },
  { status: "bounced on price", parent: potentialParents[0] },
];
export const actions = [
  { name: "cold call", timestamp: 1000000, statuses: ccStatuses },
  { name: "email", timestamp: 1000000, statuses: emailStatuses },
  { name: "linkedin dm", timestamp: 1000000, statuses: linkedinStatuses },
  { name: "discovery call", timestamp: 1000000, statuses: discoveryStatuses },
  { name: "meeting", timestamp: 1000000, statuses: meetingStatuses },
  { name: "Sale", timestamp: 1000000, statuses: SalesStatuses },
];
export const steps = [
  { name: "Outreach", actions: [actions[0], actions[1], actions[2]] },
  { name: "Prospect", actions: [actions[3], actions[4]] },
  { name: "Sale", actions: [actions[5]] },
];

type Funnel = Step[];
export const funnel: Funnel = [
  steps[0] as Step,
  steps[1] as Step,
  steps[2] as Step,
];

const getActionCountWithCurrentBaseAction = (
  currentActionName: string,
  stepNum: number,
) => {
  const discoveryActionsWithCurrentActionNameStatuses = funnel?.[
    stepNum
  ]?.actions.reduce((accum, action) => {
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
  }, []);
  return discoveryActionsWithCurrentActionNameStatuses.length;
};

export const getFunnelResults = (funnel: Funnel) => {
  const funnelHeaders = funnel[0]?.actions.map((step) => {
    return step.name;
  }) as string[];
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
const salesVsDiscovery = {
    name: "Sales vs Discovery",
    cells: getStepVsStep(funnel, 0, 2),
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
      .reduce((accum, action) => {
        const localAccum = [...accum];
        action.statuses.forEach((status: Status) => {
          const accumIndex = localAccum.findIndex((elem) => {
            return elem.name === status.status;
          });
          if (accumIndex === -1) {
            localAccum.push({ name: status.status, statuses: [status] });
          } else {
            localAccum[accumIndex].statuses.push(status);
          }
        });
        return localAccum;
      }, [])
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
          const currentActionCount = getActionCountWithCurrentBaseAction(
            currentAction,
            stepNum,
          );
          return (cell / currentActionCount) * 100;
        });
        const stepName = funnel[stepNum].name;
        const result = [
          { name: `${stepName} ${elem.name}`, cells: cellsRaw },
          {
            name: `${stepName} ${elem.name}  Percentage`,
            cells: cellsPercentage,
          },
        ];
        return result;
      });
    return statusesByPropsectStageWithCurrentParent.flat();
  };

  const funnelRows = [
    totalOutreach,
    outVsDiscovery,
    salesVsDiscovery,
    discoveryCalls,
    ...getStatusToProspectStages(funnel, 1),

    ...getStatusToProspectStages(funnel, 2),
  ];
  return { funnelHeaders, funnelRows };
};
