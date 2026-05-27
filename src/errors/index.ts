/**
 * Custom Error Classes
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super("VALIDATION_ERROR", message, 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super("NOT_FOUND", message, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super("UNAUTHORIZED", message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super("FORBIDDEN", message, 403);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super("CONFLICT", message, 409);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = "Too many requests",
    public retryAfter?: number
  ) {
    super("RATE_LIMITED", message, 429);
    this.name = "RateLimitError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network error") {
    super("NETWORK_ERROR", message, 0);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = "Request timeout") {
    super("TIMEOUT", message, 0);
    this.name = "TimeoutError";
  }
}

/**
 * Error Handler
 */
export class ErrorHandler {
  static handle(error: unknown): AppError {
    // If it's already an AppError, return it
    if (error instanceof AppError) {
      return error;
    }

    // If it's a standard Error
    if (error instanceof Error) {
      if (error.message.includes("network") || error.message.includes("fetch")) {
        return new NetworkError(error.message);
      }
      if (error.message.includes("timeout")) {
        return new TimeoutError(error.message);
      }
      return new AppError("UNKNOWN_ERROR", error.message, 500);
    }

    // If it's something else
    return new AppError(
      "UNKNOWN_ERROR",
      "An unexpected error occurred",
      500,
      error
    );
  }

  static getMessage(error: unknown): string {
    if (error instanceof AppError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  }

  static getCode(error: unknown): string {
    if (error instanceof AppError) {
      return error.code;
    }
    return "UNKNOWN_ERROR";
  }

  static getStatusCode(error: unknown): number {
    if (error instanceof AppError) {
      return error.statusCode;
    }
    return 500;
  }

  static log(error: unknown, context?: string) {
    const appError = this.handle(error);
    console.error(
      `[${context || "Error"}] ${appError.code}: ${appError.message}`,
      appError.details
    );
  }
}

/**
 * Async Error Handler Wrapper
 */
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw ErrorHandler.handle(error);
    }
  }) as T;
}

/**
 * Try-Catch Wrapper
 */
export function tryCatch<T>(fn: () => T): [T | null, Error | null] {
  try {
    return [fn(), null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Safe JSON Parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON Stringify
 */
export function safeJsonStringify(obj: any, fallback = "{}"): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
}

/**
 * Result Type (similar to Rust's Result)
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function Ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Promise Result Handler
 */
export async function resultOf<T>(
  promise: Promise<T>
): Promise<Result<T, Error>> {
  try {
    const value = await promise;
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}
