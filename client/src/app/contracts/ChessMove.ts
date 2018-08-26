import { PieceType } from "./PieceType";
import { PieceColor } from "./PieceColor";

export interface ChessMove {
  from: string,
  to: string,
  type: PieceType,
  color: PieceColor,
  flags: string,
  san: string,
  captured?: string,
  promotion?: string
}