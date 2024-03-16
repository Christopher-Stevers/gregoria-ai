const ccStatuses = [





    {status:"initiated"},
    {status:"initiated"},
    {status:"dead line"},
    {status:"dead line"},
    {status:"hang up"},
    {status:"hang up"},
    {status: "deep conversation"},
    {status: "deep conversation"},
    {status: "deep conversation"}
]

const emailStatuses = [{status: "spam"},{status: "spam"},{status: "spam"},{status: "spam"},
{status:"response"},{status:"Sales call booked"}]

const linkedinStatuses =[
    {status: "no response"},
    {status: "no response"},
    {status: "no response"},
    {status: "no response"},

    {status:"conversation"},
    {status:"conversation"},
    {status:"conversation"},
{status:"discovery call booked"},
{status:"discovery call booked"}]
const discoveryStatuses= [
    {status: "Sales call booked"},
    {status: "Sales call booked"},
    {status: "Sales call booked"},
    {status: "awaiting feedback"},

    {status:"awaiting feedback"},
    {status:"not interested"},
    {status:"not interested"},
{status:"discovery call booked"},
{status:"discovery call booked"}]
const SalesStatuses =[{status:"completed", intValue:5000, type:"Sale", granular:true
 },{ status:"bounced on price"},{status:"completed", intValue:5000, type:"Sale", granular:true
}]
export const actions = [

    {name:"cold call", timestamp: 1000000, statuses:ccStatuses},
    {name:"email", timestamp: 1000000, statuses:emailStatuses},
    {name: "linkedin dm", timestamp: 1000000,statuses:linkedinStatuses},
    {name:"discovery call", timestamp: 1000000, statuses:discoveryStatuses},
    {name: "meeting", timestamp: 1000000,statuses:emailStatuses},
    {name:"Sale", timestamp: 1000000, statuses:SalesStatuses}
]
export const steps=[
    {name:"Outreach",
actions: [actions[0],actions[1],actions[2]]
},
    {name:"Prospect", actions: [actions[3],actions[4]]},
    {name:"Sale", actions: [actions[5]]},
]

export const funnel = [steps[0],steps[1],steps[2]]
