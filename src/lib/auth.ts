const AUTH_KEY = "naguanagua_auth";

export type AuthUser = { email: string; role: "citizen" | "mayor" | null };

export const DEMO_CREDENTIALS = { email: "alcadia@gmail.com", password: "12345678" };

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}
