import { LIMITS, API } from "@/constants";
import { AppError, ErrorHandler } from "@/errors";

/**
 * API Client
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl = API.BASE_URL, timeout = API.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make a GET request
   */
  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * Make a POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Core request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await this.handleErrorResponse(response);
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw ErrorHandler.handle(error);
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<AppError> {
    try {
      const data = await response.json();
      return new AppError(
        data.code || "API_ERROR",
        data.message || "An error occurred",
        response.status,
        data.details
      );
    } catch {
      return new AppError(
        "API_ERROR",
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
  }
}

/**
 * Global API client instance
 */
export const apiClient = new ApiClient();

/**
 * Helper function to validate URL
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Helper function to validate slug
 */
export function validateSlug(slug: string): boolean {
  if (slug.length < LIMITS.SLUG_MIN_LENGTH || slug.length > LIMITS.SLUG_MAX_LENGTH) {
    return false;
  }
  return LIMITS.CUSTOM_SLUG_PATTERN.test(slug);
}

/**
 * Helper function to format URL for display
 */
export function formatUrlForDisplay(url: string, maxLength = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
}
