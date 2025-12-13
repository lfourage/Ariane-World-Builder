import { NextRequest } from "next/server";

export interface ApiContext {
  req: NextRequest;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  params?: Record<string, string>;
}

export interface ApiOptions {
  auth?: boolean;
  roles?: string[];
  validate?: {
    body?: any;
    query?: any;
    params?: any;
  };
}

export type Middleware = (ctx: ApiContext, next: () => Promise<Response>) => Promise<Response>;

export type ApiHandler = (ctx: ApiContext) => Promise<Response>;
