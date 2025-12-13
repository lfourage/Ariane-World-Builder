import { button, page } from "@styles";

interface WorldsHeaderProps {
  worldCount: number;
  onCreateClick: () => void;
}

export function WorldsHeader({ worldCount, onCreateClick }: WorldsHeaderProps) {
  const pageStyles = page();

  return (
    <div className={pageStyles.header()}>
      <div className={pageStyles.headerText()}>
        <h1 className={pageStyles.title()}>My Worlds</h1>
        <p className={pageStyles.subtitle()}>
          {worldCount === 0
            ? "Create your first world to get started"
            : `${worldCount} world${worldCount === 1 ? "" : "s"}`}
        </p>
      </div>
      <div className={pageStyles.actions()}>
        <button onClick={onCreateClick} className={button({ intent: "nature" })}>
          + New World
        </button>
      </div>
    </div>
  );
}
