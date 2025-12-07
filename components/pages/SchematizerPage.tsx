"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EventFormModal from "@components/ui/EventFormModal";
import EventNode from "@components/ui/EventNode";
import type { EventNodeData } from "@components/ui/EventNode";

let nodeCount = 4;

const nodeTypes = {
  eventNode: EventNode,
};

/*
interface FrontEvent {
  id: string;
  title: string;
  description?: string | null;
  positionX: number;
  positionY: number;
  nexts?: Array<{
    id: string;
    nextId: string | null;
    type: string;
    order: number;
  }>;
}

interface CanvasProps {
  events: FrontEvent[];
  onEventCreate: (position: { x: number; y: number }) => void;
  onEventUpdate: (id: string, position: { x: number; y: number }) => void;
  onEventDelete: (id: string) => void;
  onEventEdit: (id: string) => void;
  onConnectionCreate: (source: string, target: string, type: string) => void;
  onConnectionDelete: (source: string, target: string) => void;
}*/

function FlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  //const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScreenPos, setModalScreenPos] = useState({ x: 0, y: 0 });
  const [pendingNodeFlowPos, setPendingNodeFlowPos] = useState({ x: 0, y: 0 });
  const { screenToFlowPosition } = useReactFlow();


  const handleEdit = useCallback((id: string) => {
    console.log("Edit node:", id);
    // Votre logique d'édition ici
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  const addNode = useCallback(
    (title: string, description?: string) => {
      const newNode: Node<EventNodeData> = {
        id: `n${nodeCount}`,
        type: "eventNode",
        position: pendingNodeFlowPos,
        data: {
          title: title || `Node ${nodeCount}`,
          description: description,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
      nodeCount++;
    },
    [pendingNodeFlowPos, handleEdit, handleDelete, setNodes]
  );

  /*const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);*/

  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(".react-flow__node") &&
        !target.closest(".react-flow__edge")
      ) {
        event.preventDefault();

        setModalScreenPos({ x: event.clientX, y: event.clientY });

        const flowPos = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        setPendingNodeFlowPos(flowPos);

        setIsModalOpen(true);
      }
    },
    [screenToFlowPosition]
  );

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        zoomOnDoubleClick={false}
        onDoubleClick={onDoubleClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        //onNodeClick={onNodeClick}
        style={{ backgroundColor: "#1a1a1a" }}
        fitView
      >
        <Background color="#333" gap={20} />
      </ReactFlow>
      {isModalOpen && (
        <EventFormModal
          pos={modalScreenPos}
          addNode={addNode}
          closeModal={closeModal}
        ></EventFormModal>
      )}
    </div>
  );
}

export default function SchematizerPage() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
