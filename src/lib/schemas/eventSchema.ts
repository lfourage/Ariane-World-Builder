import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  worldId: z.string(),
  positionX: z.number(),
  positionY: z.number(),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
});
