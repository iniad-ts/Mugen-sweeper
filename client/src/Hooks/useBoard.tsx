import type { PlayerModel } from 'commonTypesWithClient/models';
import { useMemo } from 'react';
import type { BoardModel } from '../types/types';

export const useBoard = (
  board: BoardModel | undefined,
  x: number | undefined,
  y: number | undefined,
  VERTICAL_DISTANCE_FROM_CENTER: number,
  HORIZONTAL_DISTANCE_FROM_CENTER: number
): BoardModel | null =>
  useMemo(() => {
    if (board === undefined || x === undefined || y === undefined) return null;
    const displayLeft = x - VERTICAL_DISTANCE_FROM_CENTER + 1;

    const displayTop = y - HORIZONTAL_DISTANCE_FROM_CENTER + 1;

    const displayRight = x + VERTICAL_DISTANCE_FROM_CENTER;

    const displayBottom = y + HORIZONTAL_DISTANCE_FROM_CENTER;

    const correctionX = -Math.min(displayLeft, 0) - Math.max(displayRight - board[0].length, 0);

    const correctionY = -Math.min(displayTop, 0) - Math.max(displayBottom - board.length, 0);

    const slicedBoard = board
      .map((row) => row.slice(displayLeft + correctionX, displayRight + correctionX))
      .slice(displayTop + correctionY, displayBottom + correctionY);
    return slicedBoard;
  }, [HORIZONTAL_DISTANCE_FROM_CENTER, VERTICAL_DISTANCE_FROM_CENTER, board, x, y]);

export const useLeft = (
  board: BoardModel | undefined,
  cattedBoard: BoardModel | null,
  computed20Vmin: number,
  player: PlayerModel | undefined,
  windowSize: [number, number]
) =>
  useMemo(() => {
    const left = (
      boardNotUndefined: BoardModel,
      cattedBoardXLength: number,
      playerNotUndefined: PlayerModel,
      windowSizeX: number
    ) =>
      playerNotUndefined.x <= 1
        ? 0
        : playerNotUndefined.x >= boardNotUndefined[0].length - 2
        ? -(cattedBoardXLength * computed20Vmin - windowSizeX)
        : -(cattedBoardXLength * computed20Vmin - windowSizeX) / 2;

    if (player === undefined || cattedBoard === null || board === undefined) {
      return 0;
    }
    return left(board, cattedBoard[0].length, player, windowSize[0]);
  }, [board, cattedBoard, computed20Vmin, player, windowSize]);

export const useTop = (
  board: BoardModel | undefined,
  cattedBoard: BoardModel | null,
  computed20Vmin: number,
  player: PlayerModel | undefined,
  windowSize: [number, number]
) =>
  useMemo(() => {
    const top = (
      boardNotUndefined: BoardModel,
      cattedBoardYLength: number,
      playerNotUndefined: PlayerModel,
      windowSizeY: number
    ) =>
      playerNotUndefined.y <= 1
        ? 0
        : playerNotUndefined.y >= boardNotUndefined.length - 2
        ? -(cattedBoardYLength * computed20Vmin - windowSizeY)
        : -(cattedBoardYLength * computed20Vmin - windowSizeY) / 2;
    if (player === undefined || cattedBoard === null || board === undefined) {
      return 0;
    }
    return top(board, cattedBoard.length, player, windowSize[1]);
  }, [board, cattedBoard, computed20Vmin, player, windowSize]);
