export type Event = {
  id: string;
  title: string;
  data: {
    description?: string;
    date?: string;
    importance?: number;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
};

export type CreateEventRequest = {
  title: string;
  data: Event["data"];
};

enum ConnectionType {
  LINEAR,
  CAUSES,
  TIMETRAVEL,
}

export type InsertEventRequest = {
  type: ConnectionType;
  prevId?: string;
  nextId?: string;
};

export type CreateAndInsertRequest = {
  createReq: CreateEventRequest;
  connection: InsertEventRequest;
};

export type UpdateEventRequest = {
  title?: string;
  data?: Event["data"];
};
