import type { CellModel, PlayerModel } from 'commonTypesWithClient/models';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { deepCopy } from 'src/utils/deepCopy';
import { RedirectToLogin, getUserIdFromLocalStorage } from 'src/utils/loginWithLocalStorage';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import type { BoardModel } from '../game/index.page';
import styles from './index.module.css';

type ActionModel = 'left' | 'right' | 'up' | 'down';

//TODO complexity下げる
const Controller = () => {
  const [bombMap, setBombMap] = useState<BoardModel>();
  const [board, setBoard] = useState<BoardModel>();
  const [openCells, setOpenCells] = useState<CellModel[]>([]);
  const [playerId] = useState(getUserIdFromLocalStorage);
  const [players, setPlayers] = useState<PlayerModel[]>();

  const fetchGame = useCallback(async () => {
    if (openCells.length !== 0) await apiClient.game.$post({ body: openCells });
    const res = await apiClient.game.$get();
    const res2 = await apiClient.player.$get();
    if (res === null || res2 === null) return;
    const newBoard = minesweeperUtils.makeBoard(res.bombMap, res.userInputs);
    setBoard(newBoard);
    setPlayers(res2);
  }, [openCells]);

  // 初回レンダリング時のみ;
  const fetchBombMap = async () => {
    //開発時のみここで作成
    const res1 = await apiClient.game.config.$post({
      body: { width: 10, height: 10, bombRatioPercent: 10 },
    });
    if (res1 !== null) {
      setBombMap(res1.bombMap);
    }
  };

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchGame();
    }, 2000);
    return () => clearInterval(cancelId);
  }, [fetchGame]);

  useEffect(() => {
    fetchBombMap();
  }, []);

  if (playerId === null) {
    RedirectToLogin();
    return;
  }
  const player = players?.find((player) => player.id === playerId);
  if (player === undefined) return <>did not login</>;
  if (board === undefined || bombMap === undefined) {
    return <Loading visible />;
  }

  const digCell = (x: number, y: number) => {
    const newBoard = deepCopy<BoardModel>(board);
    const newOpenCells = deepCopy<CellModel[]>(openCells);
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
    openSurroundingCells(x, y, true);
    setOpenCells(newOpenCells);
    setBoard(newBoard);
  };

  const move = async (moveX: number, moveY: number) => {
    const newPlayer = { ...player, x: player.x + moveX, y: player.y + moveY };
    const res = await apiClient.player.$post({ body: newPlayer });
    const newPlayers = deepCopy(players);
    (newPlayers ?? [])[
      Math.max(
        0,
        (newPlayers ?? []).findIndex((onePlayer) => onePlayer.id === playerId)
      )
    ] = res;
    setPlayers(newPlayers);
  };

  const frag = (x: number, y: number) => {
    const newBoard = deepCopy<BoardModel>(board);
    newBoard[y][x] = 9;
    setBoard(newBoard);
  };

  const handleAction = (action: ActionModel) => {
    if (action === 'left') {
      move(-1, 0);
      return;
    }
    if (action === 'right') {
      move(1, 0);
      return;
    }
    if (action === 'down') {
      move(0, 1);
      return;
    }
    if (action === 'up') {
      move(0, -1);
      return;
    }
  };

  
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
