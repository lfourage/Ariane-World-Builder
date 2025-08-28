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

export type EventConnection = {
  type: ConnectionType;
  order?: number,
  nextId?: string;
  prevId?: string;
};


export type InsertEventRequest = {
  sourceId: string;
  connection: EventConnection;
};

export type CreateAndInsertRequest = {
  createReq: CreateEventRequest;
  connection: EventConnection;
};

export type UpdateEventRequest = {
  title?: string;
  data?: Event["data"];
};
