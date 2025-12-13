import { useCallback, useRef } from "react";
import type { Edge } from "@xyflow/react";
import type { EventFlowNode } from "@lib/types";

interface UseFlowActionsProps {
  nodes: EventFlowNode[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<EventFlowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdit: (node: EventFlowNode) => void;
  onDelete: (id: string) => void;
  // Selection methods
  getSelectedNodes: () => string[];
  getSelectedEdges: () => string[];
  clearSelection: () => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
}

export function useFlowActions({
  nodes,
  setNodes,
  setEdges,
  onEdit,
  onDelete,
  getSelectedNodes,
  getSelectedEdges,
  clearSelection,
  removeNode,
  removeEdge,
}: UseFlowActionsProps) {
  const nodeCountRef = useRef(1);

  // Initialize node count from existing nodes
  const initNodeCount = () => {
    if (nodes.length > 0) {
      const maxId = Math.max(...nodes.map((n) => parseInt(n.id.slice(1)) || 0));
      nodeCountRef.current = maxId + 1;
    }
  };

  // Add new node
  const addNode = useCallback(
    (title: string, description: string | undefined, position: { x: number; y: number }) => {
      const newNode: EventFlowNode = {
        id: `n${nodeCountRef.current}`,
        type: "eventNode",
        position,
        data: {
          title: title || `Node ${nodeCountRef.current}`,
          description,
          selected: false,
          onEdit,
          onDelete,
        },
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
      nodeCountRef.current++;
    },
    [setNodes, onEdit, onDelete]
  );

  // Update existing node
  const updateNode = useCallback(
    (id: string, title: string, description?: string) => {
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

  // Delete single node by ID (with confirmation)
  const deleteNode = useCallback(
    (id: string) => {
      const confirmed = window.confirm("Delete this node? This cannot be undone.");

      if (confirmed) {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        // CASCADE: Remove connected edges
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
        // Always remove from selection
        removeNode(id);
      }
    },
    [setNodes, setEdges, removeNode]
  );

  // Delete single edge by ID (with confirmation)
  const deleteEdge = useCallback(
    (id: string) => {
      const confirmed = window.confirm("Delete this connection? This cannot be undone.");

      if (confirmed) {
        setEdges((eds) => eds.filter((edge) => edge.id !== id));
        // Always remove from selection
        removeEdge(id);
      }
    },
    [setEdges, removeEdge]
  );

  // Delete all selected items (nodes + edges) - used by Delete key and Delete button
  const deleteSelection = useCallback(() => {
    const selectedNodeIds = getSelectedNodes();
    const selectedEdgeIds = getSelectedEdges();

    // Delete nodes (cascade removes their edges)
    setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));

    // CASCADE: Remove edges connected to deleted nodes
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !selectedNodeIds.includes(edge.source) &&
          !selectedNodeIds.includes(edge.target) &&
          !selectedEdgeIds.includes(edge.id)
      )
    );

    // Clear selection after delete
    clearSelection();
  }, [getSelectedNodes, getSelectedEdges, setNodes, setEdges, clearSelection]);

  return {
    addNode,
    updateNode,
    deleteNode,
    deleteEdge,
    deleteSelection,
    initNodeCount,
  };
}
