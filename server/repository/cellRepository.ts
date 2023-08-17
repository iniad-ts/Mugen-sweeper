import type { CellModel } from '$/commonTypesWithClient/models';
import { userIdParser } from '$/service/idParsers';
import type { Cell } from '@prisma/client';
import { z } from 'zod';

const toCellModel = (prismaCell: Cell): CellModel => ({
  x: z.number().min(0).parse(prismaCell),
  y: z.number().min(0).parse(prismaCell.y),
  isBombCell: z.boolean().parse(prismaCell.isBombCell),
  cellValue: z.number().min(0).parse(prismaCell.cellValue),
  whoOpened: userIdParser.parse(prismaCell.whoOpened),
  whenOpened: prismaCell.whenOpened.getTime(),
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
