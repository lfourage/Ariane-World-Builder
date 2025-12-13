import { getServerSession } from "next-auth";
import { authConfig } from "@lib/auth/config";
import { UnauthorizedError, ForbiddenError } from "@lib/errors/ApiError";
import type { Middleware } from "@lib/types/api";

export const withAuth = (options?: { roles?: string[] }): Middleware => {
  return async (ctx, next) => {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      throw new UnauthorizedError();
    }

    if (options?.roles && options.roles.length > 0) {
      const userRole = (session.user as any).role;
      if (!options.roles.includes(userRole)) {
        throw new ForbiddenError("Insufficient permissions");
      }
    }

    ctx.user = session.user;
    return next();
  };
};
