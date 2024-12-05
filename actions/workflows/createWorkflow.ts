'use server'

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";


export async function createWorkflow(form: createWorkflowSchemaType){

    const {success, data} = createWorkflowSchema.safeParse(form)
    if(!success){
        throw new Error("invalid form details")
    }

    const {userId} = await auth();

    if(!userId){
        throw new Error("unauthenticated")
    }

    const initialFlow:{ nodes: AppNode[], edges: Edge[]} = {
        nodes: [],
        edges: []
    }

    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER)) 

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            defination: JSON.stringify(initialFlow ),
            ...data,
        }
    })

    if(!result){
        throw new Error("Failed to create new workflow ")
    }

    redirect(`/workflow/editor/${result.id}`)
}