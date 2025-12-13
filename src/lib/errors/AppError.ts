export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
    };
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    public details?: any
  ) {
    super(message, 422, "VALIDATION_ERROR");
  }
}
