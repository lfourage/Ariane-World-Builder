import { button, worldsEmpty } from "@styles";

interface WorldsEmptyProps {
  onCreateClick: () => void;
}

export function WorldsEmpty({ onCreateClick }: WorldsEmptyProps) {
  const emptyStyles = worldsEmpty();

  return (
    <div className={emptyStyles.container()}>
      <div className={emptyStyles.icon()}>🌍</div>
      <h2 className={emptyStyles.title()}>No worlds yet</h2>
      <p className={emptyStyles.description()}>
        Create your first world to start building your story!
      </p>
      <button onClick={onCreateClick} className={button({ intent: "nature", size: "lg" })}>
        Create Your First World
      </button>
    </div>
  );
}
