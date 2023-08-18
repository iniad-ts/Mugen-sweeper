import { useEffect, useState } from 'react';
import type { Pos, boardMOdel } from '../game/index.page';
import styles from './index.module.css';

const directions = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

const Controller = () => {
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>();
  const [board, setBoard] = useState<number[][]>();
  const [openCells, setOpenCells] = useState<Pos[]>([]);

  const newBoard: boardMOdel = JSON.parse(JSON.stringify(board));
  const newOpenCells: Pos[] = JSON.parse(JSON.stringify(openCells));

  const fetchGame = async () => {
    // await apiClient.game.post(openCells)
    // const res = await apiClient.game.get()
    // if (res !== null) {
    //   setUserInputs(res.userInputs)
    //   setRanking(res.ranking)
    // }
  };

  const fetchBombMap = async () => {
    //初回レンダリング時のみ
    // const res = await apiClient.game.start.g$et();
    // if (res === null) fetchBombMap();
    // setBombMap(res);
  };

  const recursion = (x: number, y: number) => {
    newBoard[y][x] =
      bombMap
        ?.slice(Math.max(0, y - 1), Math.min(y + 2, bombMap.length))
        .map((row) => row.slice(Math.max(0, x - 1), Math.min(x + 2, row.length)))
        .flat()
        .filter((b) => b === 1).length ?? 1 - 1;

    newOpenCells.push({ x, y });

    if (newBoard[y][x] === 0) {
      directions
        .map((direction) => ({ x: x + direction[0], y: y + direction[1] }))
        .filter((nextPos) => newBoard[nextPos.y][nextPos.x] === -1)
        .forEach((nextPos) => {
          recursion(nextPos.x, nextPos.y);
        });
    }
  };

  setOpenCells(newOpenCells);
  setBoard(newBoard);

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchGame();
    }, 2000);
    return () => clearInterval(cancelId);
  }, []);

  useEffect(() => {
    fetchBombMap();
  }, []);

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
