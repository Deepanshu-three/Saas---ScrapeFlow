import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";


export const ExtractTextFromElementTask = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENTS,
    label: "Extract text from element",
    icon: (props: LucideProps) => 
        <TextIcon className='stroke-red-400' {...props} />
    ,
    isEntryPoint: false,
    inputs: [
        {
            name: "Html",
            type: TaskParamType.STRING,
            required: true,
            varient: "textarea"
        },
        {
            name: "Selector ",
            type: TaskParamType.STRING,
            required: true,
        }
    ],
    outputs: [
        {
            name: "Extracted text",
            type: TaskParamType.STRING
        },
    ]
}   