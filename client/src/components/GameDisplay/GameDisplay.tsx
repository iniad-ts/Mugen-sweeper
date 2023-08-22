import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import type { BoardModel, Pos } from 'src/pages/game/index.page';
import styles from './GameDisplay.module.css';

const cellStyler = (val: number) =>
  val === -1
    ? styles.stone
    : [val === 9, val === 10].some(Boolean)
    ? `${styles.stone} ${styles.number}`
    : styles.number;

const viewSelectorList = [-1, 9, 10];

const GameDisplay = ({ player, board }: { player: PlayerModel; board: BoardModel }) => {
  const [playerPos, setPlayerPos] = useState<Pos>();
  const [displayPos, setDisplayPos] = useState<Pos>();

  useEffect(() => {
    setPlayerPos({ x: player.x, y: player.y });
    if (viewSelectorList.includes(board[player.y][player.x])) return;
    setDisplayPos({ x: player.x, y: player.y });
  }, [board, player.x, player.y]);

  return (
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
                /* stylelint-disable-next-line */
                backgroundColor: viewSelectorList.includes(val) ? '#4a2' : '#dca',
              }}
            >
              {[displayPos !== undefined, displayPos?.x === x, displayPos?.y === y].every(
                Boolean
              ) && <div className={styles.player} />}
              {[
                playerPos !== undefined,
                playerPos?.x === x,
                playerPos?.y === y,
                viewSelectorList.includes(val),
              ].every(Boolean) && <div className={styles.selector} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameDisplay;
