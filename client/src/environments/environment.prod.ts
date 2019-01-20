export const serverPath = 'https://ng-chess.herokuapp.com';

export function getWebsocketPath () {
  const path = serverPath
    .replace(/^https?/, 'ws');

  return path;
}

export const environment = {
  production: true,
  getWebsocketPath
};
