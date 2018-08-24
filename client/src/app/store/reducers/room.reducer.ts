import { RoomState } from "../state/room.state";
import { FetchedRooms, FETCHED_ROOMS } from "../actions/room.actions";

function fetchedRooms (state: RoomState, action: FetchedRooms) {
  let rooms = action.payload
  return [...rooms]
}

const initialState: RoomState = []

export function roomReducer (state: RoomState = initialState, action): RoomState {
  switch (action.type) {
    case FETCHED_ROOMS:
      return fetchedRooms(state, action)
    default:
      return state
  }
}
