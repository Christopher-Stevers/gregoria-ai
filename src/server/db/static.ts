import type { Step } from "~/components/Member/Step/types";
import type { Status } from "~/components/Member/Action/types";
import { index } from "drizzle-orm/pg-core";

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

export type Funnel = Step[];
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
  statusTemplates: { name: string; id?: number; index?: number }[];
  index?: number;
  id?: number;
};
export type TemplateStepType = {
  name: string;
  actionTemplates: TemplateActionType[];
  index?: number;
  id?: number;
};
export type FunnelTemplateType = {
  stepTemplates: TemplateStepType[];
  index?: number;
  id?: number;
};



export type  ResultsTemplateRow={
  name: string;
  function: string;
  firstStep: string;
  secondStep: string;
}