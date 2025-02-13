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
            console.error("Selector not define")
            return false;
        }

        const html = environment.getInput("Html")

        if(!html){
            console.error("Html is not define")
            return false;
        }

        const $ = cheerio.load(html)

        const element = $(selector)

        if(!element){
            console.error("Element not found")
            return false;
        }
        
        const extractedText = $.text(element)

        if(!extractedText){
            console.error("Element has no text");
            return false;
        }

        environment.setOutputs("Extracted text", extractedText)

        return true

    } catch (error) {
        console.error(error)
        return false;
    }

    console.log("running launch browser executor");
    return true;
}