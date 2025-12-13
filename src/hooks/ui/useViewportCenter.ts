import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

/**
 * Hook to get the center of the current viewport in flow coordinates
 * Useful for creating nodes at the center of the visible area
 */
export function useViewportCenter() {
  const { screenToFlowPosition } = useReactFlow();

  const getViewportCenter = useCallback(() => {
    // Get center of viewport in screen coordinates
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Convert to flow coordinates
    const flowPosition = screenToFlowPosition({
      x: centerX,
      y: centerY,
    });

    return flowPosition;
  }, [screenToFlowPosition]);

  return { getViewportCenter };
}
