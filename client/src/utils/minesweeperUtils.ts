import type { boardModel } from 'src/pages/game/index.page';

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
  aroundCellToArray: (board: boardModel, x: number, y: number) =>
    directions
      .map((direction) => ({ x: x + direction[0], y: y + direction[1] }))
      .filter((nextPos) => board[nextPos.y] !== undefined && board[nextPos.y][nextPos.x] === -1),
  countAroundBombsNum: (bombMap: boardModel, x: number, y: number) =>
    bombMap
      .slice(Math.max(0, y - 1), Math.min(y + 2, bombMap.length))
      .map((row) => row.slice(Math.max(0, x - 1), Math.min(x + 2, row.length)))
      .flat()
      .filter((b) => b === 1).length ?? 1 - 1,
  makeBoard: (x: number, y: number, board: boardModel, bombMap: boardModel): boardModel => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const openSurroundingCells = (x: number, y: number) => {
      newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);

      if (newBoard[y][x] === 0) {
        minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
          openSurroundingCells(nextPos.x, nextPos.y);
        });
      }
    };
    openSurroundingCells(x, y);
    return newBoard;
  },
};
