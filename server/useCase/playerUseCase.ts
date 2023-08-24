import type { Maybe, UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { gameRepository } from '$/repository/gameRepository';
import { playersRepository } from '$/repository/playersRepository';
import { userIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const playerUseCase = {
  create: async (userName: string): Promise<PlayerModel | null> => {
    const game = await gameRepository.find();

    if (game === null) return null;
    const gameSize = { width: game.bombMap[0].length, height: game.bombMap.length };

    const choicePos = () => {
      const x = Math.floor(Math.random() * gameSize.width);
      const y = Math.floor(Math.random() * gameSize.height);
      if (game.bombMap[y][x] === 1) {
        choicePos();
      }
      return [x, y];
    };
    const [x, y] = choicePos();
    const newPlayerModel = {
      id: userIdParser.parse(randomUUID()),
      x,
      y,
      name: userName,
      score: 0,
      isAlive: true,
    };
    const res = await playersRepository.save(newPlayerModel);

    return res;
  },
  move: async (player: PlayerModel) => {
    const newPlayer = {
      ...player,
      x: player.x,
      y: player.y,
    };
    const res = await playersRepository.save(newPlayer);
    return res;
  },
  get: async () => {
    const res = await playersRepository.findAll();
    return res;
  },
  getStatus: async (playerId: Maybe<UserId>) => await playersRepository.find(playerId),

  delete: async (userId: UserId) => {
    await playersRepository.delete(userId);
  },
};
