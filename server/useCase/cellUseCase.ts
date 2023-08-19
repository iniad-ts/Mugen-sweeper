import type { UserId } from '$/commonTypesWithClient/branded';
import { cellsRepository } from '$/repository/cellsRepository';
import { sliceWithTime } from '$/service/sliceWithTime';

export const cellUseCase = {
  delete: async (userId: UserId) => {
    const res = await cellsRepository.findAllOfPlayer(userId);
    if (res === null) return;
    res.forEach((cell) => {
      cellsRepository.delete(cell.x, cell.y);
    });
  },
  fill: async () => {
    const res = await cellsRepository.findOlder();
    if (res === null) return;
    const moreOldCells = sliceWithTime(new Date().getTime() - 1000000, res);
    moreOldCells.forEach((cell) => cellsRepository.delete(cell.x, cell.y));
  },
};
