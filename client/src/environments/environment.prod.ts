export const serverPath = 'https://kaykayehnn.herokuapp.com/ng-chess';

export function getWebsocketPath () {
  const path = serverPath
    .replace(/^https?/, 'wss');

  return path;
}

export const environment = {
  production: true,
  getWebsocketPath
};
