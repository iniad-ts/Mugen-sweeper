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

    const safeCells = game.bombMap
      .map((row, y) =>
        row
          .map((_, x) => x)
          .filter(
            (_, x) =>
              ![
                game.bombMap[y - 1]?.[x - 1],
                game.bombMap[y - 1]?.[x],
                game.bombMap[y - 1]?.[x + 1],
                game.bombMap[y][x - 1],
                game.bombMap[y][x],
                game.bombMap[y][x + 1],
                game.bombMap[y + 1]?.[x - 1],
                game.bombMap[y + 1]?.[x],
                game.bombMap[y + 1]?.[x + 1],
              ].some(Boolean)
          )
      )
      .map((row, y) => row.map((x) => [x, y]))
      .flat()
      .filter(Boolean);

    const choicePos = () => {
      const index = Math.floor(Math.random() * safeCells.length);
      return safeCells[index];
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
    const res = await playersRepository.findAllOrderByScoreDesc();
    return res;
  },
  getStatus: async (playerId: Maybe<UserId>) => await playersRepository.find(playerId),

  delete: async (userId: UserId) => {
    await playersRepository.delete(userId);
  },
};
