import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { UserStats } from '../../contracts/UserStats';
import { Game } from '../../models/Game';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { FetchStats, FetchMatches } from '../../store/actions/dashboard.actions';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor (
    private http: HttpClient,
    private store: Store<AppState>,
    private authService: AuthService) { }

  fetchStats (): Subscription {
    const { id } = this.authService.getUser();
    const url = `/api/users/${id}/stats`;

    return this.http.get<UserStats>(url)
      .subscribe(stats => {
        this.store.dispatch(new FetchStats(stats));
      });
  }

  fetchLastMatches (n: number): Subscription {
    const { id } = this.authService.getUser();
    const url = `/api/users/${id}/matches?n=${n}`;

    return this.http.get<Game[]>(url)
      .subscribe(matches => {
        this.store.dispatch(new FetchMatches(matches));
      });
  }
}
