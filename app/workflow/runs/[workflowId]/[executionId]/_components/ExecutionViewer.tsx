"use client"

import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import { GetWorkflowsPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DatesToDurationString } from '@/lib/helper/dates'
import { GetPhasesTotalCost } from '@/lib/helper/phases'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {  CalendarIcon, CircleDashedIcon, ClockIcon, Coins, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react'
import React, { ReactNode, useState } from 'react'

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {

    const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false
    })

    const phaseDetail = useQuery({
        queryKey: ["phaseDetail", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowsPhaseDetails(selectedPhase!)
    })

    const duration = DatesToDurationString(query.data?.completedAt, query.data?.startedAt)

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || [])

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

    return (
        <div className='flex w-full h-full'>
            <aside className='w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden'>
                <div className="py-4 px-2">
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label="Status"
                        value={query.data?.status}
                    />
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label="Started at"
                        value={<span className='lowercase'>
                            {query.data?.startedAt
                                ? formatDistanceToNow(new Date(query.data?.startedAt), { addSuffix: true })
                                : '-'}
                        </span>
                        }
                    />

                    <ExecutionLabel icon={ClockIcon} label="Dutation" value={duration ? duration : (<Loader2Icon className='animate-spin' size={20} />)} />
                    <ExecutionLabel icon={Coins} label="Credits consumed" value={creditsConsumed} />


                </div>

                <Separator />

                <div className='flex justify-center items-center py-2 px-4'>
                    <div className='text-muted-foreground flex items-center gap2'>
                        <WorkflowIcon size={20} className='stroke-muted-foreground/80' />
                        <span className="font-semibold">
                            Phases
                        </span>
                    </div>
                </div>

                <Separator />

                <div className="overflow-auto h-full px-4 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button

                            onClick={() => {
                                if(isRunning) return;
                                setSelectedPhase(phase.id)
                            }}

                            key={phase.id}
                            className='w-full justify-between'
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant={'outline'}>
                                    {index + 1}
                                </Badge>
                                <p className="font-semibold">
                                    {phase.name}
                                </p>
                            </div>

                            <p className='text-xs text-muted-foreground'>
                                {phase.status}
                            </p>
                            
                        </Button>
                    ))}
                </div>

            </aside>
            
            <div className="flex w-full h-full">
                <pre>{JSON.stringify(phaseDetail.data, null, 4)}</pre>
            </div>

        </div>
    )
}

export default ExecutionViewer

function ExecutionLabel({ icon, label, value }: {
    icon: LucideIcon,
    label: ReactNode,
    value: ReactNode
}) {
    const Icon = icon
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
                <Icon size={20} className='stroke-muted-foreground/80' />
                <span>{label}</span>
            </div>
            <div className='font-semibold capitalize flex gap-2 items-center'>
                {value}
            </div>
        </div>
    )
}