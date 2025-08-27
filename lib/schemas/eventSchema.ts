import { z } from "zod";

const EventNodeDataSchema = z.object({
  description: z.string(),
});

const EventConnectionSchema = z.object({
  type: z.enum(["LINEAR", "TIMETRAVEL"]),
  nextId: z.cuid().optional(),
  prevId: z.cuid().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string(),
  data: EventNodeDataSchema,
  nexts: z.array(EventConnectionSchema).optional(),
  prevs: z.array(EventConnectionSchema).optional(),
});
