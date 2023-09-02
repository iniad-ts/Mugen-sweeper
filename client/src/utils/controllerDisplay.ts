import type { BoardModel } from '../types/types';

export const controllerDisplay = (
  board: BoardModel,
  x: number,
  y: number,
  VERTICAL_DISTANCE_FROM_CENTER: number,
  HORIZONTAL_DISTANCE_FROM_CENTER: number
) => {
  const displayLeft = x - VERTICAL_DISTANCE_FROM_CENTER + 1;

  const displayTop = y - HORIZONTAL_DISTANCE_FROM_CENTER + 1;

  const displayRight = x + VERTICAL_DISTANCE_FROM_CENTER;

  const displayBottom = y + HORIZONTAL_DISTANCE_FROM_CENTER;

  const correctionX = -Math.min(displayLeft, 0) - Math.max(displayRight - board[0].length, 0);

  const correctionY = -Math.min(displayTop, 0) - Math.max(displayBottom - board.length, 0);

  const slicedBoard = board
    .map((row) => row.slice(displayLeft + correctionX, displayRight + correctionX))
    .slice(displayTop + correctionY, displayBottom + correctionY);
  return slicedBoard;
};
