import type { CellModel } from 'commonTypesWithClient/models';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { getUserIdFromLocalStorage } from 'src/utils/loginWithLocalStorage';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import type { boardModel } from '../game/index.page';
import styles from './index.module.css';

const Controller = () => {
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>();
  const [board, setBoard] = useState<number[][]>();
  const [userInputs, setUserInputs] = useState<number[][]>();
  const [openCells, setOpenCells] = useState<CellModel[]>([]);
  const [playerId] = useState(getUserIdFromLocalStorage);

  const fetchGame = useCallback(() => {
    async () => {
      const res = await apiClient.game.$get();
      await apiClient.game.$post({ body: openCells });
      if (res !== null) {
        setUserInputs(res.userInputs);
      }
    };
  }, [openCells]);

  const fetchBombMap = useCallback(() => {
    async () => {
      // 初回レンダリング時のみ;
      const res = await apiClient.game.config.$post({
        body: { width: 10, height: 10, bombRatioPercent: 10 },
      });
      console.log(res);
      if (res === null) {
        fetchBombMap();
      } else {
        setBombMap(res.bombMap);
      }
    };
  }, []);

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchGame();
    }, 2000);
    return () => clearInterval(cancelId);
  }, [fetchGame]);

  useEffect(() => {
    fetchBombMap();
  }, [fetchBombMap]);

  if (playerId === null) {
    //リダイレクト処理
    return;
  }

  console.log(playerId);

  if (board === undefined || bombMap === undefined) {
    fetchGame();
    console.log('a');
    return <Loading visible />;
  }

  const newBoard: boardModel = JSON.parse(JSON.stringify(board));
  const newOpenCells: CellModel[] = JSON.parse(JSON.stringify(openCells));

  const openSurroundingCells = (x: number, y: number, isUserInput: boolean) => {
    newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);

    newOpenCells.push({
      x,
      y,
      whoOpened: playerId,
      whenOpened: new Date().getTime(),
      isUserInput,
      cellValue: newBoard[y][x],
    });

    if (newBoard[y][x] === 0) {
      minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
        openSurroundingCells(nextPos.x, nextPos.y, false);
      });
    }
  };

  const digCell = (x: number, y: number) => {
    openSurroundingCells(x, y, true);
  };

  setOpenCells(newOpenCells);
  setBoard(newBoard);

  return (
    <div className={styles.controller}>
      <div className={styles['cross-container']}>
        <div className={styles['cross-layout']}>
          <button className={styles['cross-layout-position-top']}>▲</button>
          <button className={styles['cross-layout-position-bottom']}>▼</button>
          <button className={styles['cross-layout-position-left']}>◀</button>
          <button className={styles['cross-layout-position-right']}>▶</button>
        </div>
      </div>
      <div>{/*ディスプレイ*/}</div>
      <div className={styles['button-layout']}>
        <button className={styles['flag-button']}>🚩</button>
        <button className={styles['open-button']}>open</button>
      </div>
    </div>
  );
};

export default Controller;
