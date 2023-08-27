import type { PlayerModel } from 'commonTypesWithClient/models';
import type { ActionModel, BoardModel } from 'src/types/types';
import { apiClient } from './apiClient';
import { CELL_FLAGS } from './boardFlag';
import { maxMin } from './maxMIn';

export const handleMove = async (action: ActionModel, board: BoardModel, player: PlayerModel) => {
  const move = async (moveX: number, moveY: number) => {
    const newPlayer = {
      ...player,
      x: maxMin(board[0].length - 1, 0, player.x + moveX),
      y: maxMin(board.length - 1, 0, player.y + moveY),
    };
    if (
      [
        board[player.y][player.x] & CELL_FLAGS['block'],
        board[newPlayer.y][newPlayer.x] & CELL_FLAGS['block'],
      ].every(Boolean)
    ) {
      return player;
    }
    const res = await apiClient.player.$post({ body: newPlayer });
    if (res === null) return player;
    return res;
  };
  const moves = {
    left: move(-1, 0),
    right: move(1, 0),
    up: move(0, -1),
    down: move(0, 1),
    ur: move(1, -1),
    ul: move(-1, -1),
    dr: move(1, 1),
    dl: move(-1, 1),
    middle: move(0, 0),
  };
  return moves[action];
};
