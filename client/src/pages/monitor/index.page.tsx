import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import type { BoardModel } from '../game/index.page';
import styles from './index.module.css';

const InfoCell = ({
  thisPlayer,
  onClick,
  val,
}: {
  thisPlayer: PlayerModel | undefined;
  onClick: (value: PlayerModel | undefined) => void;
  val: number;
}) => (
  <div
    className={styles.cell}
    style={{ backgroundColor: val === -1 ? '#000' : '#fff' }}
    onClick={() => onClick(thisPlayer)}
  >
    {thisPlayer !== undefined && (
      <div
        className={styles.player}
        style={{ backgroundColor: thisPlayer.isLive ? '0ff8' : '#f008' }}
      >
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

const Monitor = () => {
  const [players, setPlayers] = useState<PlayerModel[]>([]);
  const [focusedPlayer, setFocusedPlayer] = useState<PlayerModel>();
  const [board, setBoard] = useState<BoardModel>();

  const fetchMonitor = async () => {
    const resPlayers = await apiClient.player.$get();
    const resGame = await apiClient.game.$get();
    if (resGame === null) return;
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
      <div className={styles['focus-info']}>
        <div className={styles['focus-info-row']}>{focusedPlayer?.id}</div>
        <div className={styles['focus-info-row']}>{focusedPlayer?.name}</div>
        <div className={styles['focus-info-row']}>{focusedPlayer?.score}</div>
        <div className={styles['focus-info-row']}>{focusedPlayer?.isLive}</div>
        <button
          className={styles.button}
          onClick={async () =>
            confirm('Are You Sure You Want To Ban This Player?') &&
            focusedPlayer !== undefined &&
            (await apiClient.player.delete({ body: focusedPlayer }))
          }
        >
          delete
        </button>
      </div>
      <div
        className={styles.main}
        style={{
          gridTemplateColumns: `repeat(${board[0].length},1fr)`,
          gridTemplateRows: `repeat(${board.length},1fr)`,
        }}
      >
        {board?.map((row, y) =>
          row.map((val, x) => {
            const thisPlayer = players.find((player) => player.x === x && player.y === y);
            return (
              <InfoCell
                thisPlayer={thisPlayer}
                onClick={setFocusedPlayer}
                val={val}
                key={`${y}-${x}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Monitor;
