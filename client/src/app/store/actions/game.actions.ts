import { Action } from "@ngrx/store";
import { Game } from "../../models/Game";

export const FETCH_GAME = 'FETCH_GAME'

export class FetchGame implements Action {
  type: string = FETCH_GAME
  constructor (public payload: Game) { }
}
