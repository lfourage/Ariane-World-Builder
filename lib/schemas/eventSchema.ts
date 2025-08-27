import { z } from "zod";

const EventNodeDataSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const EventConnectionSchema = z.object({}); 

export const CreateEventSchema = z.object({
  data: EventNodeDataSchema,
  nexts: z.array(EventConnectionSchema).optional(),
  prevs: z.array(EventConnectionSchema).optional(),
});
