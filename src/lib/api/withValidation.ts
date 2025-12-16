import { z } from "zod";
import { ValidationError } from "@lib/errors/ApiError";
import type { Middleware } from "@lib/types/api";

export const withValidation = (schemas: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}): Middleware => {
  return async (ctx, next) => {
    if (schemas.body) {
      const body = await ctx.req.json().catch(() => ({}));
      const result = schemas.body.safeParse(body);

      if (!result.success) {
        throw new ValidationError("Invalid request body", result.error.cause);
      }

      (ctx as any).body = result.data;
    }

    if (schemas.query) {
      const url = new URL(ctx.req.url);
      const query = Object.fromEntries(url.searchParams);
      const result = schemas.query.safeParse(query);

      if (!result.success) {
        throw new ValidationError("Invalid query parameters", result.error.cause);
      }

      (ctx as any).query = result.data;
    }

    if (schemas.params && ctx.params) {
      const result = schemas.params.safeParse(ctx.params);

      if (!result.success) {
        throw new ValidationError("Invalid URL parameters", result.error.cause);
      }

      ctx.params = result.data;
    }

    return next();
  };
};
