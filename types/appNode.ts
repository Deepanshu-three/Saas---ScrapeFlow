import { Node } from "@xyflow/react";
import { TaskParams, TaskType } from "./task";

export interface AppNodeData{
    type: TaskType;
    input: Record<string, string>;
    [key: string] : any;
}

export interface AppNode extends Node{
    data: AppNodeData;
}

export interface ParamProps{
    param: TaskParams,
    value: string,
    updateNodeParamValue: (newValue: string) => void,
    disabled?: boolean
}

export type AppNodeMissingInputs = {
    nodeId: string;
    inputs: string[];
}