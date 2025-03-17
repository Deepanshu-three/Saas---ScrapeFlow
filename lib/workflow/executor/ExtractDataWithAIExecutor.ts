import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWihtAiTask } from "../task/ExtractDataWithAi";
import prisma from "@/lib/prisma";
import { SymmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";

export async function ExtractDataWithAIExecutor(
    environment: ExecutionEnvironment<typeof ExtractDataWihtAiTask>
): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credential");
        if (!credentials) {
            environment.log.error("input->credentials not defined");
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("input->prompt not defined");
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("input->content not defined");
        }

        const credential = await prisma.credential.findUnique({
            where: {
                id: credentials,
            },
        });

        if (!credential) {
            environment.log.error("Credentials not found");
            return false;
        }

        const plainCredentialValue = SymmetricDecrypt(credential.value);

        if (!plainCredentialValue) {
            environment.log.error("cannot decrypt credential");
            return false;
        }

        const mockExtractedData = {
            usernameSelector: "#username",
            passwordSelector: "#password",
            loginSelector: "body > div > form > input.btn.btn-primary"
        }

        //CODE FOR OPENAI
        // const openai = new OpenAI({
        //     apiKey: plainCredentialValue,
        // });

        // const response = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         {
        //             role: "system",
        //             content:
        //                 "You are a webscraper helper that extracts data from html and texts. You will be given a piece of text or HTML content as an input and also the prompt with the data you want to extract. The response should always be only the extracted data as JSON array or object, without any words or explanation. Analyze the input carefully and extract data precisely based on the prompt. If no data is found return an empty JSON array. Work only with the provided content and ensure that output is alwaya a valid JSON array without any surrounding text",
        //         },
        //         {
        //             role: "user",
        //             content: content
        //         },
        //         {
        //             role: "user",
        //             content: prompt
        //         }
        //     ],
        //     temperature: 1
        // });

        // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
        // environment.log.info(`Completition tokens: ${response.usage?.completion_tokens}`)

        // const result = response.choices[0].message?.content

        // if(!result){
        //     environment.log.error("Empty response from AI");
        //     return false;
        // }


        environment.setOutputs("Extracted data",  JSON.stringify(mockExtractedData));
        return true;
        
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
