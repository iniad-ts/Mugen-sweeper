import type { UserId } from 'commonTypesWithClient/branded';
import type { OpenCellModel } from 'src/types/types';

export const formatOpenCells = (openCells: OpenCellModel[], playerId: UserId) => {
  const jsonCells = openCells.map((cell) => JSON.stringify(cell));
  const jsonPostCells = Array.from(new Set(jsonCells));
  const postCells = jsonPostCells
    .map((cell) => JSON.parse(cell))
    .map((cell) => ({
      x: cell.x,
      y: cell.y,
      whoOpened: playerId,
      whenOpened: Date.now(),
      isUserInput: cell.isUserInput,
      cellValue: cell.value,
    }));
  return postCells;
};
