/**
 * Error mapper utility
 * Maps generic error messages to specific form fields with user-friendly messages
 */

export interface MappedError {
  field: string;
  message: string;
}

/**
 * Maps an error message and optional code to a specific field and user-friendly message
 */
export function mapErrorToField(message: string, code?: string): MappedError {
  const lowerMsg = message.toLowerCase();

  // Email already exists
  if (
    code === "USER_EXISTS" ||
    code === "DUPLICATE_ENTRY" ||
    (lowerMsg.includes("email") &&
      (lowerMsg.includes("already") ||
        lowerMsg.includes("exists") ||
        lowerMsg.includes("taken") ||
        lowerMsg.includes("registered") ||
        lowerMsg.includes("in use") ||
        lowerMsg.includes("duplicate")))
  ) {
    return {
      field: "email",
      message: "This email is already registered. Please sign in or use a different email.",
    };
  }

  // Invalid email format
  if (
    lowerMsg.includes("invalid email") ||
    lowerMsg.includes("email format") ||
    lowerMsg.includes("valid email")
  ) {
    return {
      field: "email",
      message: "Please enter a valid email address.",
    };
  }

  // Password incorrect (login)
  if (
    lowerMsg.includes("password") &&
    (lowerMsg.includes("incorrect") || lowerMsg.includes("wrong") || lowerMsg.includes("invalid"))
  ) {
    return {
      field: "password",
      message: "Incorrect password. Please try again.",
    };
  }

  // Password too short
  if (
    lowerMsg.includes("password") &&
    (lowerMsg.includes("short") || lowerMsg.includes("at least") || lowerMsg.includes("minimum"))
  ) {
    return {
      field: "password",
      message: "Password must be at least 8 characters long.",
    };
  }

  // Password mismatch
  if (
    lowerMsg.includes("password") &&
    (lowerMsg.includes("match") ||
      lowerMsg.includes("confirm") ||
      lowerMsg.includes("same") ||
      lowerMsg.includes("don't match"))
  ) {
    return {
      field: "confirmPassword",
      message: "Passwords don't match.",
    };
  }

  // Name required
  if (lowerMsg.includes("name") && lowerMsg.includes("required")) {
    return {
      field: "name",
      message: "Name is required.",
    };
  }

  // Name too short
  if (
    lowerMsg.includes("name") &&
    (lowerMsg.includes("short") || lowerMsg.includes("at least") || lowerMsg.includes("minimum"))
  ) {
    return {
      field: "name",
      message: "Name must be at least 2 characters long.",
    };
  }

  // Invalid credentials (login) - This is what NextAuth returns
  if (
    lowerMsg.includes("credentials") ||
    lowerMsg.includes("invalid login") ||
    lowerMsg.includes("user not found") ||
    lowerMsg.includes("credentialssignin") ||
    message === "CredentialsSignin"
  ) {
    return {
      field: "email",
      message: "Invalid email or password.",
    };
  }

  // Default: return as general error
  return {
    field: "general",
    message: message || "An unexpected error occurred",
  };
}

/**
 * Maps Zod validation errors to field-specific errors
 */
export function mapZodErrors(
  errors: Array<{ path: PropertyKey[]; message: string }>
): Record<string, string> {
  const mappedErrors: Record<string, string> = {};

  errors.forEach((error) => {
    if (error.path.length > 0) {
      const field = String(error.path[0]);
      mappedErrors[field] = error.message;
    } else {
      mappedErrors.general = error.message;
    }
  });

  return mappedErrors;
}
