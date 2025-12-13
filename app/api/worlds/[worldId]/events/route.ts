import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { NotFoundError, ForbiddenError } from "@lib/errors/ApiError";
import { prisma } from "@lib/db/prisma";
import { createEventSchema } from "@schemas/eventSchema";
import { z } from "zod";

export const GET = withApi(
  async ({ params }) => {
    const events = await prisma.event.findMany({
      where: { worldId: params!.worldId },
    });

    return ApiResponse.json(events);
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

export const POST = withApi(
  async ({ params, user, req }) => {
    const body = await req.json();
    const data = createEventSchema.parse(body);

    // Vérifier que le world appartient à l'utilisateur
    const world = await prisma.world.findUnique({
      where: { id: params!.worldId },
    });

    if (!world) {
      throw new NotFoundError("World not found");
    }

    if (world.userId !== user!.id) {
      throw new ForbiddenError("You don't have permission to add events to this world");
    }

    const event = await prisma.event.create({
      data: {
        ...data,
        worldId: params!.worldId,
        authorId: user!.id,
      },
    });

    return ApiResponse.created(event);
  },
  { auth: true }
);
