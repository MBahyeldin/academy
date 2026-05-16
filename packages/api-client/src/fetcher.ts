import { ApiError, UnauthorizedError } from "./errors";
import { getAuthToken, triggerUnauthorized } from "./auth";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

function buildQuery(query?: RequestOptions["query"]): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function request<T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, skipAuth, headers, ...rest } = options;
  const url = `${baseUrl}${path}${buildQuery(query)}`;
  const headersOut: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) headersOut.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers: headersOut,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      triggerUnauthorized();
      throw new UnauthorizedError(payload);
    }
    let message = `Request failed: ${res.status}`;
    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
    ) {
      message = (payload as { error: string }).error;
    }
    throw new ApiError(message, res.status, payload);
  }

  return payload as T;
}
