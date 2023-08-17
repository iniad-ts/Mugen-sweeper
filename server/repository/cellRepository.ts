import { userIdParser } from '$/service/idParsers';
import type { Cell } from '@prisma/client';
import { z } from 'zod';

const toCellModel = (prismaCell: Cell) => ({
  x: z.number().min(0),
  y: z.number().min(0),
  whoOpened:
    z
      .array(z.string())
      .parse(prismaCell.whoOpened)
      .map((userId) => userIdParser.parse(userId)) ?? null,
  whenOpened: prismaCell.whenOpened?.getTime() ?? null,
});
export const cellRepository = {
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
