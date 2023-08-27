import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import type { BoardModel, Pos } from 'src/types/types';
import { CELL_FLAGS, CELL_STYLE_HANDLER, IS_BLANK_CELL, NUMBER } from 'src/utils/boardFlag';
import { toControllerBoard } from 'src/utils/toControllerBoard';
import styles from './GameDisplay.module.css';

const CLASS_NAMES = {
  block: styles.block,
  flag: styles.flag,
  user: styles.user,
  select: styles.selector,
  bomb: styles.bomb,
  number: styles.number,
  unBlock: '',
  unFlag: '',
  unUser: '',
  unSelect: '',
  unBomb: '',
};

const cellStyler = (val: number) =>
  val === -1
    ? styles.block
    : [val === 9, val === 10].some(Boolean)
    ? `${styles.block} ${styles.number}`
    : styles.number;

const cellBackgroundColor = (val: number) =>
  [val === 9, val === 10, val === -1].some(Boolean) ? '#4a2' : '#dca';

const viewSelectorList = [-1, 9, 10];

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
  const [selectedPos, setSelectedPos] = useState<Pos>();
  const [displayPlayerPos, setDisplayPlayerPos] = useState<Pos>();
  const [loadedTime, setLoadedTime] = useState<number>();
  useEffect(() => {
    setSelectedPos({ x: player.x, y: player.y });
    if (board[player.y] === undefined || board[player.y][player.x] & CELL_FLAGS['block']) {
      return;
    }
    setDisplayPlayerPos({ x: player.x, y: player.y });
    setLoadedTime(Date.now());
  }, [player.x, player.y, board]);

  if (selectedPos === undefined) {
    return;
  }

  const newBoard = toControllerBoard(board, displayPlayerPos, selectedPos);
  console.table(newBoard);
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
        <div className={styles.infoColumn}>{`[ ${selectedPos.x} , ${selectedPos.y} ]`}</div>
      </div>
      <div
        className={styles.display}
        style={{
          gridTemplate: `repeat(${newBoard.length}, 1fr) / repeat(${newBoard[0].length}, 1fr)`,
        }}
      >
        {newBoard.map((row) =>
          row.map((cellObj) => (
            <div
              className={CELL_STYLE_HANDLER(cellObj.val, CLASS_NAMES)}
              key={`${cellObj.y}-${cellObj.x}`}
              style={
                !IS_BLANK_CELL(cellObj.val)
                  ? {
                      backgroundPositionX: `${7.67 * (NUMBER(cellObj.val) - 1)}%`,
                    }
                  : {}
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameDisplay;
