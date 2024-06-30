const createFunnelTemplateResult = ()=>{
    return  {
        name: "createResultsTemplateRow",
        description: "create row for result table",
        parameters: {
          type: "object",
          description: "A result object representing a one row in a table of results of sales funnel.",
          properties: {
            name: {
              type: "string",
              description: "The name of the row",
              enum: ["weather", "weather forecast"]
            },
            function: {
              type: "string",
              description: "The name of the function",
              enum: ["get_weather", "get_weather_forecast"]
            },
            stage: {
              type: "string",
              description: "The status we are looking up",
              enum: ["outreach", "follow up"]
            },
            baseStep: {
              type: "string",
              description: "The base step of the funnel",
              enum: ["outreach", "follow up"]
            },
            firstStep: {
              type: "string",
              enum: ["outreach", "follow up"],
              description: "The first step of the funnel"
            },
            secondStep: {
              type: "string",
              description: "The second step of the funnel",
              enum: ["outreach", "follow up"]
            }
          },
          required: ["name", "function", "stage", "baseStep", "firstStep", "secondStep"]
        }
      };
      
}