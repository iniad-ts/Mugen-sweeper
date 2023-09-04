import type { CellModel, PlayerModel } from 'commonTypesWithClient/models';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import type { BoardModel } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { TYPE_IS } from 'src/utils/flag';
import { hslToHex } from 'src/utils/hueToRGB';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';

type ColorList = Record<string, string>;

const colorList = (players: (PlayerModel | null)[]) => {
  const length = players.length;
  const list = players.map((player, i): ColorList => {
    if (player === null)
      return {
        ['hoge']: hslToHex((360 / length) * i, 0.5, 0.5),
      };
    return {
      [player.id]: hslToHex((360 / length) * i, 0.5, 0.5),
    };
  });
  return list;
};

const returnValue = (array: ColorList[], key: string) => {
  const foundItem = array.find((item) => key in item);
  return foundItem ? foundItem[key] : '#000';
};

const viewWhoDigged = (
  cells: (CellModel | null)[],
  board: BoardModel,
  players: (PlayerModel | null)[]
) => {
  const newBoard = board.map((row) => row.map(() => '#000000'));
  cells.forEach(
    (cell) => cell && (newBoard[cell.y][cell.x] = returnValue(colorList(players), cell.whoOpened))
  );
  return newBoard;
};

const PlayerInfo = ({
  thisPlayer,
  isView,
  players,
}: {
  thisPlayer: PlayerModel | undefined | null;
  isView: boolean;
  players: (PlayerModel | null)[];
}) =>
  thisPlayer && (
    <div
      className={styles.player}
      style={{
        borderColor: thisPlayer.isAlive ? '#0ff8' : '#f008',
        backgroundColor: returnValue(colorList(players), thisPlayer.id),
      }}
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
          <p>{thisPlayer.isAlive ? 'alive' : 'dead'}</p>
        </div>
      )}
    </div>
  );

const InfoCell = ({
  thisPlayer,
  onClick,
  val,
  isView,
  players,
}: {
  thisPlayer: PlayerModel | undefined | null;
  onClick: (value: PlayerModel | undefined | null) => void;
  val: number | string;
  isView: boolean;
  players: (PlayerModel | null)[];
}) => (
  <div
    className={styles.cell}
    style={{
      backgroundColor:
        typeof val === 'string' ? `${val}88` : TYPE_IS('block', val) ? '#000' : '#fff',
    }}
    onClick={() => onClick(thisPlayer)}
  >
    <PlayerInfo thisPlayer={thisPlayer} isView={isView} players={players} />
  </div>
);

const Monitor = () => {
  const [players, setPlayers] = useState<(PlayerModel | null)[]>([]);
  const [focusedPlayer, setFocusedPlayer] = useState<PlayerModel | null>();
  const [board, setBoard] = useState<BoardModel | null>();
  const [isViewName, setIsViewName] = useState(false);
  const [isViewWhoDigged, setIsViewWhoDigged] = useState(false);
  const [isViewWhoDiggedBoard, setIsViewWhoDiggedBoard] = useState<string[][]>();

  const fetchMonitor = useCallback(async () => {
    const resPlayers = await apiClient.player.$get();
    const resGame = await apiClient.game.$get();
    if (resGame === null) return;
    const newBoard = minesweeperUtils.makeBoard(resGame.bombMap, resGame.userInputs, board);
    const newFocusedPlayer = resPlayers.find((player) => player.id === focusedPlayer?.id);
    setBoard(newBoard);
    setPlayers(resPlayers);
    setFocusedPlayer(newFocusedPlayer);
    if (isViewWhoDigged) {
      const resCells = await apiClient.cell.$get();
      const newIsViewWhoDigged = viewWhoDigged(resCells, newBoard, resPlayers);
      setIsViewWhoDiggedBoard(newIsViewWhoDigged);
    }
  }, [focusedPlayer, isViewWhoDigged, board]);

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchMonitor();
    }, 2000);
    return () => clearInterval(cancelId);
  }, [fetchMonitor]);

  const handleDelete = async () => {
    if (focusedPlayer === undefined) return;
    if (confirm('Are You Sure You Want To Ban This Player?')) {
      focusedPlayer && (await apiClient.player.delete({ body: focusedPlayer }));
    }
  };
  if (board === undefined) return <Loading visible />;
  return (
    <div className={styles.container}>
      <div className={styles.focusInfo}>
        <div className={styles.focusInfoRow}>{focusedPlayer?.id}</div>
        <div className={styles.focusInfoRow}>{focusedPlayer?.name}</div>
        <div className={styles.focusInfoRow}>{focusedPlayer?.score}</div>
        <div className={styles.focusInfoRow}>
          {focusedPlayer?.isAlive === true ? 'alive' : focusedPlayer?.isAlive === false && 'dead'}
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
        <button
          className={styles.button}
          style={{ backgroundColor: '#44c' }}
          onClick={() => {
            console.table(isViewWhoDiggedBoard);
            setIsViewWhoDigged(!isViewWhoDigged);
          }}
        >
          view cells
        </button>
      </div>
      (
      <div
        className={styles.main}
        style={{
          gridTemplateColumns: `repeat(${board?.map((row) => row.length)[0]},1fr)`,
          gridTemplateRows: `repeat(${board?.length},1fr)`,
        }}
      >
        {(isViewWhoDigged ? isViewWhoDiggedBoard : board)?.map((row, y) =>
          row.map((val, x) => {
            const thisPlayer = players.find((player) => player?.x === x && player?.y === y);
            return (
              <InfoCell
                thisPlayer={thisPlayer}
                onClick={setFocusedPlayer}
                val={val}
                isView={isViewName}
                players={players}
                key={`${y}-${x}`}
              />
            );
          })
        )}
      </div>
      )
    </div>
  );
};

export default Monitor;
