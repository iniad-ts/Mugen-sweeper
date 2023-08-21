import type { OpenCellModel } from 'src/pages/controller/index.page';
import { userIdParser } from '../../../server/service/idParsers';

export const formatOpenCells = (openCells: OpenCellModel[], playerId: string) => {
  const jsonCells = openCells.map((cell) => JSON.stringify(cell));
  const jsonPostCells = Array.from(new Set(jsonCells));
  const postCells = jsonPostCells
    .map((cell) => JSON.parse(cell))
    .map((cell) => ({
      x: cell.x,
      y: cell.y,
      whoOpened: userIdParser.parse(playerId),
      whenOpened: new Date().getTime(),
      isUserInput: cell.isUserInput,
      cellValue: cell.value,
    }));
  return postCells;
};
