import { z } from "zod";

export const createWorldSchema = z.object({
  name: z.string().min(1, "World name is required"),
  description: z.string().optional(),
});

export const updateWorldSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});
