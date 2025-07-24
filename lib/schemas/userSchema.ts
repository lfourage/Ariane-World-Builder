import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  image: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})
