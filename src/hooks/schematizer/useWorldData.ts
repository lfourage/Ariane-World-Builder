import { useState, useCallback } from "react";
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

export function useWorldData(worldId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorld = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/worlds/${worldId}`);
      if (!res.ok) {
        throw new Error("Failed to load world");
      }

      const data = await res.json();
      const world: WorldData = data.data;

      return world;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [worldId]);

  const saveWorld = useCallback(
    async (nodes: EventFlowNode[], edges: Edge[]) => {
      setIsSaving(true);
      setError(null);

      try {
        // Convert ReactFlow nodes to DB events
        const events = nodes.map((node) => ({
          id: node.id,
          title: node.data.title,
          description: node.data.description || null,
          positionX: node.position.x,
          positionY: node.position.y,
        }));

        // Convert ReactFlow edges to DB connections
        const connections = edges.map((edge, index) => ({
          source: edge.source,
          target: edge.target,
          order: index,
        }));

        const res = await fetch(`/api/worlds/${worldId}/schema`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events, connections }),
        });

        if (!res.ok) {
          throw new Error("Failed to save");
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [worldId]
  );

  return {
    isLoading,
    isSaving,
    error,
    loadWorld,
    saveWorld,
  };
}
