import { useCallback } from "react";
import { addEdge, useReactFlow } from "@xyflow/react";
import type { Edge, Connection, XYPosition } from "@xyflow/react";
import type { EventFlowNode } from "@lib/types";

interface UseFlowHandlersProps {
  nodes: EventFlowNode[];
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onOpenModal: (position: XYPosition, node?: EventFlowNode) => void;
  // Selection methods
  toggleNode: (id: string) => void;
  toggleEdge: (id: string) => void;
  clearSelection: () => void;
  getSelectedNodes: () => string[];
  getSelectedEdges: () => string[];
  selectionCount: () => number;
  deleteSelection: () => void;
}

export function useFlowHandlers({
  nodes,
  edges,
  setEdges,
  onOpenModal,
  toggleNode,
  toggleEdge,
  clearSelection,
  selectionCount,
  deleteSelection,
}: UseFlowHandlersProps) {
  const { screenToFlowPosition } = useReactFlow();

  // Node click handler - toggle selection (click accumulation)
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: EventFlowNode) => {
      const target = event.target as HTMLElement;

      // Don't select if clicking on a button inside the node
      if (target.closest("button")) return;

      toggleNode(node.id);
    },
    [toggleNode]
  );

  // Edge click handler - toggle selection
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      toggleEdge(edge.id);
    },
    [toggleEdge]
  );

  // Pane click handler (deselect all)
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Double click to create node
  const onDoubleClick = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      const target = event.target as HTMLElement;

      // Only create node if clicking on empty canvas
      if (!target.closest(".react-flow__node") && !target.closest(".react-flow__edge")) {
        event.preventDefault();

        const flowPos = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        onOpenModal(flowPos);
      }
    },
    [screenToFlowPosition, onOpenModal]
  );

  // Connect nodes (with cycle detection)
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = { ...params };

      // Build temporary graph with new edge
      const tempGraph: Record<string, string[]> = {};
      nodes.forEach((node) => {
        tempGraph[node.id] = [];
      });
      edges.forEach((edge) => {
        tempGraph[edge.source].push(edge.target);
      });
      tempGraph[newEdge.source].push(newEdge.target);

      // Check for cycles using DFS
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

  // Keyboard handler - Delete key deletes all selected items
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const count = selectionCount();

        if (count > 0) {
          // Confirmation dialog
          const confirmed = window.confirm(
            `Delete ${count} item${count > 1 ? "s" : ""}? This cannot be undone.`
          );

          if (confirmed) {
            deleteSelection();
          }
        }
      }
    },
    [selectionCount, deleteSelection]
  );

  return {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onDoubleClick,
    onConnect,
    onKeyDown,
  };
}
