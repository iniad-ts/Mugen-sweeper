import { useEffect, useState } from 'react';
import styles from './index.module.css';
// import { apiClient } from 'src/utils/apiClient';
export type pos = {
  x: number;
  y: number;
};

const Game = () => {
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>();
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2)[][]>();
  const [board, setBoard] = useState<number[][]>();
  const [openCells, setOpenCells] = useState<pos[]>([]);
  const [lranking, setRanking] = useState();

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

  return (
    <div className={styles.container}>
      <div className={styles.game} />
      <div className={styles.ranking} />
    </div>
  );
};

export default Game;
