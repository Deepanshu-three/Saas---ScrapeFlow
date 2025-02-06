import { ExecutionPhase } from "@prisma/client";

type Phase = Pick<ExecutionPhase, "creditsConsumed">

export function GetPhasesTotalCost(phases: Phase[]) {
    return phases.reduce((acc, phases) => acc + (phases.creditsConsumed || 0), 0)
}