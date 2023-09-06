import type { PlayerModel } from 'commonTypesWithClient/models';
import type { ActionModel, BoardModel, Pos } from 'src/types/types';

const d: ActionModel[] = ['dr', 'right', 'ur'];
const a: ActionModel[] = ['dl', 'left', 'ul'];
const s: ActionModel[] = ['dr', 'down', 'dl'];
const w: ActionModel[] = ['ur', 'up', 'ul'];

export const handleTransform = (
  action: ActionModel,
  resDisplayPos: Pos,
  displayPos: Pos,
  player: PlayerModel,
  VERTICAL_DISTANCE_FROM_CENTER: number,
  HORIZONTAL_DISTANCE_FROM_CENTER: number,
  board: BoardModel
) => {
  const transform = { x: 0, y: 0 };
  if ([resDisplayPos.x === displayPos.x, resDisplayPos.y === displayPos.y].every(Boolean))
    return transform;
  const transforms = () => {
    if (
      [
        player.x <= board[0].length - 1 - VERTICAL_DISTANCE_FROM_CENTER,
        player.x >= VERTICAL_DISTANCE_FROM_CENTER - 1,
        d.includes(action),
      ].every(Boolean)
    ) {
      transform.x = 1;
    }
    if (
      [
        player.x <= board[0].length - VERTICAL_DISTANCE_FROM_CENTER,
        player.x >= VERTICAL_DISTANCE_FROM_CENTER,
        a.includes(action),
      ].every(Boolean)
    ) {
      transform.x = -1;
    }
    if (
      [
        player.y <= board.length - 1 - HORIZONTAL_DISTANCE_FROM_CENTER,
        player.y >= HORIZONTAL_DISTANCE_FROM_CENTER - 1,
        s.includes(action),
      ].every(Boolean)
    ) {
      transform.y = 1;
    }
    if (
      [
        player.y <= board.length - HORIZONTAL_DISTANCE_FROM_CENTER,
        player.y >= HORIZONTAL_DISTANCE_FROM_CENTER,
        w.includes(action),
      ].every(Boolean)
    ) {
      transform.y = -1;
    }
  };
  transforms();
  return transform;
};
