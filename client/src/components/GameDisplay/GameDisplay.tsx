import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import type { BoardModel, Pos } from 'src/types/types';
import { controllerDisplay as toControllerDisplay } from 'src/utils/controllerDisplay';
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
  const [transform, setTransform] = useState<Pos>({ x: 0, y: 0 });
  const [oldPlayerPos, setOldPlayerPos] = useState<PlayerPos>();
  const [displayBoard, setDisplayBoard] = useState<BoardModel>();

  const computed20Vmin = useMemo(
    () => (20 * Math.min(windowSize[0], windowSize[1])) / 100,
    [windowSize]
  );

  const VERTICAL_DISTANCE_FROM_CENTER = Math.ceil(windowSize[0] / computed20Vmin / 2);

  const HORIZONTAL_DISTANCE_FROM_CENTER = Math.ceil(windowSize[1] / computed20Vmin / 2);

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
  }, [player.x, player.y, display.x, display.y]);

  useEffect(() => {
    if (playerPos !== undefined) {
      setOldPlayerPos([...playerPos]);
    }
  }, [playerPos]);

  useEffect(() => {
    if (playerPos === undefined || oldPlayerPos === undefined) return;
    setTransform({ x: playerPos[0] - oldPlayerPos[0], y: playerPos[1] - oldPlayerPos[1] });
    setDisplayBoard(
      toControllerDisplay(
        board,
        player.x,
        player.y,
        VERTICAL_DISTANCE_FROM_CENTER,
        HORIZONTAL_DISTANCE_FROM_CENTER
      )
    );
  }, [
    oldPlayerPos,
    playerPos,
    board,
    player.x,
    player.y,
    HORIZONTAL_DISTANCE_FROM_CENTER,
    VERTICAL_DISTANCE_FROM_CENTER,
  ]);

  useEffect(() => {
    if ([transform.x, transform.y].some(Boolean)) {
      setTimeout(() => setTransform({ x: 0, y: 0 }), 500);
    }
  }, [transform.x, transform.y]);

  const newBoard = deepCopy<BoardModel>(board);

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

  const playerDisplay = toControllerDisplay(
    newBoard,
    player.x,
    player.y,
    VERTICAL_DISTANCE_FROM_CENTER,
    HORIZONTAL_DISTANCE_FROM_CENTER
  );
  if (displayBoard === undefined) {
    setDisplayBoard(
      toControllerDisplay(
        board,
        player.x,
        player.y,
        VERTICAL_DISTANCE_FROM_CENTER,
        HORIZONTAL_DISTANCE_FROM_CENTER
      )
    );
    return;
  }
  return (
    <>
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${displayBoard.length}, 1fr) / repeat(${displayBoard[0].length}, 1fr)`,
          transform: `translateY(${maxMin(
            -computed20Vmin * transform.y,
            -computed20Vmin * displayBoard.length + windowSize[1] + computed20Vmin * transform.y,
            windowSize[1] / 2 -
              (computed20Vmin * displayBoard.length) / 2 +
              -Math.min(player.y - HORIZONTAL_DISTANCE_FROM_CENTER + 1, 0) -
              Math.max(player.y + HORIZONTAL_DISTANCE_FROM_CENTER - board.length, 0) * 80 +
              -transform.y * -computed20Vmin
          )}px) translateX(${maxMin(
            -computed20Vmin * transform.x,
            -computed20Vmin * displayBoard[0].length + windowSize[0] + computed20Vmin * transform.x,
            windowSize[0] / 2 -
              (computed20Vmin * displayBoard[0].length) / 2 +
              -Math.min(player.x - VERTICAL_DISTANCE_FROM_CENTER + 1, 0) -
              Math.max(player.x + VERTICAL_DISTANCE_FROM_CENTER - board[0].length, 0) * 80 +
              -transform.x * -computed20Vmin
          )}px)`,
          transition: ![transform.x, transform.y].some(Boolean) ? '1s' : '0s',
        }}
      >
        {displayBoard.map((row, y) =>
          row.map((val, x) => (
            <div
              className={
                ![transform.x, transform.y].some(Boolean)
                  ? CELL_STYLE_HANDLER(val, CLASS_NAMES)
                  : ''
              }
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
          gridTemplate: `repeat(${displayBoard.length}, 1fr) / repeat(${displayBoard[0].length}, 1fr)`,
          backgroundColor: '#0000',
        }}
      >
        {![transform.x, transform.y].some(Boolean) &&
          playerDisplay.map((row, y) =>
            row.map((val, x) => (
              <div key={`${y}-${x}`} style={{ backgroundColor: '#0000', border: 'none' }}>
                {Boolean(TYPE_IS('user', val)) && <>a</>}
              </div>
            ))
          )}
      </div>
    </>
  );
};

export default GameDisplay;
