import { prisma } from "@lib/db/prisma";

export interface EventInput {
  id: string;
  title: string;
  description?: string | null;
  positionX: number;
  positionY: number;
}

export interface ConnectionInput {
  source: string;
  target: string;
  order: number;
}

export interface SaveSchemaInput {
  events: EventInput[];
  connections: ConnectionInput[];
}

export async function saveWorldSchema(
  worldId: string,
  userId: string,
  data: SaveSchemaInput
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
