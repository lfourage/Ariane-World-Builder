export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { withErrorHandler } from "@utils/withErrorHandler";
import { registerSchema, deleteSchema, editSchema } from "@schemas/userSchema";
import { UserService } from "@services/userService";

const userService = new UserService();

async function getHandler() {
  const userList = await userService.getAllUsers();

  return NextResponse.json(userList);
}

async function postHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.parse(body);

  const userId = await userService.registerUser(parsed);

  return NextResponse.json(
    { message: "User created", userId },
    { status: 201 }
  );
}

async function deleteHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = deleteSchema.parse(body);

  await userService.deleteUser(parsed.id);

  return NextResponse.json({ message: "User deleted" }, { status: 200 });
}

async function putHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = editSchema.parse(body);

  const userId = await userService.editUser(parsed);

  return NextResponse.json(
    { message: "User updated", userId },
    { status: 200 }
  );
}

export const GET = withErrorHandler(getHandler);
export const POST = withErrorHandler(postHandler);
export const DELETE = withErrorHandler(deleteHandler);
export const PUT = withErrorHandler(putHandler);
