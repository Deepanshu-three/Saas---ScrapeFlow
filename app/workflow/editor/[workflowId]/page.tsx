import prisma from '@/lib/prisma';
import React from 'react'
import Editor from '../../_components/Editor';
import { auth } from '@clerk/nextjs/server';

const page = async({params} : {params : {workflowId : string}}) => {
    
    const { userId } = await auth();    

    if(!userId) return <div>unautharise</div>

    const {workflowId} = params;

    const workflow = await prisma.workflow.findUnique({
        where: {
            id : workflowId,
            userId,
        }
    })

    if(!workflow) return <div>Workflow not found</div>

    return (
        <Editor workflow={workflow} />
    )
}

export default page