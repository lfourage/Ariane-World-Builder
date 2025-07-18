import type { NextApiResponse } from "next";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const handlePrismaError = (res: NextApiResponse, error: unknown) => {
  let status = 500;
  let message = "Unknown error";

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        status = 409;
        break;
      }
      case "P2025": {
        status = 404;
        break;
      }
      default: {
        status = 400;
      }
    }
    message = error.message;
  } else if (error instanceof PrismaClientValidationError) {
    status = 422;
    message = error.message;
  }
  return res.status(status).json({
    error: {
      message,
    },
  });
};
