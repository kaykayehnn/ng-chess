import { PieceColor } from './PieceColor';
import { PieceType } from './PieceType';

export interface Piece {
  color: PieceColor;
  type: PieceType;
  position: string;
  captured?: boolean;
  row?: number;
  column?: number;
  zIndex?: number;
}
