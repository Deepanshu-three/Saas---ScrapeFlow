'use client'

import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import SaveBtn from './SaveBtn'
import ExecuteBtn from './ExecuteBtn'


interface Props{
    title: string,
    subTitle?: string,
    workflowId: string
}


function Topbar({title, subTitle, workflowId} : Props) {

    const router = useRouter()

  return (
    <header 
     className='flex border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10'
    >
        <div className="flex gap-1 flex1">
            <TooltipWrapper content='back'>
                <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
                    <ChevronLeftIcon size={20} />
                </Button>
            </TooltipWrapper>

            <div>
                <p className='font-bold text-ellipsis truncate'>
                    {title}
                </p>
                <div className='text-xs text-muted-foreground truncate'>
                    {subTitle && ( <p className='text-xs text-muted-foreground text-ellipsis truncate'>
                        {subTitle}
                    </p> )}
                </div>
            </div>

        </div>

        <div className='flex gap-1 flex-1 justify-end'>
            <ExecuteBtn workflowId={workflowId} />
            <SaveBtn workflowId={workflowId}/> 
        </div>
    </header>
  )
}

export default Topbar