import { button, worldModal, formField } from "@styles";

interface CreateWorldModalProps {
  isOpen: boolean;
  worldName: string;
  isCreating: boolean;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onCreate: () => void;
}

export function CreateWorldModal({
  isOpen,
  worldName,
  isCreating,
  onClose,
  onNameChange,
  onCreate,
}: CreateWorldModalProps) {
  const modalStyles = worldModal();
  const fieldStyles = formField({ size: "md" });

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onCreate();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className={modalStyles.overlay()} onClick={onClose}>
      <div className={modalStyles.content()} onClick={(e) => e.stopPropagation()}>
        <h2 className={modalStyles.title()}>Create New World</h2>

        <div className={fieldStyles.wrapper()}>
          <label className={fieldStyles.label()}>World Name</label>
          <input
            type="text"
            value={worldName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter world name..."
            className={fieldStyles.input()}
            autoFocus
          />
        </div>

        <div className={modalStyles.actions()}>
          <button onClick={onClose} className={button({ intent: "ghost" })} disabled={isCreating}>
            Cancel
          </button>
          <button
            onClick={onCreate}
            className={button({ intent: "nature" })}
            disabled={!worldName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create World"}
          </button>
        </div>
      </div>
    </div>
  );
}
