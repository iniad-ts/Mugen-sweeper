import type { BoardModel, Pos } from 'src/types/types';
import { CELL_NUMBER, CELL_STYLE_HANDLER, IS_BLANK_CELL, TYPE_IS } from 'src/utils/flag';
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

const yuusha = [
  '0002380009333380090777800907770011122247074444200004442200990990',
  '0022220009333330097777800977770011122240074444202244442209900990',
  '0083209008333390087770900077711102222470744440002244400009909900',
  '0088889008888880088888800077771100222240072332202222322209900990',
];

const colorList = [
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
  cattedBoard,
  transform,
  computed20Vmin,
  playerDisplay,
  dir,
  top,
  left,
}: {
  cattedBoard: BoardModel | null;
  transform: Pos;
  computed20Vmin: number;
  playerDisplay: BoardModel | null;
  dir: number;
  top: number;
  left: number;
}) => {
  if (cattedBoard === null || playerDisplay === null) {
    return <Loading visible />;
  }
  return (
    <>
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${cattedBoard.length}, 1fr) / repeat(${cattedBoard[0]?.length}, 1fr)`,
          transform: `translateY(${transform.y * computed20Vmin}px) translateX(${
            transform.x * computed20Vmin
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
                  {yuusha[dir].split('').map((color, y) => (
                    <div
                      key={y}
                      className={styles.pixel}
                      style={{ backgroundColor: colorList[Number(color)], border: 'none' }}
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
