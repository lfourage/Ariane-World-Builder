import { prisma } from "@db";

interface CreateEventInput {
  title: string;
  data: {
    description: string;
  };
  nextId?: string;
}

export class EventService {
  async createEvent(input: CreateEventInput): Promise<Event> {
    const newEvent = await prisma.event.create(input);

    return newEvent;
  }
}
