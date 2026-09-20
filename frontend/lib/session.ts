import "server-only";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:8000";
const ACCESS_COOKIE = "proofly_access";
const REFRESH_COOKIE = "proofly_refresh";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    super(typeof data === "string" ? data : JSON.stringify(data));
    this.status = status;
    this.data = data;
  }
}

/** Reads the JWT access token from the httpOnly cookie (server-side only). */
export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getAccessToken());
}

/**
 * Server-side fetch against the Django API. Automatically attaches the JWT
 * bearer token (if present) and parses JSON. Used from Server Components,
 * Route Handlers, and Server Actions — never from client components, so
 * the token never reaches the browser bundle.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (auth) {
    const token = await getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = rest.body instanceof FormData;
  if (!isFormData && rest.body && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }
  return data as T;
}

/** Convenience wrapper for public (unauthenticated) GETs — search, business profiles. */
export async function publicFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  return apiFetch<T>(path, { ...options, auth: false });
}

export { API_URL, ACCESS_COOKIE, REFRESH_COOKIE };
