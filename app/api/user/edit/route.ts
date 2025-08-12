export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@utils/withErrorHandler";
import { editSchema } from "@schemas/userSchema";
import { editUser } from "@services/userService";

async function handler(req: NextRequest) {
  const body = await req.json();
  const parsed = editSchema.parse(body);

  const userId = await editUser(parsed);

  return NextResponse.json(
    { message: "User updated", userId },
    { status: 200 }
  );
}

export const POST = withErrorHandler(handler);