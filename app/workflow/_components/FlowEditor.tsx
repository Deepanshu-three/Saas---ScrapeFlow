'use client'
import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import React, { useEffect } from 'react'

import "@xyflow/react/dist/style.css"
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent'


const nodeTypes = {
  FlowScrapeNode: NodeComponent
}
const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 2
}

function FlowEditor({workflow} : {workflow : Workflow}) {


  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    console.log("Updating flow:", workflow.defination);
    try {
      const flow = JSON.parse(workflow.defination);
      if (!flow) return;
  
      // Log to check what nodes and edges are being set
      console.log("Nodes:", flow.nodes);
      console.log("Edges:", flow.edges);
  
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    } catch (error) {
      console.error("Error parsing workflow definition:", error);
    }
  }, [workflow.defination, setNodes, setEdges]);

  return (
    <main className="h-full w-full">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
      >
         <Controls position='top-left' fitViewOptions={fitViewOptions}/>
         <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
      </ReactFlow> 
    </main> 
  )
}

export default FlowEditor