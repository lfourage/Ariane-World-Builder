"use client";

import { button, worldcard } from "@styles";

interface WorldCardProps {
  world: {
    id: string;
    name: string;
    updatedAt: string;
    _count: { events: number };
  };
  onOpen: () => void;
  onDelete: () => void;
}

export function WorldCard({ world, onOpen, onDelete }: WorldCardProps) {
  const styles = worldcard();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.card()}>
      <div className={styles.header()}>
        <h3 className={styles.title()}>{world.name}</h3>
        <span className={styles.badge()}>
          {world._count.events} {world._count.events === 1 ? "event" : "events"}
        </span>
      </div>

      <p className={styles.meta()}>Updated {formatDate(world.updatedAt)}</p>

      <div className={styles.actions()}>
        <button
          onClick={onOpen}
          className={button({ intent: "nature", size: "sm", fullWidth: true })}
        >
          Open World
        </button>
        <button onClick={onDelete} className={button({ intent: "danger", size: "sm" })}>
          Delete
        </button>
      </div>
    </div>
  );
}
