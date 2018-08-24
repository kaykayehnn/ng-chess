import { chessReducer } from "./reducers/chess.reducer";
import { userReducer } from "./reducers/user.reducer";
import { roomReducer } from "./reducers/room.reducer";

export const rootReducer = {
  chess: chessReducer,
  user: userReducer,
  rooms: roomReducer
}
