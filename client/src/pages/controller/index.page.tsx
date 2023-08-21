import type { PlayerModel } from 'commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import LoginModal from 'src/components/LoginModal/LoginModal';
import { apiClient } from 'src/utils/apiClient';
import { deepCopy } from 'src/utils/deepCopy';
import { minMax } from 'src/utils/minMax';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import { userIdParser } from '../../../../server/service/idParsers';
import type { BoardModel } from '../game/index.page';
import styles from './index.module.css';

type ActionModel = 'left' | 'right' | 'up' | 'down';

const dir: ActionModel[] = ['up', 'down', 'left', 'right'];

type OpenCellModel = { x: number; y: number; isUserInput: boolean; value: number };

const arrows = [
  styles['cross-layout-position-top'],
  styles['cross-layout-position-bottom'],
  styles['cross-layout-position-left'],
  styles['cross-layout-position-right'],
];
const arrowTexts = ['▲', '▼', '◀', '▶'];

const Button = ({
  className,
  text,
  onClick,
}: {
  className: string;
  text: string;
  onClick: () => void;
}) => (
  <button className={`${className} ${styles.button} `} onClick={onClick}>
    {text}
  </button>
);

const Controller = () => {
  const router = useRouter();
  const playerId = typeof router.query.playerId === 'string' ? router.query.playerId : null;

  if (playerId === null) {
    return <LoginModal />;
  }

  const GameController = () => {
    const [bombMap, setBombMap] = useState<BoardModel>();
    const [board, setBoard] = useState<BoardModel>();
    const [openCells, setOpenCells] = useState<OpenCellModel[]>([]);
    const [players, setPlayers] = useState<PlayerModel[]>();

    const fetchGame = useCallback(async () => {
      if (openCells.length !== 0) {
        const jsonCells = openCells.map((cell) => JSON.stringify(cell));
        const jsonPostCells = Array.from(new Set(jsonCells));
        const postCells = jsonPostCells
          .map((cell) => JSON.parse(cell))
          .map((cell) => ({
            x: cell.x,
            y: cell.y,
            whoOpened: userIdParser.parse(playerId),
            whenOpened: new Date().getTime(),
            isUserInput: cell.isUserInput,
            cellValue: cell.value,
          }));
        await apiClient.game.$post({ body: postCells });
        setOpenCells([]);
      }
      const res = await apiClient.game.$get();
      const res2 = await apiClient.player.$get();
      if (res === null || res2 === null) return;
      const newBoard = minesweeperUtils.makeBoard(res.bombMap, res.userInputs);
      setBoard(newBoard);
      setPlayers(res2);
    }, [openCells]);
    // 初回レンダリング時のみ;
    const fetchBombMap = async () => {
      //開発時のみここで作成
      const res1 = await apiClient.game.config.$post({
        body: { width: 10, height: 10, bombRatioPercent: 10 },
      });
      if (res1 !== null) {
        setBombMap(res1.bombMap);
      }
    };

    useEffect(() => {
      const cancelId = setInterval(() => {
        fetchGame();
      }, 2000);
      return () => clearInterval(cancelId);
    }, [fetchGame]);
    useEffect(() => {
      fetchBombMap();
    }, []);

    const player = players?.find((player) => player.id === playerId);
    if (player === undefined || board === undefined || bombMap === undefined) {
      return <Loading visible />;
    }

    const digCell = () => {
      const [x, y] = [player.x, player.y];
      if (board[y][x] !== -1) return;
      console.log('a');
      const newBoard = deepCopy<BoardModel>(board);
      const newOpenCells = deepCopy<OpenCellModel[]>(openCells);
      const openSurroundingCells = (x: number, y: number, isUserInput: boolean) => {
        newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);
        newOpenCells.push({ x, y, isUserInput, value: newBoard[y][x] });
        if (newBoard[y][x] === 0) {
          minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
            openSurroundingCells(nextPos.x, nextPos.y, false);
          });
        }
      };
      openSurroundingCells(x, y, true);
      setOpenCells(newOpenCells);
      setBoard(newBoard);
    };

    const move = async (moveX: number, moveY: number) => {
      const newPlayer = {
        ...player,
        x: minMax(player.x + moveX, bombMap[0].length),
        y: minMax(player.y + moveY, bombMap.length),
      };
      const res = await apiClient.player.$post({ body: newPlayer });
      const newPlayers = deepCopy(players);
      if (res === null) return;
      (newPlayers ?? [])[
        Math.max(
          0,
          (newPlayers ?? []).findIndex((onePlayer) => onePlayer.id === playerId)
        )
      ] = res;
      setPlayers(newPlayers);
    };

    const frag = () => {
      const [x, y] = [player.x, player.y];
      const newBoard = deepCopy<BoardModel>(board);
      newBoard[y][x] = 9;
      setBoard(newBoard);
    };

    const handleMove = (action: ActionModel) => {
      if (action === 'left') {
        move(-1, 0);
        return;
      }
      if (action === 'right') {
        move(1, 0);
        return;
      }
      if (action === 'down') {
        move(0, 1);
        return;
      }
      if (action === 'up') {
        move(0, -1);
        return;
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.controller}>
          <div className={styles['button-container']} style={{ gridArea: 'cross' }}>
            {arrows.map((arrow, i) => (
              <Button
                className={arrow}
                text={arrowTexts[i]}
                key={i}
                onClick={() => handleMove(dir[i])}
              />
            ))}
          </div>
          <div className={styles.display}>
            {player.x}/{player.y}
          </div>
          <div
            className={styles['button-container']}
            style={{ gridArea: 'button', margin: '0 0 0 auto' }}
          >
            <Button className={styles['flag-button']} text="🚩" onClick={() => frag()} />
            <Button className={styles['open-button']} text="⛏️" onClick={() => digCell()} />
          </div>
        </div>
      </div>
    );
  };
  return <GameController />;
};

export default Controller;
