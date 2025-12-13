import { prisma } from "@lib/db/prisma";
import bcrypt from "bcryptjs";
import validator from "validator";

// Types
export interface RegisterUserInput {
  name?: string;
  email: string;
  password: string;
  image?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  image?: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

// Helper functions
function sanitizeRegisterInput(input: RegisterUserInput): RegisterUserInput {
  return {
    name: input.name ? validator.escape(validator.trim(input.name)) : undefined,
    email: validator.normalizeEmail(input.email) || input.email,
    password: input.password.trim(),
    image: input.image?.trim(),
  };
}

function sanitizeUpdateInput(input: UpdateUserInput): UpdateUserInput {
  return {
    name: input.name ? validator.escape(validator.trim(input.name)) : undefined,
    email: input.email ? validator.normalizeEmail(input.email) || input.email : undefined,
    image: input.image?.trim(),
  };
}

/**
 * Get all users (admin function)
 */
export async function getAllUsers(): Promise<SafeUser[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return users;
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return user;
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

/**
 * Register a new user
 */
export async function registerUser(input: RegisterUserInput): Promise<string> {
  const { name, email, password, image } = sanitizeRegisterInput(input);

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error(`User with email ${email} already exists`);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
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

/**
 * Update user profile
 */
export async function updateUser(userId: string, input: UpdateUserInput): Promise<SafeUser> {
  const sanitized = sanitizeUpdateInput(input);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(sanitized.name !== undefined && { name: sanitized.name }),
      ...(sanitized.email !== undefined && { email: sanitized.email }),
      ...(sanitized.image !== undefined && { image: sanitized.image }),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return updated;
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
  await prisma.user.delete({ where: { id: userId } });
}

/**
 * Verify user password
 */
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
