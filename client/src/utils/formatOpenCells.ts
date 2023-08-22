import type { UserId } from 'commonTypesWithClient/branded';
import type { OpenCellModel } from 'src/types/types';

export const formatOpenCells = (openCells: OpenCellModel[], playerId: UserId) => {
  const jsonCells = openCells.map((cell) =>
    JSON.stringify([cell.x, cell.y, cell.isUserInput, cell.value])
  );
  const jsonPostCells = Array.from(new Set(jsonCells));
  const postCells = jsonPostCells
    .map((cell) => JSON.parse(cell))
    .map((cell: [number, number, boolean, number]) => ({
      x: cell[0],
      y: cell[1],
      whoOpened: playerId,
      whenOpened: Date.now(),
      isUserInput: cell[2],
      cellValue: cell[3],
    }));
  return postCells;
};
