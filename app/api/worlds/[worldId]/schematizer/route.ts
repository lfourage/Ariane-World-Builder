import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { saveWorld } from "@services/worldService";
import { z } from "zod";

const saveSchematizerSchema = z.object({
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

export const PUT = withApi(
  async ({ params, user, req }) => {
    const body = await req.json();

    const data = saveSchematizerSchema.parse(body);

    await saveWorld(params!.worldId, user!.id, data);

    return ApiResponse.json({ message: "World saved successfully" });
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
