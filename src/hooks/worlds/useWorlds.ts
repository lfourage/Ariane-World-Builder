import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface World {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: { events: number };
}

export function useWorlds() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWorlds();
  }, []);

  const fetchWorlds = async () => {
    try {
      setError(null);
      const res = await fetch("/api/worlds");

      if (!res.ok) {
        throw new Error(`Failed to fetch worlds: ${res.status}`);
      }

      const data = await res.json();
      setWorlds(data.data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load worlds";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorld = async (worldId: string) => {
    if (!confirm("Are you sure you want to delete this world?")) return;

    try {
      const res = await fetch(`/api/worlds/${worldId}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete world");
      }

      setWorlds(worlds.filter((w) => w.id !== worldId));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete world";
      alert(message);
    }
  };

  const openWorld = (worldId: string) => {
    router.push(`/${worldId}/schematizer`);
  };

  return {
    worlds,
    isLoading,
    error,
    deleteWorld,
    openWorld,
    refetch: fetchWorlds,
  };
}
