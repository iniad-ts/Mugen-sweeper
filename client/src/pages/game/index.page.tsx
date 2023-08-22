import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { staticPath } from 'src/utils/$path';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';


const MEDAL_IMAGES = [
  staticPath.images.rank1_png,
  staticPath.images.rank2_png,
  staticPath.images.rank3_png,
];

// スコアに基づいて色を返す関数
const getScoreColor = (score: number): string => {
  return score >= 100 ? '#ff026b' : score >= 50 ? '#0400ff' : '#f88';
};

const ProfileBoard = ({ player, index }: { player: PlayerModel; index: number }) => {
  return useMemo(() => {
    const baseSize = 35;
    const imageSize = baseSize * (8 - Math.min(index, 3) * 2) * 0.3;
    const scoreColor = getScoreColor(player.score);
    const rankTextFontSize = index >= 3 ? '1.5em' : '1em';
    return (
      <div
        className={styles.prof}
        style={{
          backgroundColor: player.isLive ? '#8f8' : '#f88',
          borderColor: player.isLive ? '#8f8' : '#f88',
        }}
      >
        <div className={styles.rank}>
          {index < 3 ? (
            <img
              src={MEDAL_IMAGES[index]}
              alt={`Rank ${index + 1} Medal`}
              className={styles.rankImage}
              style={{
                width: `${imageSize}px`,
                height: `${imageSize}px`,
              }}
            />
          ) : (
            <span style={{ fontSize: rankTextFontSize }}>{index + 1}</span>
          )}
        </div>
        <div className={styles.name}>{player.name}</div>
        <div className={styles.score} style={{ color: scoreColor }}>
          {player.score}
        </div>
      </div>
    );
  }, [player, index]);
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
        {ranking.map((player, index) => (
          <ProfileBoard key={player.id} player={player} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Game;
