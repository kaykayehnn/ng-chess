import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Chess from 'chess.js';

import { AppState } from '../store/app.state';
import { toPosition } from '../utilities/chess';
import { Piece } from '../contracts/Piece';
import { Tile } from '../contracts/Tile';
import { InitBoard, MovePiece, PromotePiece, CapturePiece, CastleKing } from '../store/actions/chess.actions';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit, OnDestroy {
  public tiles: Tile[]
  public pieces: Piece[]
  private chess: any
  private randomMoves$: Subscription
  private moveIx: number

  @Input() isLanding: boolean
  constructor (private store: Store<AppState>) { }

  ngOnInit () {
    this.startGame()

    this.store.select(state => state.chess)
      .subscribe(state => {
        if (this.pieces.length !== state.pieces.length) this.pieces = state.pieces
        else this.pieces = this.pieces.map((p, i) => Object.assign(p, state.pieces[i]))
      })

    if (this.isLanding) {
      this.randomMoves$ = interval(1500)
        .subscribe(() => this.makeRandomMove())
    }
  }

  ngOnDestroy () {
    this.randomMoves$.unsubscribe()
  }

  startGame (fen?: string): void {
    this.chess = Chess(fen)
    this.moveIx = 1
    this.tiles = this.getTiles()
    this.pieces = this.getPieces()

    this.store.dispatch(new InitBoard(this.pieces))
  }

  makeRandomMove (): void {
    let moves = this.chess.moves({ verbose: true })
    if (this.chess.in_checkmate() || this.chess.in_draw() || this.chess.in_stalemate()) {
      this.startGame()
      return console.warn('ENDGAME')
    }
    // ENHANCEMENT: select one which captures
    let randomMove = moves[Math.floor(Math.random() * moves.length)]

    this.makeMove(randomMove)
  }

  // from, to
  makeMove (obj): void {
    let move = this.chess.move(obj)
    this.store.dispatch(new MovePiece({ ...move, moveIx: this.moveIx++ }))

    if (move.flags.indexOf('p') >= 0) { // promote
      this.store.dispatch(new PromotePiece({ position: move.to, piece: move.promotion.toLowerCase() }))
    }
    if (move.flags.indexOf('c') >= 0) { // capture
      this.store.dispatch(new CapturePiece({ position: move.to, color: move.color }))
    }
    else if (move.flags === 'k' || move.flags === 'q') { // castling
      this.store.dispatch(new CastleKing({ side: move.flags, color: move.color, zIndex: this.moveIx }))
    }
  }

  getPieces (): Piece[] {
    let pieces: Piece[] = []
    this.repeatForBoard((row, col) => {
      let position = toPosition(row, col)
      let piece = this.chess.get(position)
      if (piece) {
        pieces.push({
          type: piece.type,
          color: piece.color,
          position: position,
          captured: false
        })
      }
    })

    return pieces
  }

  getTiles (): Tile[] {
    let tiles: Tile[] = []
    this.repeatForBoard((row, col) => {
      tiles.push({
        position: row + col + '',
        color: (row + col) % 2 === 1
      })
    })

    return tiles
  }

  repeatForBoard (cb: (row: number, col: number) => void): void {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        cb(row, col)
      }
    }
  }

  click (event): void {
    console.log(event.x, event.y)
  }
}
