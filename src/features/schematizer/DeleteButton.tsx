import { button } from "@styles";

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        button({ intent: "danger", size: "lg" }) +
        " fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full shadow-lg z-10"
      }
      title="Delete selected items"
    >
      <span className="text-xl">🗑️</span>
    </button>
  );
}
