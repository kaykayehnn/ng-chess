import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { Subscription } from 'rxjs';
import { User } from '../../models/User';
import { FetchUsers, FetchGames } from '../../store/actions/admin.actions';
import { Game } from '../../models/Game';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor (
    private http: HttpClient,
    private store: Store<AppState>
  ) { }

  fetchUsers (): Subscription {
    const url = '/api/admin/users';

    return this.http.get<User[]>(url)
      .subscribe(users => {
        this.store.dispatch(new FetchUsers(users));
      });
  }

  fetchGames (): Subscription {
    const url = '/api/admin/games';

    return this.http.get<Game[]>(url)
      .subscribe(games => {
        this.store.dispatch(new FetchGames(games));
      });
  }

  editUser (userId: number, user: User) {
    const url = `/api/admin/users/${userId}`;

    return this.http.put(url, user)
      .subscribe(() => this.fetchGames());
  }

  deleteUser (userId: number) {
    const url = `/api/admin/users/${userId}`;

    return this.http.delete(url)
      .subscribe(() => {
        this.fetchUsers();
        this.fetchGames();
      });
  }

  deleteGame (gameId: number) {
    const url = `/api/admin/games/${gameId}`;

    return this.http.delete(url)
      .subscribe(() => this.fetchGames());
  }
}
