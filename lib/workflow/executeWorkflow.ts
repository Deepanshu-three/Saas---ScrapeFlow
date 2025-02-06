import "server-only"
import prisma from "../prisma"
import { revalidatePath } from "next/cache"
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow"
import { waitFor } from "../helper/waitFor"
import { ExecutionPhase } from "@prisma/client"
import { AppNode } from "@/types/appNode"
import { TaskRegistry } from "./task/registry"
import { ExecutorRegistry } from "./executor/registry"

export async function ExectuteWorkflow(executionId : string){
    
    const execution = await prisma.workflowExecution.findUnique({
        where: {id : executionId},
        include: {workflow: true, phases : true}
    })

    if(!execution){
        throw new Error("Execution not found")
    }

    const environment = {phases: {}}


    await initializeWorkflowExecution(executionId, execution.workflowId);
     await initializePhaseStatuses(execution)


    let creditsConsumed = 0;
    let executionFailed = false
    for(const phase of execution.phases){
        //TODO credits consumed
        
        const phaseExecution = await executeWorkflowPhase(phase);
        if(!phaseExecution.success){
            executionFailed = true;
            break;
        }
    }
    
    await finalizeExectuionWorkflow(executionId, execution.workflowId, executionFailed, creditsConsumed)
    //TODO : cleanup the environment

    revalidatePath('/workflows/run')
}

async function initializeWorkflowExecution(executionId : string, workflowId : string){
 
    await prisma.workflowExecution.update({
        where: {id: executionId},
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    })
    await prisma.workflow.update({
        where:{
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId
        }
    })
}


async function initializePhaseStatuses(execution: any){
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phsae: any) => phsae.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }
    })
}

async function finalizeExectuionWorkflow(
    executionId:string,
    workflowId: string,
    executionFailed: boolean,
    creditsConsumed: number,
) {

    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED

    await prisma.workflowExecution.update({
        where: {id: executionId},
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed
        }
    })

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId
        },
        data: {
            lastRunStatus: finalStatus
        }
    }).catch((err) => {
        //ignore
        //this means that we have triggered other runs for this workflow
        //while an execution was running
    })

}

async function executeWorkflowPhase(phase: ExecutionPhase){

    const startedAt = new Date();

    const node = JSON.parse(phase.node) as AppNode

    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt
        }
    })

    const creditsRequired = TaskRegistry[node.data.type].credits

    console.log(`Executing phase ${phase.name} with ${creditsRequired} credits required`)

    //TODO decrement user balance (with required credits)

    //Execution phase simulation
    const success = await executePhase(phase, node);

    await  finalizePhase(phase.id, success)

    return {success}
}

async function finalizePhase(phaseId : string, success: boolean){
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completedAt: new Date()
        }
    })
}

async function executePhase(phsae:ExecutionPhase, node : AppNode): Promise<boolean> {
    
    const runFn = ExecutorRegistry[node.data.type];

    if(!runFn) return false;

    return await runFn();
}