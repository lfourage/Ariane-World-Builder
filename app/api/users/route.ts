export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { withErrorHandler } from "@utils/withErrorHandler";
import { getAllUsers } from "@services/userService";

async function handler() {
  const userList = await getAllUsers();

  return NextResponse.json(userList);
}

export const GET = withErrorHandler(handler);
