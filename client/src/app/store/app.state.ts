import { ChessState } from './state/chess.state';
import { UserState } from './state/user.state';
import { RoomState } from './state/room.state';
import { GameState } from './state/game.state';
import { DashboardState } from './state/dashboard.state';
import { AdminState } from './state/admin.state';

export interface AppState {
  readonly chessDemo: ChessState;
  readonly user: UserState;
  readonly rooms: RoomState;
  readonly game: GameState;
  readonly dashboard: DashboardState;
  readonly admin: AdminState;
}
