import { prisma } from "@db";
import { CreateEventSchema, InsertEventSchema } from "@lib/schemas/eventSchema";
import {
  //  Event,
  CreateEventRequest,
  InsertEventRequest,
  //  UpdateEventRequest,
} from "@lib/types/EventTypes";

export class EventService {
  async createEvent(input: CreateEventRequest): Promise<string> {
    const { title, data, authorId } = CreateEventSchema.parse(input);

    const newEvent = await prisma.event.create({
      data: {
        title,
        data: data || {},
        authorId,
      },
      select: {
        id: true,
      },
    });

    return newEvent.id;
  }

  async createEventConnection(type: string = "LINEAR", prevId: string, ) {}

  async insertEventBetween(targetId: string, prevId: string, nextId: string) {}
}
