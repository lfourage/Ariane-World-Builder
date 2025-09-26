export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@utils/withErrorHandler";
import { deleteSchema } from "@schemas/userSchema";
import { deleteUser } from "@services/userService";

async function handler(req: NextRequest) {
  const body = await req.json();
  const parsed = deleteSchema.parse(body);

  await deleteUser(parsed.id);

  return NextResponse.json(
    { message: "User deleted" },
    { status: 200 }
  );
}

export const DELETE = withErrorHandler(handler);