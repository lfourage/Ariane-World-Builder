import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@db";
import { registerSchema } from "@schemas/userSchema";
import { withErrorHandler } from "@utils/withErrorHandler";

async function handler(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.parse(body);
  const { name, password, email, image } = parsed;
  const hashedPassword = (await bcrypt.hash(password, 10)).toString();

  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      email,
      image,
    },
  });

  return NextResponse.json(
    { message: "User created", userId: user.id },
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);