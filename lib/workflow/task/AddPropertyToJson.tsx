import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {  DatabaseIcon, FileJson2Icon, MousePointerClick  } from "lucide-react";


export const AddPropertyToJsonTask = {
    type: TaskType.ADD_PROPERTY_TO_JSON,
    label: "Add property from JSON",
    icon: (props) => 
        <DatabaseIcon className='stroke-orange-400' {...props} />
    ,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "JSON",
            type: TaskParamType.STRING,
            required: true,
            varient: "textarea"
        },
        {
            name: "Property name",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Property value",
            type: TaskParamType.STRING,
            required: true,
        }
    ] as const,
    outputs: [
        {
            name: "Updated JSON",
            type: TaskParamType.STRING
        },
    ] as const
}   satisfies WorkflowTask