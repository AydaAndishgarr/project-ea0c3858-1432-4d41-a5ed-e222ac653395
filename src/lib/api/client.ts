import { API_BASE_URL, DEMO_MODE } from "@/lib/demo";

export class ApiUnavailableError extends Error {
  constructor(message = "API unavailable") {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * Thin fetch wrapper. Never throws UI-breaking errors for the demo —
 * callers should catch and fall back to local store / mock data.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (DEMO_MODE || !API_BASE_URL) {
    throw new ApiUnavailableError("Demo mode or missing API base URL");
  }

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!res.ok) {
    throw new ApiUnavailableError(`HTTP ${res.status}`);
  }

  return (await res.json()) as T;
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
