"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Background,
  useReactFlow,
  ReactFlowProvider,
  XYPosition,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EventFormModal from "@components/ui/EventFormModal";
import EventNode from "@components/ui/EventNode";
import type { EventNodeData } from "@components/ui/EventNode";

let nodeCount = 1;

export type EventFlowNode = Node<EventNodeData, "eventNode">;

const nodeTypes = {
  eventNode: EventNode,
};

function FlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<EventFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<EventFlowNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScreenPos, setModalScreenPos] = useState<XYPosition>({
    x: 0,
    y: 0,
  });
  const [pendingNodeFlowPos, setPendingNodeFlowPos] = useState({ x: 0, y: 0 });
  const { screenToFlowPosition } = useReactFlow();

  const handleEdit = useCallback((node: EventFlowNode) => {
    setSelectedNode(node);
    setModalScreenPos({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: EventFlowNode["id"]) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  const updateNode = useCallback(
    (id: EventFlowNode["id"], title: string, description?: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  title,
                  description,
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const addNode = useCallback(
    (title: string, description?: string) => {
      const newNode: EventFlowNode = {
        id: `n${nodeCount}`,
        type: "eventNode",
        position: pendingNodeFlowPos,
        data: {
          title: title || `Node ${nodeCount}`,
          description: description,
          selected: false,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
      nodeCount++;
    },
    [pendingNodeFlowPos, handleEdit, handleDelete, setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: EventFlowNode) => {
      const target = event.target as HTMLElement;

      if (target.closest("button")) return;
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === selectedNode?.id,
        },
      }))
    );
  }, [selectedNode, setNodes]);

  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(".react-flow__node") &&
        !target.closest(".react-flow__edge")
      ) {
        event.preventDefault();
        setSelectedNode(null);
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
  (params: Edge | Connection) => {
    const newEdge = { ...params };

    const tempGraph: Record<string, string[]> = {};
    nodes.forEach((node) => {
      tempGraph[node.id] = [];
    });
    edges.forEach((edge) => {
      tempGraph[edge.source].push(edge.target);
    });
    tempGraph[newEdge.source].push(newEdge.target);

    const hasCycle = (() => {
      const visited = new Set<string>();
      const stack = new Set<string>();

      function dfs(nodeId: string): boolean {
        if (stack.has(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        stack.add(nodeId);

        for (const neighbor of tempGraph[nodeId] || []) {
          if (dfs(neighbor)) return true;
        }

        stack.delete(nodeId);
        return false;
      }

      return nodes.some((node) => dfs(node.id));
    })();

    if (hasCycle) {
      alert("Adding this edge would create a cycle!");
      return;
    }

    setEdges((eds) => addEdge(newEdge, eds));
  },
  [nodes, edges, setEdges]
);
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete") {
        setEdges((eds) => eds.filter((edge) => !edge.selected));

        if (selectedNode) {
          handleDelete(selectedNode.id);
          setSelectedNode(null);
        }
      }
    },
    [setEdges, handleDelete, selectedNode]
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
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onKeyDown={onKeyDown}
        style={{ backgroundColor: "#1a1a1a" }}
        fitView
      >
        <Background color="#333" gap={20} />
      </ReactFlow>
      {isModalOpen && (
        <EventFormModal
          eventId={selectedNode?.id}
          initialData={selectedNode?.data}
          pos={modalScreenPos}
          addNode={addNode}
          updateNode={updateNode}
          closeModal={closeModal}
        />
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
