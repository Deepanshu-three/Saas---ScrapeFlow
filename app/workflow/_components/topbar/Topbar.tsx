"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";
import NavigationTabs from "./NavigationTabs";
import PublishBtn from "./PublishBtn";
import UnpublishBtn from "./UnpublishedBtn";

interface Props {
    title: string;
    subTitle?: string;
    workflowId: string;
    hideButtons?: boolean;
    isPublished?: boolean
}

function Topbar({ title, subTitle, workflowId, hideButtons = false , isPublished = false}: Props) {
    const router = useRouter();

    return (
        <header className="flex border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10">
            <div className="flex gap-1 flex-1">
                <TooltipWrapper content="back">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => router.back()}
                    >
                        <ChevronLeftIcon size={20} />
                    </Button>
                </TooltipWrapper>

                <div>
                    <p className="font-bold text-ellipsis truncate">{title}</p>
                    <div className="text-xs text-muted-foreground truncate">
                        {subTitle && (
                            <p className="text-xs text-muted-foreground text-ellipsis truncate">
                                {subTitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <NavigationTabs workflowId={workflowId} />

            <div className="flex gap-1 flex-1 justify-end">
                {!hideButtons && (
                    <>
                        <ExecuteBtn workflowId={workflowId} />
                        {isPublished && <UnpublishBtn workflowId={workflowId}/>}
                        {!isPublished && (
                            <>
                                <SaveBtn workflowId={workflowId} />
                                <PublishBtn workflowId={workflowId} />
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}

export default Topbar;
