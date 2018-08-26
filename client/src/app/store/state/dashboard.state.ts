import { UserStats } from "../../contracts/UserStats";
import { Game } from "../../models/Game";

export interface DashboardState {
  readonly stats: UserStats
  readonly lastMatches: Game[]
}