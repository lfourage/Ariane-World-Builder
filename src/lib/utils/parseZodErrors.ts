import { ZodError } from "zod";

export function parseZodErrors(error: ZodError) {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
  });
  return fieldErrors;
}
