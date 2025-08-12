export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@utils/withErrorHandler";
import { deleteSchema } from "@schemas/userSchema";
import { deleteUser } from "@services/userService";

async function handler(req: NextRequest) {
  const body = await req.json();
  const { id } = deleteSchema.parse(body);

  await deleteUser(id);

  return NextResponse.json(
    { message: "User deleted" },
    { status: 204 }
  );
}

export const POST = withErrorHandler(handler);