import { Action } from "@ngrx/store";
import { Room } from "../../models/Room";

export const FETCHED_ROOMS = 'FETCHED_ROOMS'

export class FetchedRooms implements Action {
  type: string = FETCHED_ROOMS
  constructor (public payload: Room[]) { }
}
