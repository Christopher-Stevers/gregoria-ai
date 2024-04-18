export const funnelTemplate = {
  type: "object",
  description:
    "A FunnelTemplateType object representing a structured funnel template.",
  properties: {
    id: {
      type: "string",
      description: "A unique identifier for the funnel template.",
    },
    steps: {
      type: "array",
      description:
        "An array of steps, each representing a stage in the funnel.",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "The name of the step, indicating the stage in the sales process.",
          },
          actionTemplates: {
            type: "array",
            description: "A list of actions associated with this step.",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the action.",
                },
                statusTemplates: {
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
              required: ["name", "statusTemplates"],
            },
          },
        },
        required: ["name", "actionTemplates"],
      },
    },
  },
  required: ["id", "steps"],
};
export const FunnelTemplateType = typeof funnelTemplate;
