import { useContext } from "react";
import { FlowValidationContext } from "../context/FlowValidationContext";

export default function useFlowValidation(){

    const context = useContext(FlowValidationContext)

    if(!context) throw new Error("useFlowValidation must be used withen a flowValidationContext")

    return context
}