import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as Chess from 'chess.js';

import { InitBoard, MovePiece, PromotePiece, CapturePiece, CastleKing } from '../../store/actions/chess.actions';
import { toPosition, toCoordinates } from '../../utilities/chess';
import { AppState } from '../../store/app.state';
import { Piece } from '../../contracts/Piece';
import { Tile } from '../../contracts/Tile';
import { ChessMove } from '../../contracts/ChessMove';
import { PieceColor } from '../../contracts/PieceColor';
import { PieceType } from 'src/app/contracts/PieceType';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit, OnChanges, OnDestroy {
  public readonly COLOR_MAP = {
    w: 'White',
    b: 'Black'
  };
  private readonly specialMoveRgx = /[qkcpe]/;

  public tiles: Tile[];
  public pieces: Piece[];
  public sideToMove: PieceColor;
  public pickedPiece: Piece;
  public message: string;
  private chess;
  private subscription: Subscription;
  private moveIx: number;

  @Input() fen: string;
  @Input() sendMove: Function;
  @Input() disableCaptions: boolean;
  @Input() stateSelector: string;
  @Input() color: PieceColor | ''; // b[lack], w[hite] or ''(none)
  @Input() chessMoves: Observable<ChessMove>;

  constructor (private store: Store<AppState>) { }

  ngOnInit () {
    this.store.select(...this.stateSelector.split('.'))
      .subscribe(state => {
        if (!this.pieces || this.pieces.length !== state.pieces.length) {
          this.pieces = state.pieces;
        } else {
          this.pieces = this.pieces.map((p, i) => Object.assign(p, state.pieces[i]));
        }
      });

    this.subscription = this.chessMoves.subscribe((move) => {
      const moveObj = this.chess.move(move);
      this.chess.undo();

      this.makeMove(moveObj, false);
    });
    this.sendMove = this.sendMove || (() => null);
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.fen && changes.fen.currentValue !== undefined) {
      this.startGame(changes.fen.currentValue);
    }
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  click (tileOrPiece): void {
    if (this.chess.in_checkmate()) { return; }

    const isPiece = 'type' in tileOrPiece;
    let possibleMoves = [];

    if (isPiece && this.sideToMove === this.color) {
      if (tileOrPiece.color === this.color) {
        if (this.pickedPiece === tileOrPiece) { // click same piece, unchooses it
          this.pickedPiece = null;
        } else { // chooses another piece
          this.pickedPiece = tileOrPiece as Piece;
          possibleMoves = this.chess.moves({ square: (this.pickedPiece).position, verbose: true });
        }

        this.tiles = this.getTiles(possibleMoves);
      } else if (this.pickedPiece != null) { // capturing
        const otherPos = tileOrPiece.position;
        const moveObj: any = { from: this.pickedPiece.position, to: otherPos };
        if (this.pickedPiece.type === PieceType.Pawn) {
          moveObj.promotion = 'q';
        }

        if (this.chess.move(moveObj)) { // checks if move is valid
          this.chess.undo();

          this.makeMove(moveObj, true);
          this.pickedPiece = null;
          this.tiles = this.getTiles(possibleMoves);
        }
      }
    } else if (!isPiece && this.pickedPiece !== null && tileOrPiece.highlight) {
      const position = tileOrPiece.position;
      const move = this.chess.moves({ square: this.pickedPiece.position, verbose: true })
        .find(m => m.to === position);

      this.makeMove(move, true);
      this.pickedPiece = null;
      this.tiles = this.getTiles(possibleMoves);
    }
  }

  private startGame (fen?: string): void {
    this.chess = new Chess(fen || undefined);
    this.moveIx = 1;
    this.tiles = this.getTiles();
    this.pieces = this.getPieces();
    this.sideToMove = this.chess.turn();
    this.message = `${this.COLOR_MAP[this.sideToMove]} to move`;

    this.store.dispatch(new InitBoard(this.pieces));
  }

  private makeMove (move, ownMove: boolean): void {
    move = this.chess.move(move);

    if (ownMove) {
      this.sendMove(move);
    }

    this.store.dispatch(new MovePiece({ ...move, moveIx: this.moveIx++ }));

    const movingSide = this.COLOR_MAP[this.sideToMove];
    this.message = `${movingSide} moved from ${move.from} to ${move.to}`;
    if (move.flags.indexOf('p') >= 0) { // promote
      this.message = `${movingSide} promotoed their pawn at ${move.to}`;
      this.store.dispatch(new PromotePiece({ position: move.to, piece: move.promotion.toLowerCase() }));
    }
    if (move.flags.indexOf('c') >= 0) { // capture
      this.message = `${movingSide} captured at ${move.to}`;
      this.store.dispatch(new CapturePiece({ position: move.to, color: move.color }));
    } else if (move.flags.indexOf('e') >= 0) { // en passant capture
      let { row, column } = toCoordinates(move.to);
      if (move.color === 'w') {
        row++;
      } else {
        row--;
      }

      const capturedPosition = toPosition(row, column);
      this.message = `${movingSide} captured en passant at ${move.to}`;
      this.store.dispatch(new CapturePiece({ position: capturedPosition, color: move.color })); // FIXME:
    } else if (move.flags === 'k' || move.flags === 'q') { // castling
      this.message = `${movingSide} castled ${move.flags} side`;
      this.store.dispatch(new CastleKing({ side: move.flags, color: move.color, zIndex: this.moveIx }));
    }

    if (this.chess.in_checkmate()) {
      this.message = `Checkmate for ${movingSide}`;
    } else if (this.chess.in_check()) {
      this.message = `Check for ${movingSide}`;
    }

    this.tiles = this.getTiles();
    this.sideToMove = this.chess.turn();
  }

  private getPieces (): Piece[] {
    const pieces: Piece[] = [];
    this.repeatForBoard((row, col) => {
      const position = toPosition(row, col);
      const piece = this.chess.get(position);
      if (piece) {
        pieces.push({
          type: piece.type,
          color: piece.color,
          position: position,
          captured: false
        });
      }
    });

    return pieces;
  }

  private getTiles (positions: ChessMove[] = []): Tile[] {
    const MOVE_HIGHLIGHT = ['#5DADE2', '#2E86C1'];
    const SPECIAL_MOVE = '#A569BD';
    const CHECKED_KING = '#EC7063';
    const checkedKing = this.chess.in_check() || this.chess.in_checkmate();
    console.log(positions);
    const tiles: Tile[] = [];

    this.repeatForBoard((row, col) => {
      const position = toPosition(row, col);
      const piece = this.chess.get(position);
      const move = positions.find(p => p.to === position);

      let highlight: string;
      if (move != null) {
        if (move.flags.match(this.specialMoveRgx) !== null) { // castling, capturing, promotion and en passant
          highlight = SPECIAL_MOVE;
        } else {
          highlight = MOVE_HIGHLIGHT[(row + col) % 2];
        }
      } else if (checkedKing && piece && piece.type === 'k' && piece.color === this.chess.turn()) {
        highlight = CHECKED_KING;
      }

      tiles.push({
        position,
        color: (row + col) % 2 === 1,
        highlight
      });
    });

    return tiles;
  }

  private repeatForBoard (cb: (row: number, col: number) => void): void {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        cb(row, col);
      }
    }
  }
}
