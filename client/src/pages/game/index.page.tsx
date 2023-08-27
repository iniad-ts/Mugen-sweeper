import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import Webcam from 'react-webcam';
import { Loading } from 'src/components/Loading/Loading';
import { staticPath } from 'src/utils/$path';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import { numbers } from 'src/utils/nums';
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

const Number = ({ value }: { value: number }) => {
  const board =
    value === 0
      ? [...Array(5)].map((_, j) => [...Array(5)].map((_, i) => (j + i) % 2))
      : numbers[value - 1];
  return (
    <div className={styles.numberMain}>
      <div className={styles.border} style={{ gridArea: 't' }} />
      <div className={styles.border} style={{ gridArea: 'l' }} />
      {board.map((row, y) =>
        row.map((num, x) => (
          <div
            className={styles.number}
            key={`${y}-${x}`}
            style={{ backgroundColor: num === 0 ? '#0000' : '#000' }}
          />
        ))
      )}
      <div className={styles.border} style={{ gridArea: 'r' }} />
      <div className={styles.border} style={{ gridArea: 'u' }} />
    </div>
  );
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
          backgroundColor: player.isAlive ? '#8f8' : '#f88',
          borderColor: player.isAlive ? '#8f8' : '#f88',
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
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>(); //TODO bombMapの必要性をかんがえる
  const [ranking, setRanking] = useState<(PlayerModel | null)[]>();
  const [userInputs, setUserInputs] = useState<(0 | 1)[][]>();

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

    if (res !== null) {
      setBombMap(res.bombMap);
    }
  };

  if (bombMap === undefined || userInputs === undefined || ranking === undefined) {
    return <Loading visible />;
  }
  const board = minesweeperUtils.makeBoard(
    bombMap,
    userInputs,
    bombMap.map((row) => row.map(() => -1))
  );

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Webcam width={1430} style={{ transform: 'scaleX(-1)' }} />
        <div
          className={styles.game}
          style={{
            gridTemplateColumns: `repeat(${board[0].length},1fr)`,
            gridTemplateRows: `repeat(${board.length},1fr)`,
          }}
        >
          {board.map((row, y) =>
            row.map((value, x) =>
              [value < 0, value > 8].some(Boolean) ? (
                <div className={styles.stone} key={`${y}-${x}`} />
              ) : (
                <Number value={value} key={`${y}-${x}`} />
              )
            )
          )}
        </div>
      </div>
      <div className={styles.ranking}>
        {ranking.map(
          (player, index) =>
            player && <ProfileBoard key={player.id} player={player} index={index} />
        )}
      </div>
    </div>
  );
};

export default Game;
