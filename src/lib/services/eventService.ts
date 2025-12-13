import { prisma } from "@lib/db/prisma";

// Types
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

/**
 * Save complete schema (replace all events & connections)
 * Uses transaction for atomicity
 */
export async function saveWorldSchema(
  worldId: string,
  userId: string,
  data: SaveSchemaInput
): Promise<void> {
  // Verify ownership
  const world = await prisma.world.findUnique({
    where: { id: worldId },
  });

  if (!world || world.userId !== userId) {
    throw new Error("Unauthorized or world not found");
  }

  // Use transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // Delete all existing events and connections for this world
    // (Cascade will handle EventConnections)
    await tx.event.deleteMany({
      where: { worldId },
    });

    // Create all events
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

    // Create all connections
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

    // Update world's updatedAt timestamp
    await tx.world.update({
      where: { id: worldId },
      data: { updatedAt: new Date() },
    });
  });
}

/**
 * Load schema from database
 */
export async function loadWorldSchema(worldId: string, userId: string) {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
    include: {
      events: {
        include: {
          nexts: true,
          prevs: true,
        },
      },
    },
  });

  if (!world || world.userId !== userId) {
    return null;
  }

  return world;
}

/**
 * Update a single event
 */
export async function updateEvent(
  eventId: string,
  userId: string,
  data: Partial<EventInput>
): Promise<any> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { world: true },
  });

  if (!event || event.world.userId !== userId) {
    throw new Error("Unauthorized or event not found");
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data,
  });

  return updated;
}

/**
 * Delete a single event
 */
export async function deleteEvent(eventId: string, userId: string): Promise<void> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { world: true },
  });

  if (!event || event.world.userId !== userId) {
    throw new Error("Unauthorized or event not found");
  }

  await prisma.event.delete({
    where: { id: eventId },
  });
}
