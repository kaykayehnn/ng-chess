
/**
 * Returns a chess position from chessboard row/col
 * @example 
 * toPosition(0,0) => 'a1'
 * @example
 * toPosition(0,7) => 'a8'
 * @example
 * toPosition(7,0) => 'h1'
 * @param row 0 based row/rank
 * @param col 0 based column/file
 */
export function toPosition (row: number, col: number): string {
  let file = String.fromCharCode('a'.charCodeAt(0) + col)
  let position = `${file}${8 - (row)}`

  return position
}

/**
 * Returns an object with properties row, col represening 0 based coordinates
 * @example
 * toCoordinates('a1') => { r:0, c:0 }
 * @example
 * toCoordinates('a8') => { r:0, c:7 }
 * @example
 * toCoordinates('h1') => { r:7, c:1 }
 * @param position Chess position of a square
 */
export function toCoordinates (position: string): { row: number, column: number } {
  let row = 8 - +position.charAt(1)
  let column = position.charCodeAt(0) - 'a'.charCodeAt(0)

  return { row, column }
}
