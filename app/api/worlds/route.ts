import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { prisma } from "@lib/db/prisma";
import { createWorldSchema } from "@lib/schemas/worldSchema";

// GET /api/worlds - Get all worlds for the authenticated user
export const GET = withApi(
  async ({ user }) => {
    const worlds = await prisma.world.findMany({
      where: { userId: user!.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    return ApiResponse.json(worlds);
  },
  { auth: true }
);

// POST /api/worlds - Create a new world
export const POST = withApi(
  async ({ user, req }) => {
    const body = await req.json();

    const data = createWorldSchema.parse(body);

    const world = await prisma.world.create({
      data: {
        name: data.name,
        userId: user!.id,
      },
    });

    return ApiResponse.created(world);
  },
  { auth: true }
);
