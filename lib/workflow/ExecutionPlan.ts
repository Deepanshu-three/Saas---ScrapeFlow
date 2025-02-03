import { AppNode, AppNodeMissingInputs } from "@/types/appNode"
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow"
import { Edge } from "@xyflow/react"
import { TaskRegistry } from "./task/registry"

export enum FlowToExecutionPlanValidationError{
    "NO_ENTRY_POINT",
    "INVALID_INPUTS"
}

type FlowToExecutionPlanType = {
    executionPlan? : WorkflowExecutionPlan;
    error? : {
        type: FlowToExecutionPlanValidationError;
        invalidElement? : AppNodeMissingInputs[]
    }
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType{
    
    const entryPoint = nodes.find(
        (node) => TaskRegistry[node.data.type].isEntryPoint
    )

    if(!entryPoint){
        return {
            error: {
                type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
            }
        }
    }

    const inputsWithError: AppNodeMissingInputs[] = [];

    
    const planned = new Set<string>();

    const invalidInputs = getInvalidInputs(entryPoint, edges, planned)
    
    if(invalidInputs.length > 0){
        inputsWithError.push({
            nodeId: entryPoint.id,
            inputs: invalidInputs
        })
    }

    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [entryPoint]
        }
    ];

    planned.add(entryPoint.id)

    for(let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++){
        const nextPhase: WorkflowExecutionPlanPhase = {phase, nodes: []};

        for(const currNode of nodes){
            if(planned.has(currNode.id)){
                //node already put in the execution
                continue;
            }

            const invalidInputs = getInvalidInputs(currNode, edges, planned);
            
            if(invalidInputs.length > 0){

                const incomers = getIncomers(currNode, nodes, edges);
                
                if(incomers.every((incomer) => planned.has(incomer.id))){

                    //if all incoming incomers/edges are planned and there are still invalid inputs
                    //these means that a perticular node has invalid inputs
                    //which means workflow is invalid
                    console.log("invalid input", currNode.id, invalidInputs)
                    inputsWithError.push({
                        nodeId: currNode.id,
                        inputs: invalidInputs
                    })

                }else{
                    continue;
                }
                
            }

            nextPhase.nodes.push(currNode)
        }
        for(const node of nextPhase.nodes){
            planned.add(node.id)
        } 
        executionPlan.push(nextPhase)
    }

    if(inputsWithError.length > 0){
        return {
            error: {
                type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
                invalidElement: inputsWithError
            }
        }
    }

    return {executionPlan}

}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>){

    const invalidInputs = [];

    const inputs = TaskRegistry[node.data.type].inputs

    for(const input of inputs){

        const inputValue = node.data.inputs[input.name]
        const inputVlaueProvided = inputValue?.length > 0;

        if(inputVlaueProvided){
            //if the input is fine then we can move on
            continue
        }

        //if the value not provided by the user we need to check
        //if there is an output linked to the current user
        const incomingEdges = edges.filter((edge) => edge.target === node.id)

        const inputLinkedToOutput = incomingEdges.find(
            (edge) => edge.targetHandle === input.name
        )

        const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source)

        if(requiredInputProvidedByVisitedOutput){
            //the input is required and we have a valid input for it
            //provided by the task that is already planned
            continue;
        }else if(!input.required){
            //the input is not required but there is output linked to it
            //we need to be sure that output is already planned for it
            if(!inputLinkedToOutput) continue;
            if(inputLinkedToOutput && planned.has(inputLinkedToOutput.source)){
                //the output is providing the value to the input: input is fine
                continue;
            }
        }

        invalidInputs.push(input.name)

    }

    return invalidInputs

}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]){
    if(!node.id){
        return [];
    }

    const incomersId = new Set();

    edges.forEach((edge) => {
        if(edge.target === node.id){
            incomersId.add(edge.source)
        }
    })

    return nodes.filter((n) => incomersId.has(n.id))
}