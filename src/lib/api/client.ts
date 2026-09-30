import { API_BASE_URL, DEMO_MODE } from "@/lib/demo";

export class ApiUnavailableError extends Error {
  constructor(message = "API unavailable") {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

export type ApiErrorCode = "unauthorized" | "validation" | "network" | "server";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: ApiErrorCode,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function errorCode(status: number): ApiErrorCode {
  if (status === 401) return "unauthorized";
  if (status === 400 || status === 422) return "validation";
  if (status === 0) return "network";
  return "server";
}

/**
 * Live fetch against NestJS. Always sends cookies.
 * Auth must use this — it is not gated by demo mode.
 */
export async function apiSend<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL is not configured", 0, "network");
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      method: options.method ?? "GET",
      credentials: "include",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch {
    throw new ApiError("Network error", 0, "network");
  }

  const payload = await parseJson(res);
  if (!res.ok) {
    throw new ApiError("Request failed", res.status, errorCode(res.status));
  }

  return payload as T;
}

/**
 * Thin fetch wrapper. Never throws UI-breaking errors for the demo —
 * callers should catch and fall back to local store / mock data.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (DEMO_MODE || !API_BASE_URL) {
    throw new ApiUnavailableError("Demo mode or missing API base URL");
  }

  try {
    return await apiSend<T>(path, options);
  } catch {
    throw new ApiUnavailableError(`HTTP error`);
  }
}

/** Soft health check — returns false instead of throwing. */
export async function checkApiHealth(): Promise<boolean> {
  if (DEMO_MODE || !API_BASE_URL) return false;
  try {
    const data = await apiRequest<{ status?: string }>("/health", {
      signal: AbortSignal.timeout(2500),
    });
    return data?.status === "ok";
  } catch {
    return false;
  }
}

/**
 * Prefer live API when available; otherwise use the demo fallback.
 */
export async function withDemoFallback<T>(
  live: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (DEMO_MODE || !API_BASE_URL) {
    return fallback();
  }
  try {
    return await live();
  } catch {
    return fallback();
  }
}
