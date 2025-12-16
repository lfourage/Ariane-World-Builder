import { useEffect, useRef } from "react";
import type { Edge } from "@xyflow/react";
import type { EventFlowNode } from "@lib/types";

interface WorldEvent {
  id: string;
  title: string;
  description: string | null;
  positionX: number;
  positionY: number;
  nexts?: Array<{ id: string; nextId: string }>;
}

interface WorldData {
  events: WorldEvent[];
}

interface UseFlowInitializerProps {
  loadWorld: () => Promise<WorldData | null>;
  setNodes: React.Dispatch<React.SetStateAction<EventFlowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdit: (node: EventFlowNode) => void;
  onDelete: (id: string) => void;
}

export function useFlowInitializer({
  loadWorld,
  setNodes,
  setEdges,
  onEdit,
  onDelete,
}: UseFlowInitializerProps) {
  // Use refs to store callbacks without triggering re-initialization
  const onEditRef = useRef(onEdit);
  const onDeleteRef = useRef(onDelete);

  // Update refs when callbacks change
  useEffect(() => {
    onEditRef.current = onEdit;
    onDeleteRef.current = onDelete;
  }, [onEdit, onDelete]);

  useEffect(() => {
    const initialize = async () => {
      const world = await loadWorld();

      if (!world || !world.events || world.events.length === 0) {
        return;
      }

      // Convert DB events to ReactFlow nodes
      const loadedNodes: EventFlowNode[] = world.events.map((event) => ({
        id: event.id,
        type: "eventNode",
        position: { x: event.positionX, y: event.positionY },
        data: {
          title: event.title,
          description: event.description || undefined,
          selected: false,
          onEdit: onEditRef.current,
          onDelete: onDeleteRef.current,
        },
      }));

      // Convert DB connections to ReactFlow edges
      const loadedEdges: Edge[] = [];
      world.events.forEach((event) => {
        event.nexts?.forEach((conn) => {
          if (conn.nextId) {
            loadedEdges.push({
              id: conn.id,
              source: event.id,
              target: conn.nextId,
              type: "default",
            });
          }
        });
      });

      setNodes(loadedNodes);
      setEdges(loadedEdges);
    };

    initialize();
  }, [loadWorld, setEdges, setNodes]);
}
