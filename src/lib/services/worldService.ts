import { prisma } from "@lib/db/prisma";

// Types
export interface CreateWorldInput {
  name: string;
  userId: string;
}

export interface UpdateWorldInput {
  name?: string;
  description?: string | null;
}

export interface WorldWithEvents {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  events: any[];
  _count?: {
    events: number;
  };
}

/**
 * Get all worlds for a specific user
 */
export async function getWorldsByUserId(userId: string): Promise<WorldWithEvents[]> {
  const worlds = await prisma.world.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { events: true },
      },
    },
  });

  return worlds;
}

/**
 * Get a single world by ID with all events and connections
 */
export async function getWorldById(
  worldId: string,
  userId: string
): Promise<WorldWithEvents | null> {
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

  // Verify ownership
  if (world && world.userId !== userId) {
    return null;
  }

  return world;
}

/**
 * Create a new world
 */
export async function createWorld(input: CreateWorldInput): Promise<WorldWithEvents> {
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
 * Update world metadata (name, description)
 */
export async function updateWorld(
  worldId: string,
  userId: string,
  input: UpdateWorldInput
): Promise<WorldWithEvents | null> {
  // Verify ownership
  const world = await prisma.world.findUnique({
    where: { id: worldId },
  });

  if (!world || world.userId !== userId) {
    return null;
  }

  const updated = await prisma.world.update({
    where: { id: worldId },
    data: {
      ...input,
      updatedAt: new Date(),
    },
    include: {
      _count: {
        select: { events: true },
      },
    },
  });

  return updated;
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
 * Get the most recent world for a user
 */
export async function getLastWorld(userId: string): Promise<WorldWithEvents | null> {
  const worlds = await getWorldsByUserId(userId);
  return worlds.length > 0 ? worlds[0] : null;
}
