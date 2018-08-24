import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators/'

import { StorageService } from './storage.service'
import { User } from '../models/User'
import { AppState } from '../store/app.state';
import { SignIn, SignOut } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_REGEX = /\badmin\b/
  private user: User

  constructor (
    private http: HttpClient,
    private store: Store<AppState>,
    private storage: StorageService
  ) {
    this.store.select('user')
      .subscribe(state => {
        this.user = state
      })

    let user = this.storage.load()
    if (user) {
      this.store.dispatch(new SignIn(user))
    }
  }

  signupUser (email: string, password: string): Observable<User> {
    let url = '/api/users'
    let body = {
      email,
      password,
      repeatPassword: password // validation has already been done
    }

    return this.authenticate(url, body)
  }

  signinUser (email: string, password: string): Observable<User> {
    let url = '/api/users/_login'
    let body = {
      email,
      password
    }

    return this.authenticate(url, body)
  }

  getByEmail (email: string): Observable<User[]> {
    let url = `/api/users?email=${email}`

    return this.http.get<User[]>(url)
  }

  logout (): Observable<any> {
    let url = '/api/users/_logout'

    return this.http.post(url, null)
      .pipe(
        tap(() => {
          this.store.dispatch(new SignOut())
        })
      )
  }

  isAuthenticated () {
    return !!this.user
  }

  isAdmin () {
    return this.user && this.user.roles.match(this.ADMIN_REGEX)
  }

  getUser (): User {
    return this.user
  }

  getToken (): string {
    return this.storage.getToken()
  }

  private authenticate (url: string, body: object): Observable<User> {
    return this.http.post<User>(url, body)
      .pipe(
        tap(user => {
          this.store.dispatch(new SignIn(user))
        })
      )
  }
}
