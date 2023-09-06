import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import { useBoard, useLeft, useTop } from 'src/Hooks/useBoard';
import type { BoardModel, Pos } from 'src/types/types';
import { deepCopy } from 'src/utils/deepCopy';
import {
  CELL_FLAGS,
  CELL_NUMBER,
  CELL_STYLE_HANDLER,
  IS_BLANK_CELL,
  TYPE_IS,
} from 'src/utils/flag';
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

const yushaImages = [
  '0002380009333380090777800907770011122247074444200004442200990990',
  '0022220009333330097777800977770011122240074444202244442209900990',
  '0083209008333390087770900077711102222470744440002244400009909900',
  '0088889008888880088888800077771100222240072332202222322209900990',
];

const yuushColorList = [
  '#0000',
  'red',
  'purple',
  'blue',
  'green',
  'yellow',
  'orange',
  'brown',
  'gray',
  '#fff',
];

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

  const TO_CENTER_WIDTH = Math.ceil(windowSize[0] / computed20Svmin / 2) + 1;

  const TO_CENTER_HEIGHT = Math.ceil(windowSize[1] / computed20Svmin / 2) + 1;

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

  const left = useLeft(board, cattedBoard, computed20Svmin, player, windowSize);

  const top = useTop(board, cattedBoard, computed20Svmin, player, windowSize);

  if (cattedBoard === null || playerDisplay === null) {
    return <Loading visible />;
  }
  return (
    <>
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${cattedBoard.length}, 1fr) / repeat(${cattedBoard[0]?.length}, 1fr)`,
          transform: `translateY(${transform.y * computed20Svmin}px) translateX(${
            transform.x * computed20Svmin
          }px)`,
          transition: transform.x === 0 && transform.y === 0 ? '0.25s' : '0s',
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
                      style={{ backgroundColor: yuushColorList[Number(color)], border: 'none' }}
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
