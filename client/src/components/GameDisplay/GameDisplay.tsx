import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import type { BoardModel, Pos } from 'src/types/types';
import { deepCopy } from 'src/utils/deepCopy';
import { CELL_FLAGS, CELL_NUMBER, CELL_STYLE_HANDLER, IS_BLANK_CELL } from 'src/utils/flag';
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

const GameDisplay = ({
  player,
  board,
  display,
}: {
  player: PlayerModel;
  board: BoardModel;
  display: Pos;
}) => {
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
    setDisplayPos([display.x, display.y]);
  }, [player.x, player.y, display]);
  const newBoard = deepCopy<BoardModel>(board);

  const computedVmin = useMemo(() => Math.min(windowSize[0], windowSize[1]) / 100, [windowSize]);

  newBoard.forEach((row, y) =>
    row.map((val, x) => {
      if (playerPos?.[0] === x && playerPos?.[1] === y) {
        newBoard[y][x] = val | CELL_FLAGS['select'];
      }
      if (displayPos?.[0] === x && displayPos?.[1] === y) {
        newBoard[y][x] = val | CELL_FLAGS['user'];
      }
    })
  );

  const VERTICAL_DISTANCE_FROM_CENTER = Math.ceil(windowSize[0] / (20 * computedVmin) / 2) + 1;

  const HORIZONTAL_DISTANCE_FROM_CENTER = Math.ceil(windowSize[1] / (20 * computedVmin) / 2) + 1;

  const displayLeft = player.x - VERTICAL_DISTANCE_FROM_CENTER + 1;

  const displayTop = player.y - HORIZONTAL_DISTANCE_FROM_CENTER + 1;

  const displayRight = player.x + VERTICAL_DISTANCE_FROM_CENTER;

  const displayBottom = player.y + HORIZONTAL_DISTANCE_FROM_CENTER;

  const correctionX = -Math.min(displayLeft, 0) - Math.max(displayRight - board[0].length, 0);

  const correctionY = -Math.min(displayTop, 0) - Math.max(displayBottom - board.length, 0);

  const cattedBoard = newBoard
    .map((row) => row.slice(displayLeft + correctionX, displayRight + correctionX))
    .slice(displayTop + correctionY, displayBottom + correctionY);
  return (
    <div
      className={styles.display}
      style={{
        gridTemplate: `repeat(${cattedBoard.length}, 1fr) / repeat(${cattedBoard[0].length}, 1fr)`,
        transform: `translateY(${maxMin(
          0,
          -20 * computedVmin * cattedBoard.length + windowSize[1],
          windowSize[1] / 2 - (20 * computedVmin * cattedBoard.length) / 2 + correctionY * 80
        )}px) translateX(${maxMin(
          0,
          -20 * computedVmin * cattedBoard[0].length + windowSize[0],
          windowSize[0] / 2 - (20 * computedVmin * cattedBoard[0].length) / 2 + correctionX * 80
        )}px)`,
      }}
    >
      {cattedBoard.map((row, y) =>
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
