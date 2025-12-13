"use client";

import { page } from "@styles";
import { WorldsHeader, WorldsGrid, WorldsEmpty, CreateWorldModal } from "./";
import { useWorlds, useCreateModal } from "@hooks";

export default function WorldsPage() {
  const { worlds, isLoading, deleteWorld, openWorld, error, refetch } = useWorlds();
  const createModal = useCreateModal();

  const pageStyles = page();

  if (isLoading) {
    return (
      <div className={pageStyles.container()}>
        <div className={pageStyles.content()}>
          <div className="text-gray-400 text-center">Loading worlds...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className={pageStyles.container()}>
      <div className={pageStyles.content()}>
        <WorldsHeader worldCount={worlds.length} onCreateClick={createModal.openModal} />

        {worlds.length === 0 ? (
          <WorldsEmpty onCreateClick={createModal.openModal} />
        ) : (
          <WorldsGrid worlds={worlds} onOpenWorld={openWorld} onDeleteWorld={deleteWorld} />
        )}
      </div>

      <CreateWorldModal
        isOpen={createModal.showCreateModal}
        worldName={createModal.newWorldName}
        isCreating={createModal.isCreating}
        onClose={createModal.closeModal}
        onNameChange={createModal.setNewWorldName}
        onCreate={createModal.createWorld}
      />
    </div>
  );
}
