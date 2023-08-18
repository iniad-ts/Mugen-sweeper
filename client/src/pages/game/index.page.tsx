import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import styles from './index.module.css';
// import { apiClient } from 'src/utils/apiClient';
export type Pos = {
  x: number;
  y: number;
};
export type boardMOdel = number[][];

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
  const recursion = (x: number, y: number) => {
    newBoard[y][x] =
      bombMap
        .slice(Math.max(0, y - 1), Math.min(y + 2, bombMap.length))
        .map((row) => row.slice(Math.max(0, x - 1), Math.min(x + 2, row.length)))
        .flat()
        .filter((b) => b === 1).length ?? 1 - 1;

    if (newBoard[y][x] === 0) {
      directions
        .map((direction) => ({ x: x + direction[0], y: y + direction[1] }))
        .filter((nextPos) => newBoard[nextPos.y][nextPos.x] === -1)
        .forEach((nextPos) => {
          recursion(nextPos.x, nextPos.y);
        });
    }
  };

  userInputs.forEach((row, y) => row.forEach((_, x) => recursion(x, y)));

  return (
    <div className={styles.container}>
      <div className={styles.game} />
      <div className={styles.ranking} />
    </div>
  );
};

export default Game;
