import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import type { BoardModel } from 'src/types/types';
import { deepCopy } from 'src/utils/deepCopy';
import { CELL_FLAGS, CELL_NUMBER, CELL_STYLE_HANDLER, HAS_FLAG, TYPE_IS } from 'src/utils/flag';
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
  useEffect(() => {
    setPlayerPos([player.x, player.y]);
    if (board[player.y] === undefined || TYPE_IS('block', board[player.y][player.x])) {
      return;
    }
    setDisplayPos([player.x, player.y]);
  }, [player.x, player.y, board]);
  const newBoard = deepCopy<BoardModel>(board);
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
  return (
    <div
      className={styles.display}
      style={{ gridTemplate: `repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr)` }}
    >
      {newBoard.map((row, y) =>
        row.map((val, x) => (
          <div
            className={CELL_STYLE_HANDLER(val, CLASS_NAMES)}
            key={`${y}-${x}`}
            style={
              !HAS_FLAG(val)
                ? {
                    backgroundPositionX: `${7.65 * (CELL_NUMBER(val) - 1)}%`,
                  }
                : {}
            }
          >
            {val}
          </div>
        ))
      )}
    </div>
  );
};

export default GameDisplay;
