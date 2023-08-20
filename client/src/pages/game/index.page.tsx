import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import { userIdParser } from '../../../../server/service/idParsers';
import styles from './index.module.css';
export type Pos = {
  x: number;
  y: number;
};
export type boardModel = number[][];

const RANKING_COLOR = ['#FFD700', '#C0C0C0', '#C47222'];

const Profile = ({ player, i }: { player: PlayerModel; i: number }) => {
  return useMemo(() => {
    const fontsize = `${(8 - Math.min(i, 3) * 2) * 0.5}em`;
    return (
      <div
        className={styles.prof}
        style={{
          backgroundColor: player.isLive ? '#8f8' : '#f88',
          borderColor: player.isLive ? '#8f8' : '#f88',
        }}
      >
        <div
          className={styles.rank}
          style={{
            color: i < 3 ? RANKING_COLOR[i] : '#000',
            fontSize: fontsize,
          }}
        >
          {i + 1}
        </div>
        <div className={styles.name}>{player.name}</div>
        <div className={styles.score}>{player.score}</div>
      </div>
    );
  }, [player, i]);
};

const Game = () => {
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>();
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2)[][]>();
  const [ranking, setRanking] = useState<PlayerModel[]>();

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
    const res = await apiClient.game.$get();
    const res2 = await apiClient.game.ranking.$get();
    if (res !== null) {
      setUserInputs(res.userInputs);
      setRanking(res2);
    }
  };

  const fetchBombMap = async () => {
    //初回レンダリング時のみ
    //開発時のみここで作成
    const res = await apiClient.game.config.$post({
      body: { width: 200, height: 150, bombRatioPercent: 20 },
    });
    //開発用に一旦playerを作る
    [...Array(10)].forEach((_, i) =>
      apiClient.player.config.post({
        body: {
          userId: userIdParser.parse(`${Math.random()}`),
          name: `frouriochan${i + 1}`,
        },
      })
    );
    if (res !== null) {
      setBombMap(res.bombMap);
    }
  };

  if (bombMap === undefined || userInputs === undefined || ranking === undefined) {
    return <Loading visible />;
  }
  const newBoard = bombMap?.map((row) => row.map(() => -1));

  const startMakeBoard = (x: number, y: number, bombMap: boardModel) =>
    minesweeperUtils
      .makeBoard(x, y, newBoard, bombMap)
      .forEach((row, y) => row.forEach((val, x) => (newBoard[y][x] = val)));

  userInputs.forEach((row, y) =>
    row.forEach((val, x) => {
      if (val === 1) {
        startMakeBoard(x, y, bombMap);
      }
    })
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.game}
        style={{
          gridTemplateColumns: `repeat(${newBoard[0].length},1fr)`,
          gridTemplateRows: `repeat(${newBoard.length},1fr)`,
        }}
      >
        {newBoard.map((row, y) =>
          row.map((value, x) => (
            <div className={value === -1 ? styles.stone : styles.number} key={`${y}-${x}`} />
          ))
        )}
      </div>
      <div className={styles.ranking}>
        {ranking.map((player, i) => (
          <Profile key={i} player={player} i={i} />
        ))}
      </div>
    </div>
  );
};

export default Game;
