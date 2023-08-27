import type { BoardModel } from '../types/types';
import { CELL_FLAGS, IS_BLANK_CELL } from './boardFlag';
import { deepCopy } from './deepCopy';

const directions = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

export const minesweeperUtils = {
  aroundCellToArray: (board: BoardModel, x: number, y: number) =>
    directions
      .map((direction) => ({ x: x + direction[0], y: y + direction[1] }))
      .filter((nextPos) => {
        // console.log(nextPos.x, nextPos.y);
        return board[nextPos.y] !== undefined && board[nextPos.y][nextPos.x] & CELL_FLAGS['block'];
      }),

  countAroundBombsNum: (bombMap: BoardModel, x: number, y: number) =>
    bombMap
      .slice(Math.max(0, y - 1), Math.min(y + 2, bombMap.length))
      .map((row) => row.slice(Math.max(0, x - 1), Math.min(x + 2, row.length)))
      .flat()
      .filter((b) => b === 1).length ?? 0,

  makeBoard: (
    bombMap: BoardModel,
    userInputs: BoardModel,
    board: BoardModel | undefined | null
  ): BoardModel => {
    if (board === undefined || board === null)
      return bombMap.map((row) => row.map(() => CELL_FLAGS['block']));
    const openSurroundingCells = (x: number, y: number) => {
      newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);

      if (IS_BLANK_CELL(newBoard[y][x])) {
        newBoard[y][x] &= ~CELL_FLAGS['block'];
        minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
          openSurroundingCells(nextPos.x, nextPos.y);
        });
      }
    };
    const newBoard =
      board === undefined
        ? bombMap.map((row) => row.map(() => CELL_FLAGS['block']))
        : deepCopy<BoardModel>(board);
    userInputs.forEach((row, y) =>
      row.forEach((val, x) => val === 1 && openSurroundingCells(x, y))
    );

    return newBoard;
  },
};
