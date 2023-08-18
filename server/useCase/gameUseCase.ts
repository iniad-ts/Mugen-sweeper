import type { GameModel } from '$/commonTypesWithClient/models';
import { gameRepository } from '$/repository/gameRepository';
import { gameIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const gameUseCase = {
  create: async (width: number, height: number, bombRatiio: number) => {
    const newGameDisplay: 0[][] = [...Array(height)].map(() => [...Array(width)].map(() => 0));
    const newGame: GameModel = {
      id: gameIdParser.parse(randomUUID()),
      bombMap: newGameDisplay,
      userInputs: newGameDisplay,
    };
    const res = await gameRepository.save(newGame);
    return res;
  },
  
};
