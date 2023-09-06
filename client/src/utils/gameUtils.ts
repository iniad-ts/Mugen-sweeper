import type { BoardModel } from 'src/types/types';
import { TYPE_IS } from './flag';

export const isFailed = (board: BoardModel) =>
  board.flat().find((cell) => TYPE_IS('bomb', cell)) !== undefined;
