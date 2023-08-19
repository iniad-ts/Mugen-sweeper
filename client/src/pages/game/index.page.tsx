import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useMemo, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { userIdParser } from '../../../../server/service/idParsers';
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

const fontsize = (n: number) => `${(8 - Math.min(n, 3) * 2) * 0.5}em`;

const RANKING_COLOR = ['#FFD700', '#C0C0C0', '#C47222'];

const Profile = ({ player, i }: { player: PlayerModel; i: number }) => {
  return useMemo(() => {
    const fontsize = `${(8 - Math.min(i, 3) * 2) * 0.5}em`;
    return (
      <div className={styles.prof} style={{ backgroundColor: player.isLive ? '#8f8' : '#f88' }}>
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
  const [bombMap, setBombMap] = useState<(0 | 1)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  ]);
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [ranking, setRanking] = useState<PlayerModel[]>([
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 10000000, isLive: true },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 1000000, isLive: false },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 10000, isLive: true },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 1000, isLive: false },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 100, isLive: false },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 100, isLive: true },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 100, isLive: true },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 100, isLive: true },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 100, isLive: true },
    { id: userIdParser.parse('a'), name: 'frouriochan', x: 0, y: 0, score: 100, isLive: true },
  ]);
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

  if (
    newBoard === undefined ||
    bombMap === undefined ||
    userInputs === undefined ||
    ranking === undefined
  ) {
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
        .filter(
          (nextPos) => newBoard[nextPos.y] !== undefined && newBoard[nextPos.y][nextPos.x] === -1
        )
        .forEach((nextPos) => {
          recursion(nextPos.x, nextPos.y);
        });
    }
  };
  console.table(newBoard);

  userInputs.forEach((row, y) => row.forEach((val, x) => val === 1 && recursion(x, y)));

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
