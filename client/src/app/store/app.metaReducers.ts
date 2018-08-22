import { storeLogger } from 'ngrx-store-logger'
import { ActionReducer } from "@ngrx/store";

import { AppState } from "./app.state";
import { environment } from '../../environments/environment';

export function logger (reducer: ActionReducer<AppState>): any {
  return storeLogger()(reducer)
}

export const metaReducers = environment.production ? [] : [logger]
