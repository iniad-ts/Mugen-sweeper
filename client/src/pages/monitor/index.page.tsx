import type { PlayerModel } from 'commonTypesWithClient/models';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import type { BoardModel } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';

const PlayerInfo = ({
  thisPlayer,

  isView,
}: {
  thisPlayer: PlayerModel | undefined;

  isView: boolean;
}) =>
  thisPlayer !== undefined && (
    <div
      className={styles.player}
      style={{ backgroundColor: thisPlayer.isLive ? '0ff8' : '#f008' }}
    >
      {isView ? (
        <div className={styles.nameInfo}>
          <p style={{ zIndex: 99998 }}>{thisPlayer.name}</p>
        </div>
      ) : (
        <div className={styles.playerInfo}>
          <p>id:{thisPlayer.id}</p>
          <p>name:{thisPlayer.name}</p>
          <p>score:{thisPlayer.score}</p>
          <p>{thisPlayer.isLive ? 'alive' : 'dead'}</p>
        </div>
      )}
    </div>
  );
const InfoCell = ({
  thisPlayer,
  onClick,
  val,
  isView,
}: {
  thisPlayer: PlayerModel | undefined;
  onClick: (value: PlayerModel | undefined) => void;
  val: number;
  isView: boolean;
}) => (
  <div
    className={styles.cell}
    style={{ backgroundColor: val === -1 ? '#000' : '#fff' }}
    onClick={() => onClick(thisPlayer)}
  >
    <PlayerInfo thisPlayer={thisPlayer} isView={isView} />
  </div>
);

const Monitor = () => {
  const [players, setPlayers] = useState<PlayerModel[]>([]);
  const [focusedPlayer, setFocusedPlayer] = useState<PlayerModel>();
  const [board, setBoard] = useState<BoardModel>();
  const [isViewName, setIsViewName] = useState(false);

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

  const handleDelete = async () => {
    if (focusedPlayer === undefined) return;
    if (confirm('Are You Sure You Want To Ban This Player?')) {
      await apiClient.player.delete({ body: focusedPlayer });
    }
  };

  if (board === undefined) return <Loading visible />;
  return (
    <div className={styles.container}>
      <div className={styles['focus-info']}>
        <div className={styles['focus-info-row']}>{focusedPlayer?.id}</div>
        <div className={styles['focus-info-row']}>{focusedPlayer?.name}</div>
        <div className={styles['focus-info-row']}>{focusedPlayer?.score}</div>
        <div className={styles['focus-info-row']}>
          {focusedPlayer?.isLive === true ? 'alive' : focusedPlayer?.isLive === false && 'dead'}
        </div>
        <button className={styles.button} onClick={handleDelete}>
          delete
        </button>
        <button
          className={styles.button}
          style={{ backgroundColor: '#4c4' }}
          onClick={() => setIsViewName(!isViewName)}
        >
          view names
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
                isView={isViewName}
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
