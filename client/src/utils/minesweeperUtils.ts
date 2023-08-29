import type { BoardModel } from '../types/types';
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
      .filter((nextPos) => board[nextPos.y] !== undefined && board[nextPos.y][nextPos.x] === -1),

  countAroundBombsNum: (bombMap: BoardModel, x: number, y: number) =>
    bombMap
      .slice(Math.max(0, y - 1), Math.min(y + 2, bombMap.length))
      .map((row) => row.slice(Math.max(0, x - 1), Math.min(x + 2, row.length)))
      .flat()
      .filter((b) => b === 1).length ?? 1 - 1,

  makeBoard: (
    bombMap: BoardModel,
    userInputs: BoardModel,
    board: BoardModel | undefined
  ): BoardModel => {
    if (board === undefined) return bombMap.map((row) => row.map(() => -1));
    const openSurroundingCells = (x: number, y: number) => {
      newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);

      if (newBoard[y][x] === 0) {
        minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
          openSurroundingCells(nextPos.x, nextPos.y);
        });
      }
    };
    const newBoard =
      board === undefined ? bombMap.map((row) => row.map(() => -1)) : deepCopy<BoardModel>(board);
    userInputs.forEach((row, y) =>
      row.forEach((val, x) => val === 1 && openSurroundingCells(x, y))
    );

    return newBoard;
  },
};
