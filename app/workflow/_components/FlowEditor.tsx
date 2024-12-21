'use client'
import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'

import "@xyflow/react/dist/style.css"
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import NodeComponent from '@/app/workflow/_components/nodes/NodeComponent'
import { AppNode } from '@/types/appNode'
import DeletableEdge from './edges/DeletableEdge'


const nodeTypes = {
  FlowScrapeNode: NodeComponent
}

const edgeTypes ={
  default: DeletableEdge 
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 2
}

function FlowEditor({workflow} : {workflow : Workflow}) {


  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge >([])

  const {setViewport ,screenToFlowPosition} = useReactFlow()

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

      const {x = 0, y = 0, zoom = 1} = flow.viewport;
      setViewport({x, y, zoom})

    } catch (error) {
      console.error("Error parsing workflow definition:", error);
    }
  }, [workflow.defination, setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const taskType = event.dataTransfer.getData("application/reactflow")
    if(typeof taskType === undefined || !taskType) return;

    const positions = screenToFlowPosition({
       x: event.clientX,
       y: event.clientY
    })
    
    const newNode = CreateFlowNode(taskType as TaskType, positions)
    
    setNodes((nds) => nds.concat(newNode))

  },[])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({...connection, animated: true}, eds))
  }, [])

  return ( 
    <main className="h-full w-full">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >

         <Controls position='top-left' fitViewOptions={fitViewOptions}/>
         <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
      </ReactFlow> 
    </main> 
  )
}

export default FlowEditor