import { prisma } from "@db";
import { UserAlreadyExistsError } from "@lib/types/UserAlreadyExistsError";
import bcrypt from "bcryptjs";
import validator from "validator";

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
  image?: string;
}

function sanitizeRegisterInput(input: RegisterInput): RegisterInput {
  return {
    name: input.name ? validator.escape(validator.trim(input.name)) : undefined,
    email: validator.normalizeEmail(input.email) || input.email,
    password: input.password.trim(),
    image: input.image?.trim(),
  };
}

export async function registerUser(input: RegisterInput): Promise<string> {
  const { name, email, password, image } = sanitizeRegisterInput(input);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new UserAlreadyExistsError(email);
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
