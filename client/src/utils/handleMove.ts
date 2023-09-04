import type { PlayerModel } from 'commonTypesWithClient/models';
import type { ActionModel, BoardModel, Pos } from 'src/types/types';
import { apiClient } from './apiClient';
import { TYPE_IS } from './flag';
import { maxMin } from './maxMIn';

export const handleMove = async (
  action: ActionModel,
  board: BoardModel,
  player: PlayerModel,
  displayPos: Pos
) => {
  const move = async (moveX: number, moveY: number) => {
    if (
      board[player.y + moveY] !== undefined &&
      [
        !TYPE_IS('block', board[player.y + moveY][player.x + moveX]),
        player.y - displayPos.y === moveY,
        player.x - displayPos.x === moveX,
      ].every(Boolean)
    ) {
      return jumps()[action];
    }
    const newPlayer = {
      ...player,
      x: maxMin(board[0].length - 1, 0, displayPos.x + moveX),
      y: maxMin(board.length - 1, 0, displayPos.y + moveY),
    };

    const newDisplayPos = TYPE_IS('block', board[newPlayer.y][newPlayer.x])
      ? { x: displayPos.x, y: displayPos.y }
      : { x: newPlayer.x, y: newPlayer.y };
    const res = await apiClient.player.$post({ body: newPlayer });
    if (res === null) {
      return { player, displayPos };
    }

    return { player: res, displayPos: newDisplayPos };
  };
  const jump = async (moveX: number, moveY: number) => {
    const newPlayer = {
      ...player,
      x: maxMin(board[0].length - 1, 0, player.x + moveX),
      y: maxMin(board.length - 1, 0, player.y + moveY),
    };

    if (board[newPlayer.y] !== undefined && TYPE_IS('block', board[newPlayer.y][newPlayer.x])) {
      return { player, displayPos };
    }

    const newDisplayPos = { x: newPlayer.x, y: newPlayer.y };

    const res = await apiClient.player.$post({ body: newPlayer });

    if (res === null) {
      return { player, displayPos };
    }

    return { player: res, displayPos: newDisplayPos };
  };
  const moves = () => ({
    left: move(-1, 0),
    right: move(1, 0),
    up: move(0, -1),
    down: move(0, 1),
    ur: move(1, -1),
    ul: move(-1, -1),
    dr: move(1, 1),
    dl: move(-1, 1),
    middle: move(0, 0),
  });

  const jumps = () => ({
    left: jump(-1, 0),
    right: jump(1, 0),
    up: jump(0, -1),
    down: jump(0, 1),
    ur: jump(1, -1),
    ul: jump(-1, -1),
    dr: jump(1, 1),
    dl: jump(-1, 1),
    middle: jump(0, 0),
  });
  return moves()[action];
};
