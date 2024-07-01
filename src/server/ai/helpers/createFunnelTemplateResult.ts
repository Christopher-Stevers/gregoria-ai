
const FUNCTION_NAMES = [
  "getTotalOfStepByResultsBase",
  "getStepVsStep",
  "getStatusTotalProspectStage",
  "getStatusPercentageOfStage"
]


export const createFunnelTemplateResult = ( firstSteps: string[], secondSteps: string[], baseSteps: string[], stages: string[])=>{
    return  {
        name: "createResultsTemplateRow",
        description: "create row for result table",
        parameters: {
          type: "object",
          description: "A result template object representing one row in a table of results of sales funnel.",
          properties: {
            name: {
              type: "string",
              description: "The name of the row",
            },
            function: {
              type: "string",
              description: "The name of the function",
              enum: FUNCTION_NAMES
            },
            stage: {
              type: "string",
              description: "The status we are looking up",
              enum: stages,
            },
            baseStep: {
              type: "string",
              description: "The base step of the funnel",
              enum:baseSteps
            },
            firstStep: {
              type: "string",
              enum: firstSteps,
              description: "The first step of the funnel"
            },
            secondStep: {
              type: "string",
              description: "The second step of the funnel to which we are comparing the first step",
              enum:secondSteps
            }
          },
          required: ["name", "function", "stage", "baseStep", "firstStep", "secondStep"]
        }
      };
      
}