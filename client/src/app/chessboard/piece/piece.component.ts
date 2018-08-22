import { Component, Input } from '@angular/core';
import { toCoordinates } from '../../utilities/chess';

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

  @Input() public type: string;
  @Input() public color: string;
  @Input() public position: string;
  @Input() public captured: boolean;
  @Input() public zIndex: number;

  toCoordinates (position) {
    return toCoordinates(position)
  }
}
