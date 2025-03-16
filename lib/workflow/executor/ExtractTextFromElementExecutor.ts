import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtmlTask } from "../task/PageToHtml";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElementTask";
import * as cheerio from "cheerio"


export async function ExtractTextFromElementExecutor(
    environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean>{

    try {

        const selector = environment.getInput("Selector");

        if(!selector){
            environment.log.error("Selector not define")
            return false;
        }

        const html = environment.getInput("Html")

        if(!html){
            environment.log.error("Html is not define")
            return false;
        }

        const $ = cheerio.load(html)

        const element = $(selector)

        console.log("@@ELEMENT: ", element)

        if(!element){
            environment.log.error("Element not found")
            return false;
        }
        
        const extractedText = $.text(element)

        console.log("@@ELEMENT TEXT: ", extractedText)

        if(!extractedText){
            environment.log.error("Element has no text");
            return false;
        }

        environment.setOutputs("Extracted text", extractedText)

        return true

    } catch (error: any) {
        environment.log.error(error.message)
        return false;
    }

    console.log("running launch browser executor");
    return true;
}