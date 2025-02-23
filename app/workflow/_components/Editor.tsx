'use client'

import { Workflow } from '@prisma/client'
import React from 'react'
import {ReactFlowProvider} from '@xyflow/react'
import FlowEditor from './FlowEditor'
import Topbar from './topbar/Topbar'
import TaksMenu from './TaksMenu'
import {  FlowValidationContextProvider } from '@/components/context/FlowValidationContext'

function Editor({workflow} : {workflow : Workflow}) {
  return (
    <FlowValidationContextProvider>
    <ReactFlowProvider>
      <Topbar title='Workflow Editor' subTitle={workflow.name}  workflowId={workflow.id}/>
        <div className="flex flex-col h-full w-full overflow-hidden">
            <section className="flex h-full overflow-auto">
                <TaksMenu />
                <FlowEditor workflow={workflow} />
            </section>
        </div>
    </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}
 
export default Editor