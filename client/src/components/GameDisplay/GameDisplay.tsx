import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import type { BoardModel, Pos } from 'src/pages/game/index.page';
import styles from './GameDisplay.module.css';

const GameDisplay = ({ player, board }: { player: PlayerModel; board: BoardModel }) => {
  const [currentPlayerPos, setPlayerPos] = useState<Pos>();

  useEffect(() => {
    setPlayerPos({ x: player.x, y: player.y });
  }, [player]);

  const displayPos = (): Pos | undefined => {
    if (board[player.y][player.x] === -1) {
      return currentPlayerPos;
    }
    return { x: player.x, y: player.y };
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.display}
        style={{ gridTemplate: `repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr)` }}
      >
        {board.map((row, y) =>
          row.map((val, x) => (
            <div
              className={
                val === -1
                  ? styles.stone
                  : [val === 9, val === 10].some(Boolean)
                  ? `${styles.stone} ${styles.number}`
                  : styles.number
              }
              key={`${y}-${x}`}
              style={{
                backgroundPositionX: `${7.65 * (val - 1)}%`,
                /* stylelint-disable-next-line function-no-unknown */
                backgroundColor: [val === 9, val === 10, val === -1].some(Boolean)
                  ? '#4a2'
                  : '#dca',
              }}
            >
              {[displayPos() !== undefined, displayPos()?.x === x, displayPos()?.y === y].every(
                Boolean
              ) && <div className={styles.player} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameDisplay;
