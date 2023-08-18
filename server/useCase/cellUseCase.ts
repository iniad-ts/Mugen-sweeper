import type { UserId } from '$/commonTypesWithClient/branded';
import { cellsRepository } from '$/repository/cellsRepository';
import { sliceWithTime } from '$/service/sliceWithTime';

export const cellUseCase = {
  delete: async (userId: UserId) => {
    const res = await cellsRepository.findWithUser(userId);
    if (res === null) return;
    Promise.all(
      res.map((cell) => {
        cellsRepository.delete(cell.x, cell.y);
      })
    ).then((results) =>
      results.forEach((result) => {
        result;
      })
    );
  },
  fill: async () => {
    const res = await cellsRepository.findOlder();
    if (res === null) return;
    const moreOldCells = sliceWithTime(new Date().getTime() - 1000000, res);
    Promise.all(moreOldCells.map((cell) => cellsRepository.delete(cell.x, cell.y))).then(
      (results) =>
        results.forEach((result) => {
          result;
        })
    );
  },
};
