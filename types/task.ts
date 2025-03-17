export enum TaskType{
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENTS = "EXTRACT_TEXT_FROM_ELEMENTS", 
    FILL_INTPUT = "FILL_INPUT",
    CLICK_ELEMENT = "CLICK_ELEMENT",
    WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
    DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
    EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
    READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
    ADD_PROPERTY_TO_JSON = "ADD_PROPERTY_TO_JSON",
    NAVIGATE_URL = "NEVIGATE_URL",
    SCROLL_TO_ELEMENT = "SCROLL_TO_ELEMENT"
}

export enum TaskParamType{
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    SELECT = "SELECT",
    CREDENTIAL = "CREDENTIAL"
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