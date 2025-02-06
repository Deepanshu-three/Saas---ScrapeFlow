import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases"
import Topbar from "@/app/workflow/_components/topbar/Topbar"
import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"
import ExecutionViewer from "./_components/ExecutionViewer"

export default function ExectionViewerPage({params} :  {params:{
    executionId: string,
    workflowId: string
}}){
    return(
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Topbar 
                workflowId={params.workflowId}
                title="Workflow run detail"
                subTitle={`Run ID: ${params.executionId}`}
                hideButtons
            /> 
            <section className="flex h-full overflow-auto">
                <Suspense fallback = {
                    <div>
                        <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
                    </div>
                }>
                    <ExecutionFlowWrapper executionId={params.executionId} />
                </Suspense>
            </section>
        </div>
    )
}

async function ExecutionFlowWrapper({executionId} : {executionId: string}) {

    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId)

    if(!workflowExecution) <div>Not Found</div>

    return <ExecutionViewer initialData={workflowExecution} />

}