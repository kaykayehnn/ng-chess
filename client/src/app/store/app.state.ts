import { ChessState } from "./state/chess.state";
import { UserState } from "./state/user.state";
import { RoomState } from "./state/room.state";

export interface AppState {
  readonly chess: ChessState,
  readonly user: UserState,
  readonly rooms: RoomState
}
