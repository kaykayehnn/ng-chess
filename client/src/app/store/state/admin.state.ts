import { User } from "../../models/User";
import { Game } from "../../models/Game";

export interface AdminState {
  readonly users: User[],
  readonly games: Game[]
}