import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { handlePrismaError } from "@/app/lib/utils/handlePrismaError";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API');
  if (req.method !== "POST")
    return res.status(400).json({ message: "Method not allowed" });

  const { name, password, email, image } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const hashedPassword = (await bcrypt.hash(password, 10)).toString();

  try {
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        image,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

