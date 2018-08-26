import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/Game';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../game/game.service';

@Component({
  templateUrl: './spectate.component.html',
  styleUrls: ['./spectate.component.css'],
  host: { '[style.flex]': '1' }
})
export class SpectateComponent implements OnInit {
  public gameData: Game
  public makeMoveBound: Function
  public fen: string

  constructor (
    private store: Store<AppState>,
    private route: ActivatedRoute,
    public gameService: GameService) { }

  ngOnInit () {
    let gameId = +this.route.snapshot.paramMap.get('gameId')
    this.gameService.subscribe(gameId)

    this.store.select(state => state.game.data)
      .subscribe(state => {
        this.gameData = state || {} as Game

        if (!this.makeMoveBound && this.gameData) {
          this.makeMoveBound = this.gameService.makeMove.bind(this.gameService, gameId)
        }
      })

    this.gameService.getFen$.subscribe(fen => {
      this.fen = fen
    })
  }
}
