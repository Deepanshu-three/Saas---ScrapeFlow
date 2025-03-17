import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon, MousePointerClick } from "lucide-react";

export const ExtractDataWihtAiTask = {
    type: TaskType.EXTRACT_DATA_WITH_AI,
    label: "Extract Data with AI",
    icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,
    isEntryPoint: false,
    credits: 4,
    inputs: [
        {
            name: "Content",
            type: TaskParamType.STRING,
            required: true,
            varient: "textarea",
        },
        {
            name: "Credential",
            type: TaskParamType.CREDENTIAL,
            required: true,
        },
        {
            name: "Prompt",
            type: TaskParamType.STRING,
            required: true,
            varient: "textarea",
        },
    ] as const,
    outputs: [
        {
            name: "Extracted data",
            type: TaskParamType.STRING,
        },
    ] as const,
} satisfies WorkflowTask;
