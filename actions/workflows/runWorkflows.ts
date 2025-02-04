"use server"
import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: { workflowId: string, flowDefination?: string }) {

    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    const { workflowId, flowDefination } = form;

    if (!workflowId) {
        throw new Error("WorkflowId is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    })

    if (!workflow) {
        throw new Error("Workflow not found")
    }

    let executionPlan: WorkflowExecutionPlan;

    if (!flowDefination) {
        throw new Error("flow defination is not define")
    }

    const flow = JSON.parse(flowDefination)

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
        throw new Error("execution plan is not valid");
    }

    if (!result.executionPlan) {
        throw new Error("No execution plan generated");
    }

    executionPlan = result.executionPlan

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            phase: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: WorkflowPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label
                        }
                    })
                })
            },
        },
        select: {
            id: true,
            phase: true
        }
    })

    if(!execution){
        throw new Error("Workflow execution not created")
    }
}