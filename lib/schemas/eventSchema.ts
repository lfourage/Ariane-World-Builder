import { z } from "zod";

const EventNodeDataSchema = z.object({
  description: z.string().optional(),
  date: z.string().optional(),
  importance: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const InsertEventSchema = z.object({
  type: z.enum(["LINEAR", "CAUSES", "TIMETRAVEL"]),
  order: z.int().optional(),
  nextId: z.cuid().optional(),
  prevId: z.cuid().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string(),
  data: EventNodeDataSchema.optional(),
  authorId: z.string(),
});

export const UpdateEventSchema = z.object({
  title: z.string().optional(),
  data: EventNodeDataSchema.optional(),
});
