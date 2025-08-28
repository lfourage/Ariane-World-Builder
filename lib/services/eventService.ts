import { prisma } from "@db";
import { CreateEventSchema } from "@lib/schemas/eventSchema";
import type {
  //  Event,
  CreateEventRequest,
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

//  async insertEvent(input: )
}
