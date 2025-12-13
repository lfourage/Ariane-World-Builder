import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { NotFoundError, ForbiddenError } from "@lib/errors/ApiError";
import { prisma } from "@lib/db/prisma";
import { z } from "zod";

const updateWorldSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});

// GET /api/worlds/[worldId] - Get a specific world with all events and connections
export const GET = withApi(
  async ({ params, user }) => {
    const world = await prisma.world.findUnique({
      where: { id: params!.worldId },
      include: {
        events: {
          include: {
            nexts: true,
            prevs: true,
          },
        },
      },
    });

    if (!world) {
      throw new NotFoundError("World not found");
    }

    if (world.userId !== user!.id) {
      throw new ForbiddenError("You don't have permission to view this world");
    }

    return ApiResponse.json(world);
  },
  {
    auth: true,
    validate: {
      params: z.object({
        worldId: z.string(),
      }),
    },
  }
);

// PATCH /api/worlds/[worldId] - Update world metadata (name, description)
export const PATCH = withApi(
  async ({ params, user, req }) => {
    const body = await req.json();
    const data = updateWorldSchema.parse(body);

    // Check if world exists and user owns it
    const world = await prisma.world.findUnique({
      where: { id: params!.worldId },
    });

    if (!world) {
      throw new NotFoundError("World not found");
    }

    if (world.userId !== user!.id) {
      throw new ForbiddenError("You don't have permission to edit this world");
    }

    // Update world
    const updatedWorld = await prisma.world.update({
      where: { id: params!.worldId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return ApiResponse.json(updatedWorld);
  },
  {
    auth: true,
    validate: {
      params: z.object({
        worldId: z.string(),
      }),
    },
  }
);

// DELETE /api/worlds/[worldId] - Delete a world and all its events
export const DELETE = withApi(
  async ({ params, user }) => {
    // Check if world exists and user owns it
    const world = await prisma.world.findUnique({
      where: { id: params!.worldId },
    });

    if (!world) {
      throw new NotFoundError("World not found");
    }

    if (world.userId !== user!.id) {
      throw new ForbiddenError("You don't have permission to delete this world");
    }

    // Delete world (cascade will delete events and connections)
    await prisma.world.delete({
      where: { id: params!.worldId },
    });

    return ApiResponse.noContent();
  },
  {
    auth: true,
    validate: {
      params: z.object({
        worldId: z.string(),
      }),
    },
  }
);
