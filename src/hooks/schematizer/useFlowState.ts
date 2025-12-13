import { useNodesState, useEdgesState } from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import type { EventFlowNode } from "@types";

/**
 * Central state management for ReactFlow canvas
 *
 * Manages nodes, edges, and selection state for the flow editor.
 * Integrates with @xyflow/react's built-in state management hooks.
 *
 * @returns {Object} Flow state and controls
 * @returns {EventFlowNode[]} nodes - Array of event nodes
 * @returns {Edge[]} edges - Array of connections between nodes
 * @returns {Function} onNodesChange - Handler for node changes (drag, delete, etc.)
 * @returns {Function} onEdgesChange - Handler for edge changes
 *
 * @example
 * const flowState = useFlowState();
 *
 * // Add a new node
 * flowState.setNodes([...flowState.nodes, newNode]);
 */
export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState<EventFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  return {
    // State
    nodes,
    edges,

    // Setters
    setNodes,
    setEdges,

    // Handlers
    onNodesChange,
    onEdgesChange,
  };
}
