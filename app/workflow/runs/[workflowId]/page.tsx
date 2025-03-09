import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionTable from "./_components/ExecutionTable";

export default function ExecutionPage({
    params,
}: {
    params: { workflowId: string };
}) {
    return (
        <div className="h-full w-full overflow-auto">
            <Topbar
                workflowId={params.workflowId}
                hideButtons
                title="All runs"
                subTitle="List of all your workflow"
            />
            <Suspense
                fallback={
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2Icon size={30} className="animate-spin stroke-primary" />
                    </div>
                }
            >
            <ExecutionTableWrapper workflowId={params.workflowId} />

            </Suspense>

        </div>
    );
}

async function ExecutionTableWrapper({workflowId} : {workflowId : string}){
    
    const execution = await GetWorkflowExecutions(workflowId)

    if(!execution) return <div>No data</div>

    if(execution.length === 0){
        return (
            <div className="container w-full py-6">
                <div className="flex items-center flex-col gap-2 justify-center h-full">
                    <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                        <InboxIcon size={40} className="stroke-primary" />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="font-bold">
                            No runs have been triggered yet for this workflow
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You can trigger a new run from the editor page
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return <div className="container w-full py-6">
        <ExecutionTable workflowId={workflowId} initialData={execution} />
    </div>
}