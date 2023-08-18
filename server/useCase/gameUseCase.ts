import type { GameModel } from '$/commonTypesWithClient/models';
import { cellsRepository } from '$/repository/cellsRepository';
import { gameRepository } from '$/repository/gameRepository';
import { gameIdParser } from '$/service/idParsers';
import { make2DArray } from '$/service/make2DArray';
import { randomUUID } from 'crypto';

export const gameUseCase = {
  create: async (width: number, height: number, bombRatioPercent: number) => {
    const newUserInputs: (0 | 1 | 2)[][] = make2DArray(width, height);
    const newBombMap: (0 | 1)[][] = make2DArray(width, height);
    [...Array(Math.floor((width * height * bombRatioPercent) / 100))].forEach(() => {
      const setBomb = () => {
        const j = Math.floor(Math.random() * height);
        const i = Math.floor(Math.random() * width);
        if (newBombMap[j][i] === 0) {
          newBombMap[j][i] = 1;
        } else {
          setBomb();
        }
      };
      setBomb();
    });
    const newGame: GameModel = {
      id: gameIdParser.parse(randomUUID()),
      bombMap: newBombMap,
      userInputs: newUserInputs,
    };
    const res = await gameRepository.save(newGame);
    return res;
  },
  save: async () => {
    const res = await cellsRepository.findAllUserInputted();
    const game = await gameRepository.find();
    if (game === null || res === null) return;
    res.forEach((cell) => (game.userInputs[cell.y][cell.x] = 1));
    return await gameRepository.save({ ...game, userInputs: game.userInputs });
  },
  getBoard: async () => {
    const res = await gameRepository.find();
    return res !== null ? res : null;
  },
};
