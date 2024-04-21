export const funnelTemplate = {
  type: "object",
  description:
    "A FunnelTemplateType object representing a structured funnel template.",
  properties: {
    id: {
      type: "string",
      description: "A unique identifier for the funnel template.",
    },
    templateSteps: {
      type: "array",
      description:
        "An array of steps, each representing a stage in a sales funnel. Usually begininning with some form of lead generation and ending with a sale.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "The name of the step, indicating the stage in the sales process.",
          },
          templateActions: {
            type: "array",
            description:
              "A list of approaches associated with this step, for example outreach could be email, social media, or some other form of communication.",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the action.",
                },
                templateStatuses: {
                  type: "array",
                  description:
                    "A list of statuses that can result from this action.",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "The name of the status.",
                      },
                    },
                    required: ["name"],
                  },
                },
              },
              required: ["name", "templateStatuses"],
            },
          },
        },
        required: ["name", "templateActions"],
      },
    },
  },
  required: ["id", "templateSteps"],
};
export const FunnelTemplateType = typeof funnelTemplate;
