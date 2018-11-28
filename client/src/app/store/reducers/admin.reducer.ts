import { AdminState } from '../state/admin.state';
import { FETCH_USERS, FETCH_GAMES, FetchUsers, FetchGames } from '../actions/admin.actions';

function fetchUsers (state: AdminState, action: FetchUsers): AdminState {
  return { ...state, users: action.payload };
}

function fetchGames (state: AdminState, action: FetchGames): AdminState {
  return { ...state, games: action.payload };
}

const initialState: AdminState = {
  users: [],
  games: []
};

export function adminReducer (state: AdminState = initialState, action): AdminState {
  switch (action.type) {
    case FETCH_USERS:
      return fetchUsers(state, action);
    case FETCH_GAMES:
      return fetchGames(state, action);
  }
}
