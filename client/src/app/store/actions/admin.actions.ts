import { Action } from '@ngrx/store';

import { User } from '../../models/User';
import { Game } from '../../models/Game';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_GAMES = 'FETCH_GAMES';

export class FetchUsers implements Action {
  type: string = FETCH_USERS;
  constructor (public payload: User[]) { }
}

export class FetchGames implements Action {
  type: string = FETCH_GAMES;
  constructor (public payload: Game[]) { }
}
