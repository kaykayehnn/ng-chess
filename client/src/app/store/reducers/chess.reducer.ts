import { ChessState } from '../state/chess.state';
import {
  MOVE_PIECE, INIT_BOARD, CAPTURE_PIECE, PROMOTE_PIECE, CASTLE_KING,
  InitBoard, MovePiece, CapturePiece, PromotePiece, CastleKing
} from '../actions/chess.actions';

function initBoard (state: ChessState, action: InitBoard) {
  return {
    pieces: action.payload,
    captured: []
  };
}

function movePiece (state: ChessState, action: MovePiece) {
  const move = action.payload;

  return {
    ...state,
    pieces: state.pieces.map(p => {
      if (p.position === move.from && !p.captured) { p = { ...p, position: move.to, zIndex: move.moveIx }; }

      return p;
    })
  };
}

function capturePiece (state: ChessState, action: CapturePiece) {
  const capture = action.payload;
  const capturedPiece = state.pieces.find(p => {
    return p.position === capture.position && p.color !== capture.color && !p.captured;
  });

  return {
    ...state,
    pieces: state.pieces.map(p => {
      if (p === capturedPiece) { p = { ...p, captured: true }; }

      return p;
    }),
    captured: [...state.captured, capturedPiece]
  };
}

function promotePiece (state: ChessState, action: PromotePiece) {
  const promotion = action.payload;

  return {
    ...state,
    pieces: state.pieces.map(p => {
      if (p.position === promotion.position) { p = {
        ...p,
        type: promotion.piece
      };
      }

      return p;
    })
  };
}

function castleKing (state: ChessState, action: CastleKing) {
  const castling = action.payload;
  const { side, color } = castling;

  const row = color === 'w' ? 1 : 8;
  const kingEndColumn = side === 'k' ? 'g' : 'c';
  const rookStartColumn = side === 'k' ? 'h' : 'a';
  const rookEndColumn = side === 'k' ? 'f' : 'd';

  const newPieces = state.pieces.map(p => {
    if (p.color === color) {
      if (p.type === 'k') { p = {
        ...p,
        position: `${kingEndColumn}${row}`,
        zIndex: castling.zIndex // king goes over to mimic convention of moving king first
      };
      }
      if (p.type === 'r' && p.position[0] === rookStartColumn) { p = {
        ...p,
        position: `${rookEndColumn}${row}`
      };
      }
    }

    return p;
  });

  return {
    ...state,
    pieces: newPieces
  };
}

export const initialState: ChessState = {
  pieces: [],
  captured: []
};

export function chessReducer (state: ChessState = initialState, action): ChessState {
  switch (action.type) {
    case INIT_BOARD:
      return initBoard(state, action);
    case MOVE_PIECE:
      return movePiece(state, action);
    case CAPTURE_PIECE:
      return capturePiece(state, action);
    case PROMOTE_PIECE:
      return promotePiece(state, action);
    case CASTLE_KING:
      return castleKing(state, action);
    default:
      return state;
  }
}
