import { button } from "@styles";

interface FlowToolbarProps {
  onSave: () => void;
  onBack: () => void;
  isSaving: boolean;
}

export function FlowToolbar({ onSave, onBack, isSaving }: FlowToolbarProps) {
  return (
    <div className="absolute top-20 right-4 z-10 flex gap-2">
      {/* Back to Worlds */}
      <button
        onClick={onBack}
        className={button({ intent: "ghost", size: "sm" })}
        title="Back to worlds"
      >
        ← Back
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className={button({ intent: "nature", size: "sm" })}
        title="Save world"
      >
        {isSaving ? "Saving..." : "💾 Save"}
      </button>
    </div>
  );
}
