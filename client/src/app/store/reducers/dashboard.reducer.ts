import { DashboardState } from "../state/dashboard.state";
import { FetchStats, FetchMatches, FETCH_STATS, FETCH_MATCHES } from "../actions/dashboard.actions";

function fetchStats (state: DashboardState, action: FetchStats): DashboardState {
  return { ...state, stats: action.payload }
}

function fetchLastMatches (state: DashboardState, action: FetchMatches): DashboardState {
  return { ...state, lastMatches: action.payload }
}

const initialState: DashboardState = {
  stats: null,
  lastMatches: []
}

export function dashboardReducer (state: DashboardState = initialState, action): DashboardState {
  switch (action.type) {
    case FETCH_STATS:
      return fetchStats(state, action)
    case FETCH_MATCHES:
      return fetchLastMatches(state, action)
    default:
      return state
  }
}
