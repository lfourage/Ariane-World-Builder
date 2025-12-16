import { withApi } from "@api/withApi";
import { ApiResponse } from "@utils/response";
import { ApiError } from "@lib/errors/ApiError";
import { registerSchema } from "@schemas/userSchema";
import { registerUser } from "@services/userService";
import { prisma } from "@lib/db/prisma";

export const POST = withApi(async ({ req }) => {
  const body = await req.json();
  const data = registerSchema.parse(body);

  try {
    const userId = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return ApiResponse.created(user);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      throw new ApiError("User already exists", 409, "USER_EXISTS");
    }
    throw error;
  }
});
