import { type FunnelTemplateType } from "~/server/db/static";
import { createFunnelTemplateResult } from "./createFunnelTemplateResult";

export const createResultRow = (funnelTemplate:FunnelTemplateType

)=>{

    const stages = funnelTemplate.stepTemplates.map((step)=>{
        return step.actionTemplates.map((action)=>{
            return action.statusTemplates.map((status)=>{
                return status.name
            })
        })
    }).flat(3)


    const stepOptions = funnelTemplate.stepTemplates.map((step)=>{
        return step.name
    })




   return  createFunnelTemplateResult( stepOptions, stepOptions, stepOptions, stages)


}