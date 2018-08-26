import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as Chess from 'chess.js'

import { AppState } from '../../store/app.state';
import { toPosition } from '../../utilities/chess';
import { Piece } from '../../contracts/Piece';
import { Tile } from '../../contracts/Tile';
import { InitBoard, MovePiece, PromotePiece, CapturePiece, CastleKing } from '../../store/actions/chess.actions';
import { ChessMove } from '../../contracts/ChessMove';
import { PieceColor } from '../../contracts/PieceColor';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit, OnChanges, OnDestroy {
  public readonly COLOR_MAP: { w: string, b: string } = {
    w: 'White',
    b: 'Black'
  }
  private readonly positionRgx = /([a-h][1-8])/

  public tiles: Tile[]
  public pieces: Piece[]
  public sideToMove: PieceColor
  public pickedPiece: Piece
  public message: string
  private chess
  private subscription: Subscription
  private moveIx: number

  @Input() fen: string
  @Input() sendMove: Function
  @Input() disableCaptions: boolean
  @Input() stateSelector: string
  @Input() color: PieceColor | '' // b[lack], w[hite] or ''(none)
  @Input() chessMoves: Observable<ChessMove>

  constructor (private store: Store<AppState>) { }

  ngOnInit () {
    this.store.select(...this.stateSelector.split('.'))
      .subscribe(state => {
        if (!this.pieces || this.pieces.length !== state.pieces.length) this.pieces = state.pieces
        else this.pieces = this.pieces.map((p, i) => Object.assign(p, state.pieces[i]))
      })

    this.subscription = this.chessMoves.subscribe((move) => {
      let moveObj = this.chess.move(move)
      this.chess.undo()

      this.makeMove(moveObj)
    })
    this.sendMove = this.sendMove || (() => 0)
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.fen && changes.fen.currentValue !== undefined) {
      this.startGame(changes.fen.currentValue)
    }
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
  }

  click (tileOrPiece): void {
    if (this.chess.in_checkmate()) return

    let isPiece = 'type' in tileOrPiece
    let possibleMoves = []

    if (isPiece && this.sideToMove === this.color) {
      if (tileOrPiece.color === this.color) {
        if (this.pickedPiece === tileOrPiece) this.pickedPiece = null
        else {
          this.pickedPiece = tileOrPiece as Piece
          possibleMoves = this.chess.moves({ square: (this.pickedPiece).position })
        }

        this.tiles = this.getTiles(possibleMoves)
      } else if (this.pickedPiece != null) {
        let otherPos = tileOrPiece.position
        let moveObj = { from: this.pickedPiece.position, to: otherPos }

        if (this.chess.move(moveObj)) {
          this.chess.undo()
          this.makeMove(moveObj)
          this.pickedPiece = null
          this.tiles = this.getTiles(possibleMoves)
        }
      }
    } else if (!isPiece && this.pickedPiece !== null && tileOrPiece.highlight) {
      let position = tileOrPiece.position
      let move = this.chess.moves({ square: this.pickedPiece.position, verbose: true })
        .find(m => m.to === position)

      this.makeMove(move)
      this.pickedPiece = null
      this.tiles = this.getTiles(possibleMoves)
    }
  }

  private startGame (fen?: string): void {
    this.chess = new Chess(fen || undefined)
    this.moveIx = 1
    this.tiles = this.getTiles()
    this.pieces = this.getPieces()
    this.sideToMove = this.chess.turn()
    this.message = `${this.COLOR_MAP[this.sideToMove]} to move`

    this.store.dispatch(new InitBoard(this.pieces))
  }

  private makeMove (move): void {
    move = this.chess.move(move)

    this.sendMove(move)
    this.store.dispatch(new MovePiece({ ...move, moveIx: this.moveIx++ }))

    let movingSide = this.COLOR_MAP[this.sideToMove]
    this.message = `${movingSide} moved from ${move.from} to ${move.to}`
    if (move.flags.indexOf('p') >= 0) { // promote
      this.message = `${movingSide} promotoed his pawn at ${move.to}`
      this.store.dispatch(new PromotePiece({ position: move.to, piece: move.promotion.toLowerCase() }))
    }
    if (move.flags.indexOf('c') >= 0) { // capture
      this.message = `${movingSide} captured at ${move.to}`
      this.store.dispatch(new CapturePiece({ position: move.to, color: move.color }))
    }
    else if (move.flags === 'k' || move.flags === 'q') { // castling
      this.message = `${movingSide} castled ${move.flags} side`
      this.store.dispatch(new CastleKing({ side: move.flags, color: move.color, zIndex: this.moveIx }))
    }

    if (this.chess.in_check()) this.message = `Checkmate for ${movingSide}`
    else if (this.chess.in_checkmate()) this.message = `Check for ${movingSide}`

    this.tiles = this.getTiles()
    this.sideToMove = this.chess.turn()
  }

  private getPieces (): Piece[] {
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

  private getTiles (positions: string[] = []): Tile[] {
    const MOVE_HIGHLIGHT = ['#5DADE2', '#2E86C1']
    const CHECKED_KING = '#EC7063'
    const checkedKing = this.chess.in_check() || this.chess.in_checkmate()

    positions = positions.map(p => this.positionRgx.exec(p)[1])
    let tiles: Tile[] = []

    this.repeatForBoard((row, col) => {
      let position = toPosition(row, col)
      let piece = this.chess.get(position)

      let highlight
      if (positions.indexOf(position) >= 0) highlight = MOVE_HIGHLIGHT[(row + col) % 2]
      else if (checkedKing && piece && piece.type === 'k' && piece.color === this.chess.turn()) highlight = CHECKED_KING

      tiles.push({
        position,
        color: (row + col) % 2 === 1,
        highlight
      })
    })
    console.log(this.chess.turn())
    return tiles
  }

  private repeatForBoard (cb: (row: number, col: number) => void): void {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        cb(row, col)
      }
    }
  }
}
