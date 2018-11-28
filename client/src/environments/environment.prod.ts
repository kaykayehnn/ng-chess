export function getWebsocketPath () {
  const path = window.location.origin
    .replace(/^http/, 'ws');

  return path;
}

export const environment = {
  production: true,
  getWebsocketPath
};
