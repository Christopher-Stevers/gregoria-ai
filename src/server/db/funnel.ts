export const actions = [

    {name:"cold call", timestamp: 1000000, planned:50, succeeded:50, failed:50},
    {name:"email", timestamp: 1000000, planned:50, succeeded:50, failed:50},
    {name: "linkedin dm", timestamp: 1000000, planned:50, succeeded:50, failed:50},
    {name: "meeting", timestamp: 1000000, planned:50, succeeded:50, failed:50},
    {name:"sales call", timestamp: 1000000, planned:50, succeeded:50, failed:50},
    {name:"sale", timestamp: 1000000, planned:50, succeeded:50, failed:50}
]
export const steps=[
    {name:"outreachg",
actions: [actions[0],actions[1],actions[2]]
},
    {name:"propspect", actions: [actions[3],actions[4]]},
    {name:"sale", actions: [actions[5]]},
]

export const funnel = [steps[0],steps[1],steps[2]]
