import { worldcard } from "@styles";
import { WorldCard } from "./WorldCard";
import type { World } from "@hooks";

interface WorldsGridProps {
  worlds: World[];
  onOpenWorld: (worldId: string) => void;
  onDeleteWorld: (worldId: string) => void;
}

export function WorldsGrid({ worlds, onOpenWorld, onDeleteWorld }: WorldsGridProps) {
  const gridStyles = worldcard();

  return (
    <div className={gridStyles.grid()}>
      {worlds.map((world) => (
        <WorldCard
          key={world.id}
          world={world}
          onOpen={() => onOpenWorld(world.id)}
          onDelete={() => onDeleteWorld(world.id)}
        />
      ))}
    </div>
  );
}
