import { userIdParser } from '$/service/idParsers';
import type { Player } from '@prisma/client';
import { z } from 'zod';

const toPlayerModel = (prismaPlayer: Player) => ({
  id: userIdParser.parse(prismaPlayer.id),
  name: z.string().parse(prismaPlayer.name),
  x: z.number().min(0),
  y: z.number().min(0),
  score: z.number().min(0).parse(prismaPlayer.score),
  isLive: z.boolean().parse(prismaPlayer.isLive),
});
export const playerRepository = {
  create: () => {
    //
  },
  save: () => {
    //
  },
  find: () => {
    //
  },
  delete: () => {
    //
  },
};
