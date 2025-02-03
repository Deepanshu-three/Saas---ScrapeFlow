"use server"
import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {workflowId: string, flowDefination?: string }) {

    const {userId} = await  auth();

    if(!userId){
        throw new Error("unauthenticated");
    }

    const {workflowId, flowDefination} = form;

    if(!workflowId) {
        throw new Error("WorkflowId is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    })

    if(!workflow){
        throw new Error("Workflow not found")
    }

    let executionPlan : WorkflowExecutionPlan;

    if(!flowDefination){
        throw new Error("flow defination is not define")
    }

    const flow = JSON.parse(flowDefination)

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if(result.error){
        throw new Error("execution plan is not valid");
    }

    if(!result.executionPlan){
        throw new Error("No execution plan generated");
    }

    executionPlan = result.executionPlan

    console.log("executionPlan" , executionPlan)
}