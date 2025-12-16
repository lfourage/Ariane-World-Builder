import { prisma } from "@lib/db/prisma";

// Types
export interface CreateWorldInput {
  name: string;
  userId: string;
}

export interface EventObject {
  id: string;
  title: string;
  description?: string | null;
  positionX: number;
  positionY: number;
}

export interface WorldObject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  events?: EventObject[];
  _count?: {
    events: number;
  };
}

export interface ConnectionInput {
  source: string;
  target: string;
  order: number;
}

export interface SaveWorldInput {
  events: EventObject[];
  connections: ConnectionInput[];
}

/**
 * Create a new world
 */
export async function createWorld(input: CreateWorldInput): Promise<WorldObject> {
  const world = await prisma.world.create({
    data: {
      name: input.name,
      userId: input.userId,
    },
    include: {
      _count: {
        select: { events: true },
      },
    },
  });

  return world;
}

/**
 * Delete a world (cascade will delete events and connections)
 */
export async function deleteWorld(worldId: string, userId: string): Promise<boolean> {
  // Verify ownership
  const world = await prisma.world.findUnique({
    where: { id: worldId },
  });

  if (!world || world.userId !== userId) {
    return false;
  }

  await prisma.world.delete({
    where: { id: worldId },
  });

  return true;
}

/**
 * update a world's events and connections
 */
export async function saveWorld(
  worldId: string,
  userId: string,
  data: SaveWorldInput
): Promise<void> {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
  });

  if (!world || world.userId !== userId) {
    throw new Error("Unauthorized or world not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.event.deleteMany({
      where: { worldId },
    });

    if (data.events.length > 0) {
      const eventPromises = data.events.map((event) =>
        tx.event.create({
          data: {
            id: event.id,
            title: event.title,
            description: event.description,
            positionX: event.positionX,
            positionY: event.positionY,
            worldId,
            authorId: userId,
          },
        })
      );

      await Promise.all(eventPromises);
    }

    if (data.connections.length > 0) {
      const connectionPromises = data.connections.map((conn) =>
        tx.eventConnection.create({
          data: {
            prevId: conn.source,
            nextId: conn.target,
            order: conn.order,
          },
        })
      );

      await Promise.all(connectionPromises);
    }

    await tx.world.update({
      where: { id: worldId },
      data: { updatedAt: new Date() },
    });
  });
}
