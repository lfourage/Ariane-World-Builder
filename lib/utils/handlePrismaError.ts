import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const handlePrismaError = (error: unknown) => {
  if (
    error instanceof PrismaClientKnownRequestError ||
    (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as any).code === "string")
  ) {
    const e = error as PrismaClientKnownRequestError;
    switch (e.code) {
      case "P2002":
        return { status: 409, body: { error: e.message } };
      case "P2025":
        return { status: 404, body: { error: e.message } };
      default:
        return { status: 400, body: { error: e.message } };
    }
  } else if (error instanceof PrismaClientValidationError) {
    return { status: 422, body: { error: error.message } };
  }

  return null;
};
