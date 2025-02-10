import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtmlTask } from "../task/PageToHtml";
export async function PageToHtmlExecutor(
    environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean>{

    try {

        const html = await environment.getPage()!.content();
        environment.setOutputs("Html", html)
        return true

    } catch (error) {
        console.error(error)
        return false;
    }

    console.log("running launch browser executor");
    return true;
}