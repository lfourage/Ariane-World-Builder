import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const handlePrismaError = (error: unknown) => {  console.error("PRISMA ERROR CAUGHT:", error); // ← ajoute ça
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        return { status: 409, body: { error: error.message } };
      }
      case "P2025": {
        return { status: 404, body: { error: error.message } };
      }
      default: {
        return { status: 400, body: { error: error.message } };
      }
    }
  } else if (error instanceof PrismaClientValidationError) {
    return { status: 422, body: { error: error.message } };
  }
  return null;
};
