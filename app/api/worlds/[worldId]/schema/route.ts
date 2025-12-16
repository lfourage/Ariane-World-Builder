import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { saveWorldSchema } from "@services/eventService";
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

export const PUT = withApi(
  async ({ params, user, req }) => {
    const body = await req.json();

    const data = saveSchemaSchema.parse(body);

    await saveWorldSchema(params!.worldId, user!.id, data);

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
