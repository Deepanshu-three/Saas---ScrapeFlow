"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from 'cron-parser';
import { revalidatePath } from "next/cache";
export async function UpdateWorkflowCron({
    id,
    cron,
}: {
    id: string;
    cron: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("unauthenticated");

    try {
        const interval = CronExpressionParser.parse(cron, { tz: "UTC" });

        await prisma.workflow.update({
            where: {id, userId},
            data: {
                cron,
                nextRunAt: interval.next().toDate()
            }
        })

    } catch (error: any) {
        console.error("Invalid cron expression:", error);
        throw new Error("Invalid cron expression");
    }

    revalidatePath('/workflows')
}
