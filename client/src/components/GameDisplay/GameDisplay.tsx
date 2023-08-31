import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import type { BoardModel } from 'src/types/types';
import styles from './GameDisplay.module.css';

const shouldDisplayStone = [-1, 9, 10];
const shouldDisplayStoneImage = [9, 10];
const shouldDisplayNumber = [1, 2, 3, 4, 5, 6, 7, 8];

const GameDisplay = ({ player, board }: { player: PlayerModel; board: BoardModel }) => {
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

  const vmin = useMemo(() => Math.min(windowSize[0], windowSize[1]) / 100, [windowSize]);

  return (
    <>
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${board.length}, 1fr) / repeat(${board[0].length}, 1fr)`,
          transform: `translateX(${
            (player.x + 0.6) * vmin * -20 + windowSize[0] * 0.5
          }px) translateY(${(player.y + 0.6) * vmin * -20 + windowSize[1] * 0.5}px)`,
        }}
      >
        {board.map((row, y) =>
          row.map((val, x) => (
            <div
              className={styles.cell}
              key={`${y}-${x}`}
              style={
                shouldDisplayNumber.includes(val)
                  ? { backgroundPositionX: `${(val - 1) * -100}%` }
                  : { backgroundImage: 'none' }
              }
            >
              {shouldDisplayStone.includes(val) && (
                <div
                  className={styles.stone}
                  style={
                    shouldDisplayStoneImage.includes(val)
                      ? { backgroundPositionX: `${(val - 1) * -100}%` }
                      : { backgroundImage: 'none' }
                  }
                />
              )}
            </div>
          ))
        )}
      </div>
      <div className={styles.player} />
    </>
  );
};

export default GameDisplay;
