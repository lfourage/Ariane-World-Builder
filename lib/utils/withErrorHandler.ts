import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleZodError } from "@utils/handleZodError";
import { handlePrismaError } from "@utils//handlePrismaError";

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async function (req: NextRequest): Promise<NextResponse> {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof ZodError) {
        const result = handleZodError(error);
        return NextResponse.json(result.body, { status: result.status });
      }

      const prismaHandled = handlePrismaError(error);
      if (prismaHandled) {
        return NextResponse.json(prismaHandled.body, {
          status: prismaHandled.status,
        });
      }

      // Log the unknown error for debugging
      console.error("Unhandled error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
