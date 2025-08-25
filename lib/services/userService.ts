import { prisma } from "@db";
import bcrypt from "bcryptjs";
import validator from "validator";
import { UserAlreadyExistsError } from "@lib/types/UserAlreadyExistsError";

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
  image?: string;
}

interface EditInput {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
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

function sanitizeEditInput(input: EditInput): EditInput {
  return {
    id: input.id,
    name: input.name ? validator.escape(validator.trim(input.name)) : undefined,
    email: input.email
      ? validator.normalizeEmail(input.email) || input.email
      : undefined,
    image: input.image?.trim(),
  };
}

export async function getAllUsers() {
  const data = await prisma.user.findMany();
  const userList: Array<User> = data.map((u: User) => {
    return {
      id: u.id,
      name: u.name ? u.name : "",
      email: u.email,
      image: u.image ? u.image : "",
    };
  });

  return userList;
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

export async function editUser(input: EditInput): Promise<string> {
  const { id, name, email, image } = sanitizeEditInput(input);

  const updated = await prisma.user.update({
    where: { id: id },
    data: {
      ...(name !== undefined && { name: name }),
      ...(email !== undefined && { email: email }),
      ...(image !== undefined && { image: image }),
    },
  });

  return updated.id;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id: id } });
}
