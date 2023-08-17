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

  const fetchGame = async () => {
    // await apiClient.game.post(openCells)
    // const res = await apiClient.game.get()
    // if (res !== null) {
    //   if (bombMap === null) setBombMap(res.bombMap);
    //   setUserInputs(res.userInputs)
    // }
  };

  const fetchBombMap = async () => {
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

  return <div className={styles.container}>{/*コンテンツ*/}</div>;
};

export default Game;
