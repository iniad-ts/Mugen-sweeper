import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
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

const TimeModule = ({ loadedTime }: { loadedTime: number | undefined }) => {
  const [nowTime, setNowTime] = useState<number>();
  useEffect(() => {
    const cancelId = setInterval(() => {
      setNowTime(Date.now());
    }, 500);
    return () => clearInterval(cancelId);
  });
  return (
    nowTime !== undefined &&
    loadedTime !== undefined && (
      <div className={styles.infoColumn}>{Math.max(0, nowTime - loadedTime) / 1000}秒前</div>
    )
  );
};

const GameDisplay = ({ player, board }: { player: PlayerModel; board: BoardModel }) => {
  const [selectedPos, setSelectedPos] = useState<PlayerPos>();
  const [displayPlayerPos, setDisplayPlayerPos] = useState<PlayerPos>();
  const [loadedTime, setLoadedTime] = useState<number>();
  useEffect(() => {
    setSelectedPos([player.x, player.y]);
    if (board[player.y] === undefined || viewSelectorList.includes(board[player.y][player.x])) {
      return;
    }
    setDisplayPlayerPos([player.x, player.y]);
    setLoadedTime(Date.now());
  }, [player, board]);
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.infoColumn}>your name</div>
        <div className={styles.infoColumn}>your score</div>
        <div className={styles.infoColumn}>Last update</div>
        <div className={styles.infoColumn}>your position</div>
        <div className={styles.infoColumn}>{player.name}</div>
        <div className={styles.infoColumn}>{player.score}</div>
        <TimeModule loadedTime={loadedTime} />
        <div className={styles.infoColumn}>
          {selectedPos && `[ ${selectedPos[0]} , ${selectedPos[1]} ]`}
        </div>
      </div>

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
                backgroundColor: cellBackgroundColor(val),
              }}
            >
              {displayPlayerPos !== undefined &&
                [displayPlayerPos[0] === x, displayPlayerPos[1] === y].every(Boolean) && (
                  <div className={styles.player} />
                )}
              {selectedPos !== undefined &&
                [selectedPos[0] === x, selectedPos[1] === y, viewSelectorList.includes(val)].every(
                  Boolean
                ) && <div className={styles.selector} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameDisplay;
