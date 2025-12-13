import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { NotFoundError, ForbiddenError } from "@lib/errors/AppError";
import { prisma } from "@lib/db/prisma";
import { z } from "zod";

const saveSchemaSchema = z.object({
  events: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional().nullable(),
      positionX: z.number(),
      positionY: z.number(),
    })
  ),
  connections: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      order: z.number().default(0),
    })
  ),
});

// PUT /api/worlds/[worldId]/schema - Save the complete schema (replace all events & connections)
export const PUT = withApi(
  async ({ params, user, req }) => {
    const body = await req.json();

    const data = saveSchemaSchema.parse(body);

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

    // Use transaction to ensure atomicity (all or nothing)
    await prisma.$transaction(async (tx) => {
      // Delete all existing events and connections for this world
      // (Cascade will handle EventConnections)
      await tx.event.deleteMany({
        where: { worldId: params!.worldId },
      });

      // Create all events
      const eventPromises = data.events.map((event) =>
        tx.event.create({
          data: {
            id: event.id,
            title: event.title,
            description: event.description,
            positionX: event.positionX,
            positionY: event.positionY,
            worldId: params!.worldId,
            authorId: user!.id,
          },
        })
      );

      await Promise.all(eventPromises);

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
        where: { id: params!.worldId },
        data: { updatedAt: new Date() },
      });
    });

    return ApiResponse.json({ message: "Schema saved successfully" });
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
