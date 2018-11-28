import { Component, Input } from '@angular/core';

import { toCoordinates } from '../../../utilities/chess';
import { Piece } from '../../../contracts/Piece';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent {
  public pieceTypeMap: { [key: string]: string } = {
    p: 'pawn',
    b: 'bishop',
    n: 'knight',
    r: 'rook',
    q: 'queen',
    k: 'king'
  };
  public pieceColorMap: { [key: string]: string } = {
    w: 'white',
    b: 'black'
  };

  @Input() type: string;
  @Input() color: string;
  @Input() position: string;
  @Input() captured: boolean;
  @Input() zIndex: number;
  @Input() isPicked: boolean;

  toCoordinates (position) {
    return toCoordinates(position);
  }
}
