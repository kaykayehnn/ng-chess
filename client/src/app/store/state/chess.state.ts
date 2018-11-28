import { Piece } from '../../contracts/Piece';

export interface ChessState {
  readonly pieces: Piece[];
  readonly captured: Piece[];
}
