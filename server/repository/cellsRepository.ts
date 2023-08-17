import type { CellModel } from '$/commonTypesWithClient/models';
import { userIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Cell } from '@prisma/client';
import { z } from 'zod';

const toCellModel = (prismaCell: Cell) => ({
  x: z.number().min(0).parse(prismaCell.x),
  y: z.number().min(0).parse(prismaCell.y),
  IsBombCell: z.boolean().parse(prismaCell.IsBombCell),
  cellValue: z.number().min(0).parse(prismaCell.cellValue),
  whoOpened:
    z
      .array(z.string())
      .parse(prismaCell.whoOpened)
      .map((userId) => userIdParser.parse(userId)) ?? null,
  whenOpened: prismaCell.whenOpened instanceof Date ? prismaCell.whenOpened.getTime() : null,
});
export const cellsRepository = {
  save: async (cell: CellModel): Promise<CellModel> => {
    const prismaCell = await prismaClient.cell.upsert({
      where: { pos: { x: cell.x, y: cell.y } },
      update: {
        whoOpened: cell.whoOpened?.map((userId) => userId.toString()),
        whenOpened: cell.whenOpened !== null ? new Date(cell.whenOpened) : null,
      },
      create: {
        x: cell.x,
        y: cell.y,
        IsBombCell: cell.IsBombCell,
        cellValue: cell.cellValue,
        whoOpened: cell.whoOpened?.map((userId) => userId.toString()),
        whenOpened: cell.whenOpened !== null ? new Date(cell.whenOpened) : null,
      },
    });
    return toCellModel(prismaCell);
  },
  findAll: async (): Promise<CellModel[]> => {
    const prismaCells = await prismaClient.cell.findMany({
      orderBy: { x: 'asc', y: 'asc' },
    });
    return prismaCells.map(toCellModel);
  },
  find: async (x: number, y: number): Promise<CellModel | null> => {
    const prismaCell = await prismaClient.cell.findUnique({ where: { pos: { x, y } } });
    return prismaCell !== null ? toCellModel(prismaCell) : null;
  },
};
