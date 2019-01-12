import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { WebsocketService } from '../../services/websocket.service';
import { AppState } from '../../store/app.state';
import { ChessMove } from '../../contracts/ChessMove';
import { FetchGame } from '../../store/actions/game.actions';
import { parseJwt } from '../../utilities/parseJwt';
import { Game } from '../../models/Game';

const GAMES = 'games';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public chessMoves$: Subject<string>;
  public getFen$: Subject<string>;

  private token: string;

  constructor (
    private store: Store<AppState>,
    private websocketService: WebsocketService) {
    this.chessMoves$ = new Subject<string>();
    this.getFen$ = new Subject<string>();

    this.websocketService.messages$.subscribe((message) => {
      if (message.resource === GAMES) {
        if (message.payload.event === 'start') {
          this.token = message.payload.token;
          this.store.dispatch(new FetchGame(parseJwt<Game>(message.payload.token)));
        } else if (message.payload.event === 'move') {
          this.chessMoves$.next(message.payload.move);
        } else if (message.payload.event === 'subscribe') {
          this.getFen$.next(message.payload.fen);
        }
      }
    });
  }

  startGame (gameId: number) {
    const message = {
      resource: GAMES,
      payload: {
        event: 'start',
        gameId
      }
    };

    this.websocketService.send(message);
  }

  makeMove (gameId: number, move: ChessMove) {
    const message = {
      resource: GAMES,
      payload: {
        event: 'move',
        gameId,
        token: this.token,
        move: move.san
      }
    };

    this.websocketService.send(message);
  }

  subscribe (gameId: number) {
    this.websocketService.subscribe(GAMES, { gameId });
  }

  unsubscribe (gameId: number) {
    this.websocketService.unsubscribe(GAMES, { gameId });
  }
}
