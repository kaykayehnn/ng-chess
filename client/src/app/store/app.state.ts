import { ChessState } from "./state/chess.state";
import { UserState } from "./state/user.state";

export interface AppState {
  readonly chess: ChessState,
  readonly user: UserState
}
