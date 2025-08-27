export type Event = {
  id: string;
  title: string;
  data: {
    description?: string;
    date?: string;
    importance?: number;
    tags?: string[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
};

export type CreateEventRequest = {
  title: string;
  data: Event["data"];
};

export type UpdateEventRequest = {
  title?: string;
  data?: Event["data"];
};
