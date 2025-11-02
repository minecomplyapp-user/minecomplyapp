import Constants from "expo-constants";
import { supabase } from "./supabase";

const apiBaseUrl = resolveApiBaseUrl();

if (__DEV__) {
  const extra = Constants?.expoConfig?.extra || {};
  let useRenderApi: boolean = false;
  if (typeof extra.USE_RENDER_API === "string") {
    useRenderApi = extra.USE_RENDER_API.toLowerCase() === "true";
  } else if (typeof extra.USE_RENDER_API === "boolean") {
    useRenderApi = extra.USE_RENDER_API;
  }
  if (useRenderApi) {
    console.log("[API] Using RENDER API:", apiBaseUrl);
  } else {
    console.log("[API] Using LOCAL API:", apiBaseUrl);
  }
}

function resolveApiBaseUrl(): string {
  // Read envs from Constants.expoConfig.extra
  const extra = Constants?.expoConfig?.extra || {};
  // USE_RENDER_API can be string or boolean (from .env or app.config.js)
  let useRenderApi: boolean = false;
  if (typeof extra.USE_RENDER_API === "string") {
    useRenderApi = extra.USE_RENDER_API.toLowerCase() === "true";
  } else if (typeof extra.USE_RENDER_API === "boolean") {
    useRenderApi = extra.USE_RENDER_API;
  }

  if (useRenderApi) {
    const renderUrl = sanitizeBaseUrl(
      extra.apiBaseUrl || extra.EXPO_PUBLIC_API_BASE_URL
    );
    if (renderUrl) return renderUrl;
  } else {
    const localUrl = sanitizeBaseUrl(extra.API_BASE_URL);
    if (localUrl) return localUrl;
  }

  // Fallback to dev host detection
  const derived = deriveDevHostBaseUrl();
  if (derived) {
    return derived;
  }
  return "http://localhost:3000";
}

function sanitizeBaseUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.replace(/\/+$/, "");
}

function deriveDevHostBaseUrl(): string | null {
  const host = getDevServerHost();
  if (!host) {
    return null;
  }
  return `http://${host}:3000`;
}

function getDevServerHost(): string | null {
  const candidates: Array<unknown> = [
    (Constants as any)?.expoConfig?.hostUri,
    (Constants as any)?.expoGoConfig?.hostUri,
    (Constants as any)?.manifest?.debuggerHost,
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri,
  ];

  for (const candidate of candidates) {
    const host = parseHost(candidate);
    if (host) {
      return host;
    }
  }

  return null;
}

function parseHost(candidate: unknown): string | null {
  if (typeof candidate !== "string" || candidate.length === 0) {
    return null;
  }

  const value = candidate.includes("://") ? candidate : `http://${candidate}`;

  try {
    const url = new URL(value);
    return url.hostname || null;
  } catch {
    return null;
  }
}

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No Supabase access token");
  return token;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api${path}`, {
      ...init,
      method: "GET",
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    throw new Error(
      `Network error calling GET ${apiBaseUrl}/api${path}: ${msg}. ` +
        `If you're on a physical device, ensure API_BASE_URL is your LAN IP or set USE_RENDER_API=true with EXPO_PUBLIC_API_BASE_URL.`
    );
  }
  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error(body?.message || `GET ${path} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const token = await getAccessToken();
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api${path}`, {
      ...init,
      method: "POST",
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    throw new Error(
      `Network error calling POST ${apiBaseUrl}/api${path}: ${msg}. ` +
        `If you're on a physical device, ensure API_BASE_URL is your LAN IP or set USE_RENDER_API=true with EXPO_PUBLIC_API_BASE_URL.`
    );
  }
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `POST ${path} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function apiDelete<T = void>(
  path: string,
  init?: RequestInit
): Promise<T | void> {
  const token = await getAccessToken();
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api${path}`, {
      ...init,
      method: "DELETE",
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    throw new Error(
      `Network error calling DELETE ${apiBaseUrl}/api${path}: ${msg}. ` +
        `If you're on a physical device, ensure API_BASE_URL is your LAN IP or set USE_RENDER_API=true with EXPO_PUBLIC_API_BASE_URL.`
    );
  }
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `DELETE ${path} failed (${res.status})`);
  }
  // Try to parse JSON; if none, return void
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      return (await res.json()) as T;
    }
  } catch {}
  return undefined;
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const token = await getAccessToken();
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api${path}`, {
      ...init,
      method: "PATCH",
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    throw new Error(
      `Network error calling PATCH ${apiBaseUrl}/api${path}: ${msg}. ` +
        `If you're on a physical device, ensure API_BASE_URL is your LAN IP or set USE_RENDER_API=true with EXPO_PUBLIC_API_BASE_URL.`
    );
  }
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || `PATCH ${path} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}

export async function getJwt(): Promise<string> {
  return getAccessToken();
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Log the JWT access token for debugging
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      console.log("[JWT] Supabase access token:", token);
    } else {
      console.log("[JWT] No Supabase access token found (user not logged in)");
    }
  } catch (e) {
    console.log("[JWT] Error fetching Supabase access token:", e);
  }
})();

export async function deleteFiles(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  await apiPost("/storage/delete-files", { paths });
}

export type {};
