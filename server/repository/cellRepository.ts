import { gameIdParser } from '$/service/idParsers';
import type { Game } from '@prisma/client';
import { z } from 'zod';

const toGameModel = (prismaGame: Game) => ({
  id: gameIdParser.parse(prismaGame.id),
  bombMap: z.array(z.array(z.union([z.literal(0), z.literal(1)]))).parse(prismaGame.bombMap),
  userInputs: z
    .array(z.array(z.union([z.literal(0), z.literal(1), z.literal(2)])))
    .parse(prismaGame.bombMap),
});

export const gameModelRepository = {
  create: () => {
    // /
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
