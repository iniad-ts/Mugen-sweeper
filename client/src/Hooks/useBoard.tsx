import { useMemo } from 'react';
import type { BoardModel, Pos } from '../types/types';

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
  computed20Svmin: number,
  displayPos: Pos | undefined,
  windowSize: [number, number]
) =>
  useMemo(() => {
    const left = (
      boardNotUndefined: BoardModel,
      cattedBoardXLength: number,
      displayPosNotUndefined: Pos,
      windowSizeX: number
    ) =>
      displayPosNotUndefined.x === 0
        ? 0
        : displayPosNotUndefined.x === boardNotUndefined[0].length - 1
        ? -(cattedBoardXLength * computed20Svmin - windowSizeX)
        : -(cattedBoardXLength * computed20Svmin - windowSizeX) / 2;

    if (displayPos === undefined || cattedBoard === null || board === undefined) {
      return 0;
    }
    return left(board, cattedBoard[0].length, displayPos, windowSize[0]);
  }, [board, cattedBoard, computed20Svmin, displayPos, windowSize]);

export const useTop = (
  board: BoardModel | undefined,
  cattedBoard: BoardModel | null,
  computed20Svmin: number,
  displayPos: Pos | undefined,
  windowSize: [number, number]
) =>
  useMemo(() => {
    const top = (
      boardNotUndefined: BoardModel,
      cattedBoardYLength: number,
      displayPosNotUndefined: Pos,
      windowSizeY: number
    ) =>
      displayPosNotUndefined.y === 0
        ? 0
        : displayPosNotUndefined.y === boardNotUndefined.length - 1
        ? -(cattedBoardYLength * computed20Svmin - windowSizeY)
        : -(cattedBoardYLength * computed20Svmin - windowSizeY) / 2;
    if (displayPos === undefined || cattedBoard === null || board === undefined) {
      return 0;
    }
    return top(board, cattedBoard.length, displayPos, windowSize[1]);
  }, [board, cattedBoard, computed20Svmin, displayPos, windowSize]);
