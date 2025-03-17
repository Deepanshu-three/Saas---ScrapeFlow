"use client";

import { TaskParams, TaskParamType } from "@/types/task";
import StringParam from "./params/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import BrowserInstanceParam from "./params/BrowserInstanceParam";
import SelectParam from "./params/SelectParam";
import CredentialParam from "./params/CredentialParam";

function NodeParamField({
    param,
    nodeId,
    disabled,
}: {
    param: TaskParams;
    nodeId: string;
    disabled: boolean;
}) {
    const { updateNodeData, getNode } = useReactFlow();

    const node = getNode(nodeId) as AppNode;

    const value = node?.data.inputs?.[param.name];

    const updateNodeParamValue = useCallback(
        (newValue: string) => {
            updateNodeData(nodeId, {
                inputs: {
                    ...node?.data.inputs,
                    [param.name]: newValue,
                },
            });
        },
        [nodeId, updateNodeData, param.name, node?.data.inputs]
    );

    switch (param.type) {
        case TaskParamType.STRING:
            return (
                <StringParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );

        case TaskParamType.SELECT:
            return (
                <SelectParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );
        case TaskParamType.CREDENTIAL:
            return (
                <CredentialParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );

        case TaskParamType.BROWSER_INSTANCE:
            return (
                <BrowserInstanceParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                />
            );

        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">
                        Not implemented
                    </p>
                </div>
            );
    }
}

export default NodeParamField;
