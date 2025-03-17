import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElementTask";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FillInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebHookTask } from "./DiliverViaWebhook";
import { ExtractDataWihtAiTask } from "./ExtractDataWithAi";
import { ReadPropertyFromJsonTask } from "./ReadPropertyFromJson";
import { AddPropertyToJsonTask } from "./AddPropertyToJson";
import { NavigateUrlTask } from "./NavigateUrlTask";
import { ScrollToElementTask } from "./ScrollToELement";

type Registry = {
    [K in TaskType]: WorkflowTask & {type: K}; 
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENTS: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_VIA_WEBHOOK : DeliverViaWebHookTask,
    EXTRACT_DATA_WITH_AI : ExtractDataWihtAiTask,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
    ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
    NEVIGATE_URL: NavigateUrlTask,
    SCROLL_TO_ELEMENT: ScrollToElementTask
}