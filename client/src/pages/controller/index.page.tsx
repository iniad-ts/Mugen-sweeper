import type { PlayerModel } from 'commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { ArrowButton } from 'src/components/Button/index.page';
import GameDisplay from 'src/components/GameDisplay/GameDisplay';
import { Loading } from 'src/components/Loading/Loading';
import LoginModal from 'src/components/LoginModal/LoginModal';
import type { ActionModel, BoardModel, OpenCellModel } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { deepCopy } from 'src/utils/deepCopy';
import { formatOpenCells } from 'src/utils/formatOpenCells';
import { minMax } from 'src/utils/minMax';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';

const arrowStyles = [
  { rowStart: 1, rowEnd: 3, columnStart: 3, columnEnd: 5 },
  { rowStart: 5, rowEnd: 7, columnStart: 3, columnEnd: 5 },
  { rowStart: 3, rowEnd: 5, columnStart: 1, columnEnd: 3 },
  { rowStart: 3, rowEnd: 5, columnStart: 5, columnEnd: 7 },
];

const arrowTexts = ['▲', '▼', '◀', '▶'];

const dir: ActionModel[] = ['up', 'down', 'left', 'right'];

const Controller = () => {
  const router = useRouter();
  const playerIdStr = typeof router.query.playerId === 'string' ? router.query.playerId : null;

  if (playerIdStr === null) {
    return <LoginModal />;
  }

  const GameController = () => {
    const [bombMap, setBombMap] = useState<BoardModel>();
    const [board, setBoard] = useState<BoardModel>();
    const [openCells, setOpenCells] = useState<OpenCellModel[]>([]);
    const [player, setPlayer] = useState<PlayerModel>();

    const fetchGame = useCallback(async () => {
      if (player === undefined) return;
      if (openCells.length !== 0) {
        const postCells = formatOpenCells(openCells, player.id);
        await apiClient.game.$post({ body: postCells });
        setOpenCells([]);
      }
      const res = await apiClient.game.$get();
      const res2 = await apiClient.player.config.$post({ body: { playerId: playerIdStr } });

      if (res === null || res2 === null) return;
      const newBoard = minesweeperUtils.makeBoard(res.bombMap, res.userInputs);
      setBoard(newBoard);
      setPlayer(res2);
    }, [openCells, player]);

    // 初回レンダリング時のみ;
    const fetchBombMap = async () => {
      //開発時のみここで作成
      const res1 = await apiClient.game.config.$post({
        body: { width: 10, height: 10, bombRatioPercent: 10 },
      });
      const res2 = await apiClient.player.config.$post({ body: { playerId: playerIdStr } });
      if (res1 !== null && res2 !== null) {
        setBombMap(res1.bombMap);
        setPlayer(res2);
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

    if (player === undefined || board === undefined || bombMap === undefined) {
      return <Loading visible />;
    }

    const dig = () => {
      const [x, y] = [player.x, player.y];
      if (board[y][x] !== -1) return;
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
      if (res === null) return;

      setPlayer(res);
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
            {arrowStyles.map((arrow, i) => (
              <ArrowButton
                grid={arrow}
                text={arrowTexts[i]}
                key={i}
                onClick={() => handleMove(dir[i])}
              />
            ))}
          </div>
          <div className={styles.display}>
            <GameDisplay player={player} board={board} />
          </div>
          <div
            className={styles['button-container']}
            style={{ gridArea: 'button', margin: '0 0 0 auto' }}
          >
            <button className={`${styles.button} ${styles['flag-button']}`} onClick={() => frag()}>
              🚩
            </button>
            <button className={`${styles.button} ${styles['open-button']}`} onClick={() => dig()}>
              ⛏️
            </button>
          </div>
        </div>
      </div>
    );
  };
  return <GameController />;
};

export default Controller;
