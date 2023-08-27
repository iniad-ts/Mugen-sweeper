import type { BoardModel, Pos } from 'src/types/types';
import { CELL_FLAGS } from './boardFlag';

const VERTICAL_DISTANCE_FROM_CENTER = 4;

const HORIZONTAL_DISTANCE_FROM_CENTER = 4;

export const toControllerBoard = (board: BoardModel, displayPos: Pos, selectPos: Pos) => {
  const displayLeft = selectPos.x - VERTICAL_DISTANCE_FROM_CENTER;
  const displayTop = selectPos.y - HORIZONTAL_DISTANCE_FROM_CENTER;
  const displayRight = selectPos.x + VERTICAL_DISTANCE_FROM_CENTER;
  const displayBottom = selectPos.y + HORIZONTAL_DISTANCE_FROM_CENTER;
  const correctionX = -Math.min(displayLeft, 0) - Math.max(displayRight - board[0].length, 0);
  const correctionY = -Math.min(displayTop, 0) - Math.max(displayBottom - board.length, 0);
  const posBoard = board.map((row, y) =>
    row.map((val, x) => ({
      val:
        val |
        ([displayPos.x === x, displayPos.y === y].every(Boolean)
          ? CELL_FLAGS['user']
          : [selectPos.x === x, selectPos.y === y].every(Boolean)
          ? CELL_FLAGS['select']
          : 0),
      x,
      y,
    }))
  );
  return posBoard;
  // posBoard
  //   .map((row) => row.slice(displayLeft + correctionX, displayRight + correctionX))
  //   .slice(displayTop + correctionY, displayBottom + correctionY);
};
