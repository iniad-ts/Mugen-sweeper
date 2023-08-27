import type { Maybe, UserId } from 'commonTypesWithClient/branded';
import type { PlayerModel } from 'commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import GameDisplay from 'src/components/GameDisplay/GameDisplay';
import { Loading } from 'src/components/Loading/Loading';
import LoginModal from 'src/components/LoginModal/LoginModal';
import type { ActionModel, BoardModel } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { CELL_FLAGS, CHANGE_FLAG, IS_BLANK_CELL } from 'src/utils/boardFlag';
import { deepCopy } from 'src/utils/deepCopy';
import { formatOpenCells } from 'src/utils/formatOpenCells';
import { handleMove } from 'src/utils/handleMove';
import { logoutWithLocalStorage } from 'src/utils/loginWithLocalStorage';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import styles from './index.module.css';

const arrowTexts = ['', '▲', '', '◀', '', '▶', '', '▼', ''];

const actions: ActionModel[] = ['ul', 'up', 'ur', 'left', 'middle', 'right', 'dl', 'down', 'dr'];

const Controller = () => {
  const router = useRouter();
  const playerIdStr =
    typeof router.query.playerId === 'string' ? (router.query.playerId as Maybe<UserId>) : null;

  if (playerIdStr === null) {
    return <LoginModal />;
  }

  const GameController = () => {
    const [bombMap, setBombMap] = useState<BoardModel>();
    const [board, setBoard] = useState<BoardModel>();
    const [openCells, setOpenCells] = useState<Set<string>>(new Set());
    const [player, setPlayer] = useState<PlayerModel>();

    const fetchGame = useCallback(async () => {
      if (player === undefined) return;
      if (openCells?.size > 0) {
        const postCells = formatOpenCells(openCells, player.id);
        const resPlayer = await apiClient.game.$post({ body: postCells });
        setOpenCells(new Set());
        if (resPlayer === null) return;
        const newPlayer: PlayerModel = { ...player, score: resPlayer.score };
        setPlayer(newPlayer);
      }
      const res = await apiClient.game.$get();
      if (res === null) return;
      const newBoard = minesweeperUtils.makeBoard(res.bombMap, res.userInputs, board);
      setBoard(newBoard);
    }, [openCells, player, board]);

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

    const dig = async () => {
      const [x, y] = [player.x, player.y];
      if (bombMap[y][x] === 1) {
        await apiClient.player.bomb.post({ body: player });
        logoutWithLocalStorage();
        router.push('/controller');
      }
      if (board[y][x] !== -1) return;
      const newBoard = deepCopy<BoardModel>(board);
      const newOpenCells = new Set(openCells);
      const openSurroundingCells = (x: number, y: number, isUserInput: boolean) => {
        newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);
        newOpenCells.add(JSON.stringify([x, y, isUserInput, newBoard[y][x]]));
        if (IS_BLANK_CELL(newBoard[y][x])) {
          minesweeperUtils.aroundCellToArray(newBoard, x, y).forEach((nextPos) => {
            openSurroundingCells(nextPos.x, nextPos.y, false);
          });
        }
      };
      openSurroundingCells(x, y, true);
      setOpenCells(newOpenCells);
      setBoard(newBoard);
    };

    const flag = () => {
      const [x, y] = [player.x, player.y];
      const newBoard = deepCopy<BoardModel>(board);
      newBoard[y][x] = CHANGE_FLAG(newBoard[y][x], CELL_FLAGS['flag'], CELL_FLAGS['unFlag']);
      setBoard(newBoard);
    };

    const clickButton = async (action: ActionModel) => {
      const res = await handleMove(action, board, player);
      setPlayer(res);
    };

    return (
      <div className={styles.controller}>
        <div className={styles.moveButton}>
          {actions.map((action, i) => (
            <button key={i} onClick={() => clickButton(action)} className={styles.button}>
              {arrowTexts[i]}
            </button>
          ))}
        </div>
        <GameDisplay player={player} board={board} />
        <div className={styles.actionButton}>
          <button className={`${styles.button} ${styles.flagButton}`} onClick={flag}>
            🚩
          </button>
          <button className={`${styles.button} ${styles.openButton}`} onClick={dig}>
            ⛏️
          </button>
        </div>
      </div>
    );
  };
  return <GameController />;
};

export default Controller;
