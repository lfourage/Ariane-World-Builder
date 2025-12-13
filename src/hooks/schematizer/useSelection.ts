import { useState, useCallback } from "react";

interface SelectionState {
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
}

export function useSelection() {
  const [selection, setSelection] = useState<SelectionState>({
    selectedNodes: new Set(),
    selectedEdges: new Set(),
  });

  // Select a node (add to selection)
  const selectNode = useCallback((id: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedNodes: new Set(prev.selectedNodes).add(id),
    }));
  }, []);

  // Select an edge (add to selection)
  const selectEdge = useCallback((id: string) => {
    setSelection((prev) => ({
      ...prev,
      selectedEdges: new Set(prev.selectedEdges).add(id),
    }));
  }, []);

  // Toggle node selection (add if not present, remove if present)
  const toggleNode = useCallback((id: string) => {
    setSelection((prev) => {
      const newSet = new Set(prev.selectedNodes);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { ...prev, selectedNodes: newSet };
    });
  }, []);

  // Remove node from selection (always remove, never add)
  const removeNode = useCallback((id: string) => {
    setSelection((prev) => {
      const newSet = new Set(prev.selectedNodes);
      newSet.delete(id);
      return { ...prev, selectedNodes: newSet };
    });
  }, []);

  // Toggle edge selection
  const toggleEdge = useCallback((id: string) => {
    setSelection((prev) => {
      const newSet = new Set(prev.selectedEdges);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { ...prev, selectedEdges: newSet };
    });
  }, []);

  // Remove edge from selection (always remove, never add)
  const removeEdge = useCallback((id: string) => {
    setSelection((prev) => {
      const newSet = new Set(prev.selectedEdges);
      newSet.delete(id);
      return { ...prev, selectedEdges: newSet };
    });
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelection({
      selectedNodes: new Set(),
      selectedEdges: new Set(),
    });
  }, []);

  // Get total count of selected items
  const selectionCount = useCallback(() => {
    return selection.selectedNodes.size + selection.selectedEdges.size;
  }, [selection]);

  // Check if a node is selected
  const isNodeSelected = useCallback((id: string) => selection.selectedNodes.has(id), [selection]);

  // Check if an edge is selected
  const isEdgeSelected = useCallback((id: string) => selection.selectedEdges.has(id), [selection]);

  // Get array of selected node IDs
  const getSelectedNodes = useCallback(() => Array.from(selection.selectedNodes), [selection]);

  // Get array of selected edge IDs
  const getSelectedEdges = useCallback(() => Array.from(selection.selectedEdges), [selection]);

  return {
    selection,
    selectNode,
    selectEdge,
    toggleNode,
    toggleEdge,
    removeNode,
    removeEdge,
    clearSelection,
    selectionCount,
    isNodeSelected,
    isEdgeSelected,
    getSelectedNodes,
    getSelectedEdges,
  };
}
