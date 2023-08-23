import type { PlayerModel } from 'commonTypesWithClient/models';
import type { ActionModel, BoardModel } from 'src/types/types';
import { apiClient } from './apiClient';
import { minMax } from './minMax';

export const handleMove = async (action: ActionModel, board: BoardModel, player: PlayerModel) => {
  const move = async (moveX: number, moveY: number) => {
    const newPlayer = {
      ...player,
      x: minMax(player.x + moveX, board[0].length),
      y: minMax(player.y + moveY, board.length),
    };
    if (
      [
        [-1, 9, 10].includes(board[player.y][player.x]),
        board[newPlayer.y][newPlayer.x] === -1,
      ].every(Boolean)
    ) {
      return player;
    }
    const res = await apiClient.player.$post({ body: newPlayer });
    if (res === null) return player;
    return res;
  };

  if (action === 'left') {
    return move(-1, 0);
  } else if (action === 'right') {
    return move(1, 0);
  } else if (action === 'down') {
    return move(0, 1);
  } else if (action === 'up') {
    return move(0, -1);
  }
  return player;
};
