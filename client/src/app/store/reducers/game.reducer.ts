import { GameState } from "../state/game.state";
import { FETCH_GAME } from "../actions/game.actions";
import { chessReducer } from "./chess.reducer";

import { initialState as chessInitialState } from './chess.reducer'

const initialState: GameState = {
  data: null,
  board: chessInitialState
}

export function gameReducer (state: GameState = initialState, action) {
  switch (action.type) {
    case FETCH_GAME:
      return {
        ...state, data: {
          color: action.payload.color,
          fen: action.payload.fen,
          ...action.payload.game
        }
      }
    default:
      return { ...state, board: chessReducer(state.board, action) }
  }
}
