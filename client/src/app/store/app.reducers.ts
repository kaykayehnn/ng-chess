import { chessReducer } from "./reducers/chess.reducer";
import { userReducer } from "./reducers/user.reducer";
import { roomReducer } from "./reducers/room.reducer";
import { gameReducer } from "./reducers/game.reducer";
import { dashboardReducer } from "./reducers/dashboard.reducer";
import { adminReducer } from "./reducers/admin.reducer";

export const rootReducer = {
  chessDemo: chessReducer,
  user: userReducer,
  rooms: roomReducer,
  game: gameReducer,
  dashboard: dashboardReducer,
  admin: adminReducer
}
