import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Game } from '../../models/Game';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {
  constructor (
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }


  canActivate (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const gameId = next.paramMap.get('gameId');

    return this.check(+gameId);
  }

  /**
   * If user is not logged in redirects to public spectate url
   * If user participates in game he is let in
   * If user is logged in and game is still going redirects to private spectate url
   * If user is logged in and game has finished redirects to dashboard
   */
  check (gameId: number): Observable<boolean> {
    const url = `/api/games/${gameId}`;
    return this.http.get(url)
      .pipe(catchError(err => of({})))
      .map((game: Game) => {
        const user = this.authService.getUser();
        let redirectUrl;
        if (!user) {
          redirectUrl = `/spectate/${gameId}`;
        } else if (user.id !== game.whitePlayerId && user.id !== game.blackPlayerId) {
          if (game.winner === null) {
            redirectUrl = `/dashboard/spectate/${gameId}`;
          } else {
            redirectUrl = '/dashboard';
          }
        }

        if (redirectUrl !== undefined) {
          this.router.navigateByUrl(redirectUrl);
          return false;
        }

        return true;
      });
  }
}
