import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';

export type Pos = {
  x: number;
  y: number;
};
export type BoardModel = number[][];

const MEDAL_IMAGES = ['/images/rank1.png', '/images/rank2.png', '/images/rank3.png'];

// スコアに基づいて色を返す関数
const getScoreColor = (score: number): string => {
  if (score >= 100) {
    return '#ff026b';
  } else if (score >= 50) {
    return '#0400ff';
  } else {
    return '#f88';
  }
};

const ProfileBoard = ({ player, i }: { player: PlayerModel; i: number }) => {
  return useMemo(() => {
    const baseSize = 35;
    const imageSize = baseSize * (8 - Math.min(i, 3) * 2) * 0.3;
    const scoreColor = getScoreColor(player.score);
    const rankTextFontSize = i >= 3 ? '1.5em' : '1em';
    return (
      <div
        className={styles.prof}
        style={{
          backgroundColor: player.isLive ? '#8f8' : '#f88',
          borderColor: player.isLive ? '#8f8' : '#f88',
        }}
      >
        <div className={styles.rank}>
          {i < 3 ? (
            <img
              src={MEDAL_IMAGES[i]}
              alt={`Rank ${i + 1} Medal`}
              className={styles.rankImage}
              style={{
                width: `${imageSize}px`,
                height: `${imageSize}px`,
              }}
            />
          ) : (
            <span style={{ fontSize: rankTextFontSize }}>{i + 1}</span>
          )}
        </div>
        <div className={styles.name}>{player.name}</div>
        <div className={styles.score} style={{ color: scoreColor }}>
          {player.score}
        </div>
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

  //初回レンダリング時のみ
  const fetchBombMap = async () => {
    //開発時のみここで作成
    const res = await apiClient.game.config.$post({
      body: { width: 10, height: 10, bombRatioPercent: 10 },
    });
    //開発用に一旦playerを作る
    // [...Array(10)].forEach((_, i) =>
    //   apiClient.player.config.post({
    //     body: {
    //       userId: userIdParser.parse(`${Math.random()}`),
    //       name: `frouriochan${i + 1}`,
    //     },
    //   })
    // );
    if (res !== null) {
      setBombMap(res.bombMap);
    }
  };

  if (bombMap === undefined || userInputs === undefined || ranking === undefined) {
    return <Loading visible />;
  }
  const board = minesweeperUtils.makeBoard(bombMap, userInputs);

  return (
    <div className={styles.container}>
      <div
        className={styles.game}
        style={{
          gridTemplateColumns: `repeat(${board[0].length},1fr)`,
          gridTemplateRows: `repeat(${board.length},1fr)`,
        }}
      >
        {board.map((row, y) =>
          row.map((value, x) => (
            <div className={value === -1 ? styles.stone : styles.number} key={`${y}-${x}`}>
              {value}
            </div>
          ))
        )}
      </div>
      <div className={styles.ranking}>
        {ranking.map((player, i) => (
          <ProfileBoard key={player.id} player={player} i={i} />
        ))}
      </div>
    </div>
  );
};

export default Game;
