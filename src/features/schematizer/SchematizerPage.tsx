"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { Edge, ReactFlowProvider, XYPosition } from "@xyflow/react";
import type { EventFlowNode } from "@types";
import "@xyflow/react/dist/style.css";
import { EventFormModal } from ".";

// Hooks
import {
  useWorldData,
  useFlowState,
  useFlowActions,
  useFlowHandlers,
  useFlowInitializer,
  useContextMenu,
  useSelection,
  useViewportCenter,
} from "@hooks";

// Components
import {
  FlowCanvas,
  FlowToolbar,
  HelpButton,
  FloatingActionButton,
  DeleteButton,
  ContextMenu,
} from "./";

interface SchematizerPageProps {
  worldId: string;
}

function FlowInner({ worldId }: SchematizerPageProps) {
  const router = useRouter();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNodeFlowPos, setPendingNodeFlowPos] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<EventFlowNode | null>(null);

  // World data management
  const { isLoading, isSaving, loadWorld, saveWorld } = useWorldData(worldId);

  // Flow state management
  const flowState = useFlowState();

  // Selection management
  const selection = useSelection();

  // Context menu
  const contextMenu = useContextMenu();

  // Viewport utilities
  const { getViewportCenter } = useViewportCenter();

  // Event handlers for nodes
  const handleEdit = useCallback((node: EventFlowNode) => {
    setEditingNode(node);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const confirmed = window.confirm("Delete this node?");

      if (confirmed) {
        flowState.setNodes((nds) => nds.filter((node) => node.id !== id));
        flowState.setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
        selection.removeNode(id);
      }
    },
    [flowState, selection]
  );

  // CRUD operations
  const flowActions = useFlowActions({
    nodes: flowState.nodes,
    edges: flowState.edges,
    setNodes: flowState.setNodes,
    setEdges: flowState.setEdges,
    onEdit: handleEdit,
    onDelete: handleDelete,
    getSelectedNodes: selection.getSelectedNodes,
    getSelectedEdges: selection.getSelectedEdges,
    clearSelection: selection.clearSelection,
    removeNode: selection.removeNode,
    removeEdge: selection.removeEdge,
  });

  // Open modal for creating/editing
  const handleOpenModal = useCallback((position: XYPosition, node?: EventFlowNode) => {
    setEditingNode(node || null);
    setPendingNodeFlowPos(position);
    setIsModalOpen(true);
  }, []);

  // ReactFlow event handlers
  const flowHandlers = useFlowHandlers({
    nodes: flowState.nodes,
    edges: flowState.edges,
    setEdges: flowState.setEdges,
    onOpenModal: handleOpenModal,
    toggleNode: selection.toggleNode,
    toggleEdge: selection.toggleEdge,
    clearSelection: selection.clearSelection,
    getSelectedNodes: selection.getSelectedNodes,
    getSelectedEdges: selection.getSelectedEdges,
    selectionCount: selection.selectionCount,
    deleteSelection: flowActions.deleteSelection,
  });

  // Initialize world data on mount
  useFlowInitializer({
    loadWorld,
    setNodes: flowState.setNodes,
    setEdges: flowState.setEdges,
    initNodeCount: flowActions.initNodeCount,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // Save handler
  const handleSave = useCallback(async () => {
    const success = await saveWorld(flowState.nodes, flowState.edges);
    if (success) {
      alert("World saved successfully!");
    } else {
      alert("Failed to save world");
    }
  }, [saveWorld, flowState.nodes, flowState.edges]);

  // Modal handlers
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingNode(null);
  }, []);

  const handleModalSubmit = useCallback(
    (title: string, description?: string) => {
      if (editingNode) {
        flowActions.updateNode(editingNode.id, title, description);
      } else {
        flowActions.addNode(title, description, pendingNodeFlowPos);
      }
      closeModal();
    },
    [editingNode, flowActions, pendingNodeFlowPos, closeModal]
  );

  // Context menu actions
  const getContextMenuItems = useCallback(() => {
    if (!contextMenu.menu) return [];

    const { type, target } = contextMenu.menu;

    if (type === "node" && target) {
      const node = target as EventFlowNode;
      const isSelected = selection.isNodeSelected(node.id);
      const count = selection.selectionCount();

      return [
        {
          label: "Edit",
          icon: "✏️",
          onClick: () => {
            contextMenu.hideMenu();
            handleEdit(node);
          },
        },
        {
          label: "Delete This Node",
          icon: "🗑️",
          onClick: () => {
            contextMenu.hideMenu();
            flowActions.deleteNode(node.id);
          },
          danger: true,
        },
        ...(isSelected && count > 1
          ? [
              {
                label: `Delete ${count} Selected Items`,
                icon: "🗑️",
                onClick: () => {
                  contextMenu.hideMenu();
                  const confirmed = window.confirm(`Delete ${count} items? This cannot be undone.`);
                  if (confirmed) {
                    flowActions.deleteSelection();
                  }
                },
                danger: true,
              },
            ]
          : []),
      ];
    }

    if (type === "edge" && target) {
      const edge = target as Edge;
      const isSelected = selection.isEdgeSelected(edge.id);
      const count = selection.selectionCount();

      return [
        {
          label: "Delete This Connection",
          icon: "🗑️",
          onClick: () => {
            contextMenu.hideMenu();
            flowActions.deleteEdge(edge.id);
          },
          danger: true,
        },
        ...(isSelected && count > 1
          ? [
              {
                label: `Delete ${count} Selected Items`,
                icon: "🗑️",
                onClick: () => {
                  contextMenu.hideMenu();
                  const confirmed = window.confirm(`Delete ${count} items? This cannot be undone.`);
                  if (confirmed) {
                    flowActions.deleteSelection();
                  }
                },
                danger: true,
              },
            ]
          : []),
      ];
    }

    if (type === "pane") {
      return [
        {
          label: "Create Event Here",
          icon: "➕",
          onClick: () => {
            const flowPos = contextMenu.getMenuFlowPosition();
            if (flowPos) {
              handleOpenModal(flowPos);
            }
            contextMenu.hideMenu();
          },
        },
        {
          label: "Save World",
          icon: "💾",
          onClick: () => {
            contextMenu.hideMenu();
            handleSave();
          },
        },
      ];
    }

    return [];
  }, [contextMenu, selection, handleEdit, flowActions, handleOpenModal, handleSave]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      flowHandlers.onKeyDown(e);
    },
    [flowHandlers]
  );

  // Apply selection state to nodes and edges for visual feedback
  // Nodes: Tailwind classes via TV (ring-2 ring-green-400)
  // Edges: Inline style (red + thick)
  const styledNodes = useMemo(() => {
    return flowState.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        selected: selection.isNodeSelected(node.id),
      },
    }));
  }, [flowState.nodes, selection]);

  const styledEdges = useMemo(() => {
    return flowState.edges.map((edge) => ({
      ...edge,
      selected: selection.isEdgeSelected(edge.id),
      style: selection.isEdgeSelected(edge.id) ? { stroke: "#ef4444", strokeWidth: 3 } : undefined,
    }));
  }, [flowState.edges, selection]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">Loading world...</div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Help Button */}
      <HelpButton />

      {/* Toolbar */}
      <FlowToolbar onSave={handleSave} onBack={() => router.push("/worlds")} isSaving={isSaving} />

      {/* ReactFlow Canvas */}
      <FlowCanvas
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={flowState.onNodesChange}
        onEdgesChange={flowState.onEdgesChange}
        onConnect={flowHandlers.onConnect}
        onNodeClick={flowHandlers.onNodeClick}
        onNodeDoubleClick={flowHandlers.onNodeClick}
        onEdgeClick={flowHandlers.onEdgeClick}
        onNodeContextMenu={contextMenu.showNodeMenu}
        onEdgeContextMenu={contextMenu.showEdgeMenu}
        onPaneClick={flowHandlers.onPaneClick}
        onDoubleClick={flowHandlers.onDoubleClick}
        onPaneContextMenu={contextMenu.showPaneMenu}
        onKeyDown={handleKeyDown}
        showMiniMap={true}
        showControls={true}
      />

      {/* Context Menu with overlay */}
      {contextMenu.menu && (
        <>
          {/* Invisible overlay to catch clicks outside */}
          <div className="fixed inset-0 z-40" onClick={contextMenu.hideMenu} />

          {/* Menu */}
          <ContextMenu
            x={contextMenu.menu.x}
            y={contextMenu.menu.y}
            items={getContextMenuItems()}
            onClose={contextMenu.hideMenu}
          />
        </>
      )}

      {/* Floating Action Button (Create) */}
      <FloatingActionButton
        onClick={() => {
          const flowPos = getViewportCenter();
          handleOpenModal(flowPos);
        }}
      />

      {/* Delete Button (when items selected) */}
      {selection.selectionCount() > 0 && (
        <DeleteButton
          onClick={() => {
            const count = selection.selectionCount();
            const confirmed = window.confirm(`Delete ${count} item${count > 1 ? "s" : ""}?`);
            if (confirmed) {
              flowActions.deleteSelection();
            }
          }}
        />
      )}

      {/* Event Form Modal */}
      {isModalOpen && (
        <EventFormModal
          eventId={editingNode?.id}
          initialData={editingNode?.data}
          handleSubmit={(title, desc) => handleModalSubmit(title, desc)}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default function SchematizerPage({ worldId }: SchematizerPageProps) {
  return (
    <ReactFlowProvider>
      <FlowInner worldId={worldId} />
    </ReactFlowProvider>
  );
}
