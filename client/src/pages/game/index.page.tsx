import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';
// import { apiClient } from 'src/utils/apiClient';
export type Pos = {
  x: number;
  y: number;
};
export type boardModel = number[][];

const Game = () => {
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>();
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2)[][]>();
  const [ranking, setRanking] = useState();

  const newBoard = bombMap?.map((row) => row.map(() => -1));

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchGame();
    }, 2000);
    return () => clearInterval(cancelId);
  }, []);

  useEffect(() => {
    fetchBombMap();
  }, []);

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

  if (newBoard === undefined || bombMap === undefined || userInputs === undefined) {
    fetchGame();
    return <Loading visible />;
  }
  const openSurroundingCells = (x: number, y: number) => {
    newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);

    if (newBoard[y][x] === 0) {
      minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
        openSurroundingCells(nextPos.x, nextPos.y);
      });
    }
  };

  userInputs.forEach((row, y) => row.forEach((_, x) => openSurroundingCells(x, y)));

  return (
    <div className={styles.container}>
      <div className={styles.game} />
      <div className={styles.ranking} />
    </div>
  );
};

export default Game;
