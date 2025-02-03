import { cn } from "@/lib/utils"
import { TaskParams } from "@/types/task"
import { Handle, Position, useEdges } from "@xyflow/react"
import NodeParamField from "./NodeParamField"
import { ColorForHandle } from "./common"
import useFlowValidation from "@/components/hooks/useFlowValidation"

export function NodeInputs({children} : {children : React.ReactNode}){

    return (
        <div className="flex flex-col divide-y">{children}</div>
    ) 

}

export function NodeInput({input, nodeId} : {input: TaskParams, nodeId: string}){

    const {invalidInputs} = useFlowValidation()

    const edges = useEdges()

    const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name)

    const hasError = invalidInputs.find((node) => node.nodeId === nodeId)?.inputs.find((invalidInput) => invalidInput === input.name)

    return ( 
        <div className={cn(
            "flex justify-start relative p-3 bg-secondary w-full",
            hasError && "bg-destructive/30"
            )}>
            <NodeParamField param={input} nodeId={nodeId} disabled={isConnected}/>
            {!input.hideHandle && (
                <Handle 
                    id={input.name}
                    type="target"
                    isConnectable={!isConnected}
                    position={Position.Left}
                    className={cn(
                        "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
                        ColorForHandle[input.type]
                    )}
                />
            )}
        </div>
    )
}