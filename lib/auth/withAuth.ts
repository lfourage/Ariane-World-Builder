import { getSession } from "./getSession";

export function withAuth<T extends (...args: any[]) => any>(
  handler: (session: any, ...args: Parameters<T>) => ReturnType<T>
) {
  return async (...args: Parameters<T>) => {
    const session = await getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    return handler(session, ...args);
  };
}
