import type { BoardModel } from '../types/types';

export const controllerDisplay = (
  board: BoardModel,
  verticalDistance: number,
  horizontalDistance: number,
  x: number,
  y: number
) => {
  const correctionX = x - horizontalDistance < 0 ? -(x - horizontalDistance) : 0;
  const correctionY = y - horizontalDistance < 0 ? -(y - horizontalDistance) : 0;
  const correctionOverX = board[0].length - x - horizontalDistance < 0 ? x - horizontalDistance : 0;
  const correctionOverY = board.length - y - horizontalDistance < 0 ? y - horizontalDistance : 0;

  const slicedBoard = board
    .map((row) =>
      row.slice(
        x - horizontalDistance + correctionX + correctionOverX,
        x + horizontalDistance + 1 + correctionX + correctionOverX
      )
    )
    .slice(
      y - verticalDistance + correctionY + correctionOverY,
      y + verticalDistance + 1 + correctionY + correctionOverY
    );
  return slicedBoard;
};
