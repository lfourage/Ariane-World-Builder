import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError, ValidationError } from "@lib/errors/AppError";

export function parseError(err: unknown) {
  if (err instanceof AppError) {
    return {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        status: err.status,
        ...(err instanceof ValidationError && err.details ? { details: err.details } : {}),
      },
    };
  }

  if (err instanceof ZodError) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        status: 422,
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return {
        success: false,
        error: {
          code: "DUPLICATE_ENTRY",
          message: "Resource already exists",
          status: 409,
        },
      };
    }
    if (err.code === "P2025") {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
          status: 404,
        },
      };
    }
  }

  console.error("Unhandled error:", err);
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production" ? "Internal server error" : (err as Error).message,
      status: 500,
    },
  };
}
