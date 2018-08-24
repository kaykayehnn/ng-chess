import { UserState } from "../state/user.state";
import { SIGN_IN, SIGN_OUT, SignIn, SignOut } from "../actions/user.actions";
import { Action } from "@ngrx/store";

function signIn (state: UserState, action: SignIn): UserState {
  return { ...action.payload }
}

function signOut (state: UserState, action: SignOut): UserState {
  return initialState
}

const initialState = null

export function userReducer (state = initialState, action: Action) {
  switch (action.type) {
    case SIGN_IN:
      return signIn(state, action as SignIn)
    case SIGN_OUT:
      return signOut(state, action as SignOut)
    default:
      return state
  }
}
