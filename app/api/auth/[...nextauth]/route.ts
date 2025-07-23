import NextAuth, { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@db";
import bcrypt from "bcryptjs";
import { loginSchema } from "@schemas/userSchema";
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

export const authOptions : NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing credentials");

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) throw new Error("Invalid credentials format");

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.password) throw new Error("Invalid credentials");

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
