import type { UserId } from 'commonTypesWithClient/branded';
import type { OpenCellModel } from 'src/types/types';

export const formatOpenCells = (openCells: Set<string>, playerId: UserId) => {
  const jsonPostCells = Array.from(openCells);
  const postCells = jsonPostCells
    .map((cell): OpenCellModel => JSON.parse(cell))
    .map((cell: OpenCellModel) => ({
      x: cell[0],
      y: cell[1],
      whoOpened: playerId,
      whenOpened: Date.now(),
      isUserInput: cell[2],
      cellValue: cell[3],
    }));
  return postCells;
};
