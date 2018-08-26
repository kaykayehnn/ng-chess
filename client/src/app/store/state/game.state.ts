import { ChessState } from "./chess.state";
import { Game } from "../../models/Game";

export interface GameState {
  readonly data: Game,
  readonly board: ChessState
}
