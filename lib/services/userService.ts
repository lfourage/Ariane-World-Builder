import { prisma } from "@db";
import bcrypt from "bcryptjs";
import validator from "validator";

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
  image?: string;
}

export async function registerUser(input: RegisterInput): Promise<string> {
  const name = input.name ? validator.escape(validator.trim(input.name)) : undefined;
  const email = validator.normalizeEmail(input.email) || input.email;
  const password = input.password;
  const image = input.image;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image,
    },
    select: { id: true },
  });

  return user.id;
}