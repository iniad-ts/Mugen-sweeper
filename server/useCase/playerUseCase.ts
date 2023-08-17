import type { PlayerModel } from '$/commonTypesWithClient/models';
import { GAME_SIZE } from '$/constants/gameSize';
import { userIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const playerUseCase = {
  create: async (userName: string): Promise<PlayerModel | null> => {
    const newPlayerModel = {
      id: userIdParser.parse(randomUUID()),
      x: Math.floor(Math.random() * GAME_SIZE.WIDTH),
      y: Math.floor(Math.random() * GAME_SIZE.HEIGHT),
      name: userName,
      score: 0,
      isLive: true,
    };
    // const res = await playerRepository.create();
    // if (res === null) {
    return null;
    // }
    // return res
  },
};
