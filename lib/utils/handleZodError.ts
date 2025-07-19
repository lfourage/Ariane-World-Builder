import { ZodError } from "zod";
import { parseZodErrors } from "@utils/parseZodErrors";

export function handleZodError(error: ZodError) {
  const errors = parseZodErrors(error);
  return { status: 400, body: { errors } };
}
