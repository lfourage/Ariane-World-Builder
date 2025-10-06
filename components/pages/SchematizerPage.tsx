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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: 'n1', position: { x: -100, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 100, y: 0 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 0, y: 100 }, data: { label: 'Node 3' } },
];
const initialEdges = [{ id: 'n1-n3', source: 'n1', target: 'n3' }, { id: 'n2-n3', source: 'n2', target: 'n3' }];

export default function SchematizerPage() {
  const [nodes, setNodes] = useState<Array<Node>>(initialNodes);
  const [edges, setEdges] = useState<Array<Edge>>(initialEdges);

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
    <div id="canvas" style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
