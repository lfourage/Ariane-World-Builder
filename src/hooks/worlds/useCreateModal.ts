import { useState } from "react";
import { useRouter } from "next/navigation";

export function useCreateModal() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorldName, setNewWorldName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setNewWorldName("");
  };

  const createWorld = async () => {
    if (!newWorldName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/worlds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorldName }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${data.data.id}/schematizer`);
      } else {
        const data = await res.json();
        alert(`Failed to create world: ${data.error?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Failed to create world: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    showCreateModal,
    newWorldName,
    isCreating,
    openModal,
    closeModal,
    setNewWorldName,
    createWorld,
  };
}
