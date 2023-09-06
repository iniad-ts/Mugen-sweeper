import type { UserId } from '$/commonTypesWithClient/branded';
import { cellsRepository } from '$/repository/cellsRepository';
import { deepCopy } from '$/service/deepCopy';

let intervalId: NodeJS.Timeout | null = null;

export const cellUseCase = {
  delete: async (userId: UserId) => {
    await cellsRepository.deleteWithPlayer(userId);
  },

  restore: async () => {
    const res = await cellsRepository.findAllOrderByWhenOpenedDesc();
    if (res === null) return;
    const sliceIndex = res.findIndex((cell) => cell.whenOpened < Date.now() - 3000000);
    const moreOldCells = res.slice(0, sliceIndex);
    moreOldCells.forEach((cell) => cellsRepository.delete(cell.x, cell.y, cell.whoOpened));
  },

  init: () => {
    intervalId = setInterval(() => {
      cellUseCase.restore();
      console.log('restore');
    }, 2000);
  },

  stop: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },

  updateUserInputs: async (userInputs: (0 | 1)[][]) => {
    const res = await cellsRepository.findAllUserInputted();
    const newUserInputs = deepCopy<(0 | 1)[][]>(userInputs);
    res?.forEach((cell) => {
      newUserInputs[cell.y][cell.x] = 1;
    });
    return newUserInputs;
  },

  get: async () => {
    const res = await cellsRepository.findAll();
    return res;
  },
};
