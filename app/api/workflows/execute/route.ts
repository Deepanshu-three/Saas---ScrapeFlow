import prisma from "@/lib/prisma";
import { ExectuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { CronExpressionParser } from 'cron-parser';


function validSecret(secret: string){
    const API_SEC = process.env.API_SECRET
    if(!API_SEC) return false;

    try {
        return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SEC))
    } catch (error) {
        return false
    }
}
export async function GET(req:Request) {
    const authHeader = req.headers.get("authorization")

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return Response.json({error: "unauthorize"}, {status : 401})
    }

    const secret = authHeader.split(" ")[1];

    if(!validSecret(secret)){
        return Response.json({error: "unauthorize"}, {status : 401})
    }

    const {searchParams} = new URL(req.url)

    const workflowId = searchParams.get("workflowId") as string;

    if(!workflowId){
        return Response.json({error: "bad request"}, {status : 401})
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
           id: workflowId
        }
    })

    if(!workflow){
        return Response.json({error: "bad request"}, {status: 401})
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan

    if(!executionPlan){
        return Response.json("bad request", {status: 400})
    }

    
    try {
        const cron = CronExpressionParser.parse(workflow.cron!, { tz: "UTC" });
        const nextRun = cron.next().toDate();
        const execution = await prisma.workflowExecution.create({
            data: {
                workflowId,
                userId: workflow.userId,
                defination: workflow.defination,
                status: WorkflowExecutionStatus.PENDING,
                startedAt: new Date(),
                trigger: WorkflowExecutionTrigger.CRON,
                phases: {
                    create: executionPlan.flatMap((phase) => {
                        return phase.nodes.flatMap((node) => {
                            return {
                                userId : workflow.userId,
                                status: ExecutionPhaseStatus.CREATED,
                                number: phase.phase,
                                node: JSON.stringify(node),
                                name: TaskRegistry[node.data.type].label
                            }
                        })
                    })
                },
            }
        })
    
        await ExectuteWorkflow(execution.id, nextRun)
        return new Response(null, {status: 200})

    } catch (error) {
        return Response.json({error: "Internal server error"}, {status: 500})
    }

    
}