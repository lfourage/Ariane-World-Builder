import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { NotFoundError, ForbiddenError } from "@lib/errors/ApiError";
import { prisma } from "@lib/db/prisma";
import { updateEventSchema } from "@schemas/eventSchema";

export const PATCH = withApi(
  async ({ params, user, req }) => {
    const body = await req.json();
    const data = updateEventSchema.parse(body);

    const event = await prisma.event.findUnique({
      where: { id: params!.eventId },
      include: { world: true },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    if (event.world!.userId !== user!.id) {
      throw new ForbiddenError("You don't have permission to edit this event");
    }

    const updated = await prisma.event.update({
      where: { id: params!.eventId },
      data,
    });

    return ApiResponse.json(updated);
  },
  { auth: true }
);

export const DELETE = withApi(
  async ({ params, user }) => {
    const event = await prisma.event.findUnique({
      where: { id: params!.eventId },
      include: { world: true },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    if (event.world!.userId !== user!.id) {
      throw new ForbiddenError("You don't have permission to delete this event");
    }

    await prisma.event.delete({
      where: { id: params!.eventId },
    });

    return ApiResponse.noContent();
  },
  { auth: true }
);
