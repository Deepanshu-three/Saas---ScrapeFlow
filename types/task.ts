export enum TaskType{
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENTS = "EXTRACT_TEXT_FROM_ELEMENTS", 
    FILL_INTPUT = "FILL_INPUT",
    CLICK_ELEMENT = "CLICK_ELEMENT",
    WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT"
}

export enum TaskParamType{
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    SELECT = "SELECT"
}

export interface TaskParams{
    name: string,
    type: TaskParamType,
    helperText?: string,
    required?: boolean,
    hideHandle?: boolean,
    value?:string,
    [key: string] : any
}