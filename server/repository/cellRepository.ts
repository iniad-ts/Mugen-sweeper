import { userIdParser } from '$/service/idParsers';
import type { Cell } from '@prisma/client';
import { z } from 'zod';

const toCellModel = (prismaCell: Cell) => ({
  where: z.object({ x: z.number().min(0), y: z.number().min(0) }).parse(prismaCell.where),
  whoOpened: userIdParser.parse(prismaCell.whenOpened) ?? null,
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
