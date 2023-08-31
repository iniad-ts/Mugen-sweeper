import type { PlayerModel } from 'commonTypesWithClient/models';
import type { ActionModel, BoardModel } from 'src/types/types';
import { apiClient } from './apiClient';
import { TYPE_IS } from './flag';
import { maxMin } from './maxMIn';

export const handleMove = async (action: ActionModel, board: BoardModel, player: PlayerModel) => {
  const move = async (moveX: number, moveY: number) => {
    const newPlayer = {
      ...player,
      x: maxMin(board[0].length - 1, 0, player.x + moveX),
      y: maxMin(board.length, 0, player.y + moveY),
    };
    if (
      [board[player.y] !== undefined, board[newPlayer.y] !== undefined].every(Boolean) &&
      [
        TYPE_IS(board[player.y][player.x], 'block'),
        TYPE_IS(board[newPlayer.y][newPlayer.x], 'block'),
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
