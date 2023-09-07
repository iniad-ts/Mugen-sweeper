import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import { useBoard, useLeft, useTop } from 'src/Hooks/useBoard';
import type { BoardModel, Pos } from 'src/types/types';
import { deepCopy } from 'src/utils/deepCopy';
import { fixTransform } from 'src/utils/fixTransform';
import {
  CELL_FLAGS,
  CELL_NUMBER,
  CELL_STYLE_HANDLER,
  IS_BLANK_CELL,
  TYPE_IS,
} from 'src/utils/flag';
import { yushaColorList, yushaImages } from 'src/utils/yushaImage';
import { Loading } from '../Loading/Loading';
import styles from './GameDisplay.module.css';

const CLASS_NAMES = {
  block: styles.block,
  flag: styles.flag,
  user: styles.user,
  select: styles.selector,
  bomb: styles.bomb,
  number: styles.number,
};

const GameDisplay = ({
  transform,
  dir,
  board,
  player,
  displayPos,
}: {
  transform: Pos;
  dir: number;
  board: BoardModel;
  player: PlayerModel;
  displayPos: Pos;
}) => {
  const [windowSize, setWindowSize] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);

  const computed20Svmin = useMemo(
    () => (20 * Math.min(windowSize[0], windowSize[1])) / 100,
    [windowSize]
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TO_CENTER_WIDTH = Math.ceil((windowSize[0] / computed20Svmin + 1) / 2);

  const TO_CENTER_HEIGHT = Math.ceil((windowSize[1] / computed20Svmin + 1) / 2);

  const newBoard = deepCopy<BoardModel | undefined>(board);

  newBoard?.forEach((row, y) =>
    row.map((val, x) => {
      if (player?.x === x && player.y === y) {
        newBoard[y][x] = val | CELL_FLAGS['select'];
      }
      if (displayPos?.x === x && displayPos?.y === y) {
        newBoard[y][x] = val | CELL_FLAGS['user'];
      }
    })
  );

  const cattedBoard = useBoard(
    board,
    displayPos?.x,
    displayPos?.y,
    TO_CENTER_WIDTH,
    TO_CENTER_HEIGHT
  );

  const playerDisplay = useBoard(
    newBoard,
    displayPos?.x,
    displayPos?.y,
    TO_CENTER_WIDTH,
    TO_CENTER_HEIGHT
  );

  const { boardTransform, displayTransform } = fixTransform(
    displayPos,
    TO_CENTER_WIDTH,
    TO_CENTER_HEIGHT,
    board,
    transform
  );

  const left = useLeft(board, cattedBoard, computed20Svmin, displayPos, windowSize);

  const top = useTop(board, cattedBoard, computed20Svmin, displayPos, windowSize);

  if (cattedBoard === null || playerDisplay === null) {
    return <Loading visible />;
  }
  return (
    <>
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${cattedBoard.length}, 1fr) / repeat(${cattedBoard[0]?.length}, 1fr)`,
          transform: `translateY(${boardTransform.y * computed20Svmin}px) translateX(${
            boardTransform.x * computed20Svmin
          }px)`,
          transition: [boardTransform.x === 0, boardTransform.y === 0].every(Boolean)
            ? '0.1s'
            : '0s',
          top,
          left,
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
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${cattedBoard.length}, 1fr) / repeat(${cattedBoard[0].length}, 1fr)`,
          backgroundColor: '#0000',

          transform: `translateY(${displayTransform.y * computed20Svmin}px) translateX(${
            displayTransform.x * computed20Svmin
          }px)`,
          transition: [displayTransform.x === 0, displayTransform.y === 0].every(Boolean)
            ? '0.1s'
            : '0s',
          top,
          left,
        }}
      >
        {playerDisplay.map((row, y) =>
          row.map((val, x) => (
            <div key={`${y}-${x}`} style={{ backgroundColor: '#0000', border: 'none' }}>
              {Boolean(TYPE_IS('user', val)) && (
                <div className={styles.yusha} style={{ backgroundColor: '#0000', border: 'none' }}>
                  {yushaImages[dir].split('').map((color, y) => (
                    <div
                      key={y}
                      className={styles.pixel}
                      style={{ backgroundColor: yushaColorList[Number(color)], border: 'none' }}
                    />
                  ))}
                </div>
              )}
              {Boolean(TYPE_IS('select', val)) && (
                <div
                  className={styles.yusha}
                  style={{ backgroundColor: '#f008', border: 'none' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default GameDisplay;
