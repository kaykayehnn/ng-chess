import { ChessState } from "../state/chess.state"
import {
  MOVE_PIECE, INIT_BOARD, CAPTURE_PIECE, PROMOTE_PIECE, CASTLE_KING,
  InitBoard, MovePiece, CapturePiece, PromotePiece, CastleKing
} from "../actions/chess.actions"

function initBoard (state: ChessState, action: InitBoard) {
  return {
    pieces: action.payload,
    captured: []
  }
}

function movePiece (state: ChessState, action: MovePiece) {
  let move = action.payload

  return {
    ...state,
    pieces: state.pieces.map(p => {
      if (p.position === move.from && !p.captured) p = { ...p, position: move.to, zIndex: move.moveIx }

      return p
    })
  }
}

function capturePiece (state: ChessState, action: CapturePiece) {
  let capture = action.payload
  let capturedPiece = state.pieces.find(p => {
    return p.position === capture.position && p.color !== capture.color && !p.captured
  })

  return {
    ...state,
    pieces: state.pieces.map(p => {
      if (p === capturedPiece) p = { ...p, captured: true }

      return p
    }),
    captured: [...state.captured, capturedPiece]
  }
}

function promotePiece (state: ChessState, action: PromotePiece) {
  let promotion = action.payload

  return {
    ...state,
    pieces: state.pieces.map(p => {
      if (p.position === promotion.position) p = {
        ...p,
        type: promotion.piece
      }

      return p
    })
  }
}

function castleKing (state: ChessState, action: CastleKing) {
  let castling = action.payload
  let { side, color } = castling

  let row = color === 'w' ? 1 : 8
  let kingEndColumn = side === 'k' ? 'g' : 'c'
  let rookStartColumn = side === 'k' ? 'h' : 'a'
  let rookEndColumn = side === 'k' ? 'f' : 'd'

  let newPieces = state.pieces.map(p => {
    if (p.color === color) {
      if (p.type === 'k') p = {
        ...p,
        position: `${kingEndColumn}${row}`,
        zIndex: castling.zIndex // king goes over to mimic convention of moving king first
      }
      if (p.type === 'r' && p.position[0] === rookStartColumn) p = {
        ...p,
        position: `${rookEndColumn}${row}`
      }
    }

    return p
  })

  return {
    ...state,
    pieces: newPieces
  }
}

const initialState: ChessState = {
  pieces: [],
  captured: []
}

export function chessReducer (state: ChessState = initialState, action): ChessState {
  switch (action.type) {
    case INIT_BOARD:
      return initBoard(state, action)
    case MOVE_PIECE:
      return movePiece(state, action)
    case CAPTURE_PIECE:
      return capturePiece(state, action)
    case PROMOTE_PIECE:
      return promotePiece(state, action)
    case CASTLE_KING:
      return castleKing(state, action)
    default:
      return state;
  }
}