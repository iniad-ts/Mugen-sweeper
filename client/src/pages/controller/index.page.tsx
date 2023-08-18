import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import type { Pos, boardModel } from '../game/index.page';
import styles from './index.module.css';

const Controller = () => {
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>();
  const [board, setBoard] = useState<number[][]>();
  const [openCells, setOpenCells] = useState<Pos[]>([]);

  const newBoard: boardModel = JSON.parse(JSON.stringify(board));
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

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchGame();
    }, 2000);
    return () => clearInterval(cancelId);
  }, []);

  useEffect(() => {
    fetchBombMap();
  }, []);

  if (newBoard === undefined || bombMap === undefined) {
    fetchGame();
    return <Loading visible />;
  }
  const openSurroundingCells = (x: number, y: number) => {
    newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);

    newOpenCells.push({ x, y });

    if (newBoard[y][x] === 0) {
      minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
        openSurroundingCells(nextPos.x, nextPos.y);
      });
    }
  };

  const digCell = (x: number, y: number) => {
    openSurroundingCells(x, y);
  };

  setOpenCells(newOpenCells);
  setBoard(newBoard);

  return (
    <div className={styles.controller}>
      <div>{/*＋字キー*/}</div>
      <div>{/*ディスプレイ*/}</div>
      <div>{/*スコップ＋旗*/}</div>
    </div>
  );
};

export default Controller;
