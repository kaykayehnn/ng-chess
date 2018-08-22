import { Action } from '@ngrx/store';

import { Piece } from '../../contracts/Piece';
import { PieceMovement } from '../contracts/PieceMovement';
import { PieceCapture } from '../contracts/PieceCapture';
import { PiecePromotion } from '../contracts/PiecePromotion';
import { Castling } from '../contracts/Castling';

export const INIT_BOARD = 'INIT_BOARD'
export const MOVE_PIECE = 'MOVE_PIECE'
export const CAPTURE_PIECE = 'CAPTURE_PIECE'
export const PROMOTE_PIECE = 'PROMOTE_PIECE'
export const CASTLE_KING = 'CASTLE_KING'

export class InitBoard implements Action {
  type: string = INIT_BOARD
  constructor (public payload: Piece[]) { }
}

export class MovePiece implements Action {
  type: string = MOVE_PIECE
  constructor (public payload: PieceMovement) { }
}

export class CapturePiece implements Action {
  type: string = CAPTURE_PIECE
  constructor (public payload: PieceCapture) { }
}

export class PromotePiece implements Action {
  type: string = PROMOTE_PIECE
  constructor (public payload: PiecePromotion) { }
}

export class CastleKing implements Action {
  type: string = CASTLE_KING
  constructor (public payload: Castling) { }
}
