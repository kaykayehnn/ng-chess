import { Action } from '@ngrx/store';
import { User } from '../../models/User';

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export class SignIn implements Action {
  type: string = SIGN_IN
  constructor (public payload: User) { }
}

export class SignOut implements Action {
  type: string = SIGN_OUT
  constructor () { }
}
