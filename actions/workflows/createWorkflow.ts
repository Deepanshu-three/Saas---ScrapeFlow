'use server'

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function createWorkflow(form: createWorkflowSchemaType){

    const {success, data} = createWorkflowSchema.safeParse(form)
    if(!success){
        throw new Error("invalid form details")
    }

    const {userId} = await auth();

    if(!userId){
        throw new Error("unauthenticated")
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            defination: "TODO",
            ...data,
        }
    })

    if(!result){
        throw new Error("Failed to create new workflow ")
    }

    redirect(`/workflow/editor/${result.id}`)
}