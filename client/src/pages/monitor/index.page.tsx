import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import type { BoardModel } from '../game/index.page';
import styles from './index.module.css';
const Monitor = () => {
  const [players, setPlayers] = useState<PlayerModel[]>();
  const [focusedPlayer, refocusedPlayer] = useState<PlayerModel>();
  const [board, setBoard] = useState<BoardModel>();

  const fetchMonitor = async () => {
    const resPlayers = await apiClient.player.$get();
    const resGame = await apiClient.game.$get();
    if (resPlayers === null || resGame === null) return;
    const newBoard = minesweeperUtils.makeBoard(resGame.bombMap, resGame.userInputs);
    setBoard(newBoard);
    setPlayers(resPlayers);
  };

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchMonitor();
    }, 2000);
    return () => clearInterval(cancelId);
  }, []);

  if (board === undefined) return <Loading visible />;
  return (
    <div className={styles.container}>
      <div
        className={styles.main}
        style={{
          gridTemplateColumns: `repeat(${board[0].length},1fr)`,
          gridTemplateRows: `repeat(${board.length},1fr)`,
        }}
      >
        {board?.map((row, y) =>
          row.map((val, x) => {
            const thisPlayer = (players ?? []).find((player) => player.x === x && player.y === y);
            return (
              <div
                className={styles.cell}
                style={{ backgroundColor: val === -1 ? '#000' : '#fff' }}
                key={`${y}-${x}`}
              >
                {thisPlayer !== undefined && (
                  <div className={styles.player}>
                    <div className={styles.playerInfo}>
                      <p>id:{thisPlayer.id}</p>
                      <p>name:{thisPlayer.name}</p>
                      <p>score:{thisPlayer.score}</p>
                      <p>{thisPlayer.isLive ? 'alive' : 'dead'}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Monitor;
