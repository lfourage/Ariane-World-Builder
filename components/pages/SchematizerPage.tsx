"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Background,
  BackgroundVariant,
  useReactFlow,
  useStore,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NewNodeModal from "@components/ui/NewNodeModal";

const initialNodes = [
  { id: "n1", position: { x: -100, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 100, y: 0 }, data: { label: "Node 2" } },
  { id: "n3", position: { x: 0, y: 100 }, data: { label: "Node 3" } },
];
const initialEdges = [
  { id: "n1-n3", source: "n1", target: "n3" },
  { id: "n2-n3", source: "n2", target: "n3" },
];

function FlowInner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const { screenToFlowPosition } = useReactFlow();
  const transform = useStore((state) => state.transform);

  const [nodes, setNodes] = useState<Array<Node>>(initialNodes);
  const [edges, setEdges] = useState<Array<Edge>>(initialEdges);

  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setModalPos(screenToFlowPosition({ x: event.clientX, y: event.clientY }));
      setModalOpen(true);
    },
    [screenToFlowPosition]
  );

  const getScreenPos = (pos: { x: number; y: number }) => {
    const [tx, ty, zoom] = transform;
    return {
      x: pos.x * zoom + tx,
      y: pos.y * zoom + ty,
    };
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div id="canvas" className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        zoomOnDoubleClick={false}
        onDoubleClick={onDoubleClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
      {modalOpen && modalPos && (
        <NewNodeModal pos={getScreenPos(modalPos)} closeModal={closeModal}></NewNodeModal>
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
