import NextAuth from "next-auth/next";
import { authConfig } from "@lib/auth/config";

export const handler = NextAuth(authConfig);

// For API routes
export { handler as GET, handler as POST };
