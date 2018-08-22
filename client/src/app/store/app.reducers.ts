import { chessReducer } from "./reducers/chess.reducer";
import { userReducer } from "./reducers/user.reducer";

export const rootReducer = {
  chess: chessReducer,
  user: userReducer
}
