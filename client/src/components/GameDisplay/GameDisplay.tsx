import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import type { BoardModel } from 'src/types/types';
import styles from './GameDisplay.module.css';

const cellStyler = (val: number) =>
  val === -1
    ? styles.stone
    : [val === 9, val === 10].some(Boolean)
    ? `${styles.stone} ${styles.number}`
    : styles.number;

const cellBackgroundColor = (val: number) =>
  [val === 9, val === 10, val === -1].some(Boolean) ? '#4a2' : '#dca';

const viewSelectorList = [-1, 9, 10];

type PlayerPos = [number, number];

const GameDisplay = ({ player, board }: { player: PlayerModel; board: BoardModel }) => {
  const [playerPos, setPlayerPos] = useState<PlayerPos>();
  const [displayPos, setDisplayPos] = useState<PlayerPos>();
  console.table(board);
  useEffect(() => {
    setPlayerPos([player.x, player.y]);
    if (board[player.y] === undefined || viewSelectorList.includes(board[player.y][player.x])) {
      return;
    }
    setDisplayPos([player.x, player.y]);
  }, [player.x, player.y, board]);
  return useMemo(
    () => (
      <div className={styles.container}>
        <div
          className={styles.display}
          style={{ gridTemplate: `repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr)` }}
        >
          {board.map((row, y) =>
            row.map((val, x) => (
              <div
                className={cellStyler(val)}
                key={`${y}-${x}`}
                style={{
                  backgroundPositionX: `${7.65 * (val - 1)}%`,
                  /* stylelint-disable-next-line  */
                  backgroundColor: cellBackgroundColor(val),
                }}
              >
                {displayPos !== undefined &&
                  [displayPos[0] === x, displayPos[1] === y].every(Boolean) && (
                    <div className={styles.player} />
                  )}
                {playerPos !== undefined &&
                  [playerPos[0] === x, playerPos[1] === y, viewSelectorList.includes(val)].every(
                    Boolean
                  ) && <div className={styles.selector} />}
              </div>
            ))
          )}
        </div>
      </div>
    ),
    [board, displayPos, playerPos]
  );
};

export default GameDisplay;
