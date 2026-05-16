/**
 * Auth token provider — pluggable so the same client works in the browser,
 * SSR, and Node test environments. The web app wires this to its zustand store.
 */
export type TokenProvider = () => string | null;
export type UnauthorizedHandler = () => void;

let getToken: TokenProvider = () => null;
let onUnauthorized: UnauthorizedHandler = () => {};

export function configureAuth(opts: {
  getToken?: TokenProvider;
  onUnauthorized?: UnauthorizedHandler;
}): void {
  if (opts.getToken) getToken = opts.getToken;
  if (opts.onUnauthorized) onUnauthorized = opts.onUnauthorized;
}

export function getAuthToken(): string | null {
  return getToken();
}

export function triggerUnauthorized(): void {
  onUnauthorized();
}
