export function parseJwt<T> (token: string): T {
  return JSON.parse(window.atob(token.split('.')[1]))
}