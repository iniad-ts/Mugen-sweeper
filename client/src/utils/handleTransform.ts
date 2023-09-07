import type { ActionModel, Pos } from 'src/types/types';

const d: ActionModel[] = ['dr', 'right', 'ur'];
const a: ActionModel[] = ['dl', 'left', 'ul'];
const s: ActionModel[] = ['dr', 'down', 'dl'];
const w: ActionModel[] = ['ur', 'up', 'ul'];

export const handleTransform = (action: ActionModel, resDisplayPos: Pos, displayPos: Pos) => {
  const transform = { x: 0, y: 0 };
  if ([resDisplayPos.x === displayPos.x, resDisplayPos.y === displayPos.y].every(Boolean))
    return transform;
  const transforms = () => {
    if (d.includes(action)) {
      transform.x = 1;
    }
    if (a.includes(action)) {
      transform.x = -1;
    }
    if (s.includes(action)) {
      transform.y = 1;
    }
    if (w.includes(action)) {
      transform.y = -1;
    }
  };
  transforms();
  return transform;
};
