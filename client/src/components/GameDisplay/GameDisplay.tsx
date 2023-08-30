import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import type { BoardModel } from 'src/types/types';
import { deepCopy } from 'src/utils/deepCopy';
import {
  CELL_FLAGS,
  CELL_NUMBER,
  CELL_STYLE_HANDLER,
  IS_BLANK_CELL,
  TYPE_IS,
} from 'src/utils/flag';
import { maxMin } from 'src/utils/maxMIn';
import styles from './GameDisplay.module.css';

const CLASS_NAMES = {
  block: styles.block,
  flag: styles.flag,
  user: styles.user,
  select: styles.selector,
  bomb: styles.bomb,
  number: styles.number,
};
type PlayerPos = [number, number];

const GameDisplay = ({ player, board }: { player: PlayerModel; board: BoardModel }) => {
  const [playerPos, setPlayerPos] = useState<PlayerPos>();
  const [displayPos, setDisplayPos] = useState<PlayerPos>();
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPlayerPos([player.x, player.y]);
    if (board[player.y] === undefined) {
      if (TYPE_IS(board[maxMin(board.length - 1, 0, player.y)][player.x], 'block')) {
        return;
      }
      setDisplayPos([player.x, maxMin(board.length - 1, 0, player.y)]);
      return;
    }
    if (TYPE_IS(board[player.y][player.x], 'block')) {
      return;
    }
    setDisplayPos([player.x, player.y]);
  }, [player.x, player.y, board]);

  const newBoard = deepCopy<BoardModel>(board);

  const computedVmin = useMemo(() => Math.min(windowSize[0], windowSize[1]) / 100, [windowSize]);

  newBoard.forEach((row, y) =>
    row.map((val, x) => {
      if (playerPos?.[0] === x && playerPos?.[1] === y) {
        newBoard[y][x] = val | CELL_FLAGS['select'];
      }
      if (displayPos?.[0] === x && displayPos?.[1] === y) {
        // console.log(x, y);
        newBoard[y][x] = val | CELL_FLAGS['user'];
        console.log(newBoard[y][x]);
      }
    })
  );
  console.log(player.x, player.y);

  return (
    <div
      className={styles.display}
      style={{
        gridTemplate: `repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr)`,
        top: `${
          (maxMin(newBoard.length - 3, 2, player.y) + 0.5) * computedVmin * -20 + windowSize[1] / 2
        }px`,
        left: `${
          (maxMin(newBoard[0].length - 6, 5, player.x) + 0.5) * computedVmin * -20 +
          windowSize[0] / 2
        }px`,
      }}
    >
      {newBoard.map((row, y) =>
        row.map((val, x) => (
          <div
            className={CELL_STYLE_HANDLER(val, CLASS_NAMES)}
            key={`${y}-${x}`}
            style={
              !IS_BLANK_CELL(val)
                ? {
                    backgroundPositionX: `${7.65 * (CELL_NUMBER(val) - 1)}%`,
                  }
                : {}
            }
          />
        ))
      )}
    </div>
  );
};

export default GameDisplay;
