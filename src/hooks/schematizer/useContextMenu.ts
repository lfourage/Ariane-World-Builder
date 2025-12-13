import { useState, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";

export type ContextMenuType = "node" | "edge" | "pane";

export interface ContextMenuState {
  x: number;
  y: number;
  type: ContextMenuType;
  target?: Node | Edge;
}

export function useContextMenu() {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const showMenu = useCallback(
    (x: number, y: number, type: ContextMenuType, target?: Node | Edge) => {
      setMenu({ x, y, type, target });
    },
    []
  );

  const hideMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const showNodeMenu = useCallback(
    (event: React.MouseEvent | MouseEvent, node: Node) => {
      event.preventDefault();
      const clientX = "clientX" in event ? event.clientX : 0;
      const clientY = "clientY" in event ? event.clientY : 0;
      showMenu(clientX, clientY, "node", node);
    },
    [showMenu]
  );

  const showEdgeMenu = useCallback(
    (event: React.MouseEvent | MouseEvent, edge: Edge) => {
      event.preventDefault();
      const clientX = "clientX" in event ? event.clientX : 0;
      const clientY = "clientY" in event ? event.clientY : 0;
      showMenu(clientX, clientY, "edge", edge);
    },
    [showMenu]
  );

  const showPaneMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      event.preventDefault();
      const target = event.target as HTMLElement;

      // Only show pane menu if clicking on empty canvas
      if (!target.closest(".react-flow__node") && !target.closest(".react-flow__edge")) {
        const clientX = "clientX" in event ? event.clientX : 0;
        const clientY = "clientY" in event ? event.clientY : 0;
        showMenu(clientX, clientY, "pane");
      }
    },
    [showMenu]
  );

  // Helper to get flow position from menu screen position
  const getMenuFlowPosition = useCallback(() => {
    if (!menu) return null;
    return screenToFlowPosition({ x: menu.x, y: menu.y });
  }, [menu, screenToFlowPosition]);

  return {
    menu,
    showMenu,
    hideMenu,
    showNodeMenu,
    showEdgeMenu,
    showPaneMenu,
    getMenuFlowPosition,
  };
}
