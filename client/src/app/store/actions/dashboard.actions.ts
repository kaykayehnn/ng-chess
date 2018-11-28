import { Action } from '@ngrx/store';

import { UserStats } from '../../contracts/UserStats';
import { Game } from '../../models/Game';

export const FETCH_STATS = 'FETCH_STATS';
export const FETCH_MATCHES = 'FETCH_MATCHES';

export class FetchStats implements Action {
  type: string = FETCH_STATS;
  constructor (public payload: UserStats) { }
}

export class FetchMatches implements Action {
  type: string = FETCH_MATCHES;
  constructor (public payload: Game[]) { }
}
