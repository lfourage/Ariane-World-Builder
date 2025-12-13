import { NextRequest } from "next/server";
import { parseError } from "@lib/errors/parseError";
import type { ApiHandler, Middleware, ApiContext, ApiOptions } from "@lib/types/api";
import { withAuth } from "./withAuth";
import { withValidation } from "./withValidation";

export function withApi(
  handler: ApiHandler,
  options: ApiOptions = {}
): (req: NextRequest, context?: { params: Record<string, string> }) => Promise<Response> {
  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    try {
      const ctx: ApiContext = {
        req,
        params: context?.params,
      };

      const middlewares: Middleware[] = [];

      if (options.auth) {
        middlewares.push(withAuth({ roles: options.roles }));
      }

      if (options.validate) {
        middlewares.push(withValidation(options.validate));
      }

      const executeMiddlewares = async (index: number): Promise<Response> => {
        if (index >= middlewares.length) {
          return handler(ctx);
        }

        return middlewares[index](ctx, () => executeMiddlewares(index + 1));
      };

      return await executeMiddlewares(0);
    } catch (err) {
      const parsed = parseError(err);
      return Response.json(parsed, {
        status: parsed.error.status,
      });
    }
  };
}
