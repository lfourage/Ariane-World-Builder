export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@utils/withErrorHandler";
import { registerSchema } from "@schemas/userSchema";
import { registerUser } from "@services/userService";

async function handler(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.parse(body);

  const userId = await registerUser(parsed);

  return NextResponse.json(
    { message: "User created", userId },
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);
