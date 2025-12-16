import { prisma } from "@lib/db/prisma";
import bcrypt from "bcryptjs";
import validator from "validator";

export interface RegisterUserInput {
  name?: string;
  email: string;
  password: string;
  image?: string;
}

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

function sanitizeRegisterInput(input: RegisterUserInput): RegisterUserInput {
  return {
    name: input.name ? validator.escape(validator.trim(input.name)) : undefined,
    email: validator.normalizeEmail(input.email) || input.email,
    password: input.password.trim(),
    image: input.image?.trim(),
  };
}

export async function registerUser(input: RegisterUserInput): Promise<string> {
  const { name, email, password, image } = sanitizeRegisterInput(input);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error(`User with email ${email} already exists`);
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

export async function verifyPassword(email: string, password: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
