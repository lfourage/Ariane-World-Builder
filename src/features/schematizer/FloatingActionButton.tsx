import { button } from "@styles";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        button({ intent: "nature", size: "lg" }) +
        " fixed bottom-6 right-20 w-14 h-14 rounded-full shadow-lg z-10 flex items-center justify-center text-2xl"
      }
      title="Create new event (or double-click canvas)"
    >
      +
    </button>
  );
}
