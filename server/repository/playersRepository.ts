import type { Maybe, UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { userIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Player } from '@prisma/client';
import { z } from 'zod';

const toPlayerModel = (prismaPlayer: Player) => ({
  id: userIdParser.parse(prismaPlayer.id),
  name: z.string().parse(prismaPlayer.name),
  x: z.number().min(0).parse(prismaPlayer.x),
  y: z.number().min(0).parse(prismaPlayer.y),
  score: z.number().min(0).parse(prismaPlayer.score),
  isAlive: z.boolean().parse(prismaPlayer.isAlive),
});
export const playersRepository = {
  save: async (player: PlayerModel): Promise<PlayerModel> => {
    const prismaPlayer = await prismaClient.player.upsert({
      where: { id: player.id },
      update: {
        name: player.name,
        x: player.x,
        y: player.y,
        score: player.score,
        isAlive: player.isAlive,
      },
      create: {
        id: player.id,
        name: player.name,
        x: player.x,
        y: player.y,
        score: player.score,
        isAlive: player.isAlive,
      },
    });
    return toPlayerModel(prismaPlayer);
  },

  find: async (id: Maybe<UserId>): Promise<PlayerModel | null> => {
    const prismaPlayer = await prismaClient.player.findUnique({ where: { id } });
    return prismaPlayer !== null ? toPlayerModel(prismaPlayer) : null;
  },

  findAllOrderByScoreDesc: async (): Promise<PlayerModel[]> => {
    const prismaPlayers = await prismaClient.player.findMany({
      orderBy: { score: 'desc' }, //ランキングで使う？
    });
    return prismaPlayers.map(toPlayerModel);
  },

  delete: async (id: UserId): Promise<void> => {
    await prismaClient.player.delete({ where: { id } });
  },

  deleteAll: async () => {
    await prismaClient.player.deleteMany();
  },
};
