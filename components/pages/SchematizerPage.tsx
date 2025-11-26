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
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NewNodeModal from "@components/ui/NewNodeModal";

let nodeCount = 4;

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
  const [nodes, setNodes] = useState<Array<Node>>(initialNodes);
  const [edges, setEdges] = useState<Array<Edge>>(initialEdges);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalScreenPos, setModalScreenPos] = useState({ x: 0, y: 0 });
  const [pendingNodeFlowPos, setPendingNodeFlowPos] = useState({ x: 0, y: 0 });
  const { screenToFlowPosition } = useReactFlow();

  const addNode = useCallback(
    (label: string) => {
      const newNode = {
        id: `n${nodeCount}`,
        position: pendingNodeFlowPos,
        data: { label: label || `Node ${nodeCount}` },
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
      nodeCount++;
    },
    [pendingNodeFlowPos]
  );

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

        setModalOpen(true);
      }
    },
    [screenToFlowPosition]
  );

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
    <div id="canvas" className="w-full h-full">
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
      {modalOpen && (
        <NewNodeModal
          pos={modalScreenPos}
          addNode={addNode}
          closeModal={closeModal}
        ></NewNodeModal>
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
