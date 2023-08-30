import type { Maybe, UserId } from 'commonTypesWithClient/branded';
import type { PlayerModel } from 'commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import GameDisplay from 'src/components/GameDisplay/GameDisplay';
import { Loading } from 'src/components/Loading/Loading';
import LoginModal from 'src/components/LoginModal/LoginModal';
import type { ActionModel, BoardModel, Pos } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { deepCopy } from 'src/utils/deepCopy';
import { CHANGE_FLAG, IS_BLANK_CELL, TYPE_IS } from 'src/utils/flag';
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
    const [displayPos, setDisplayPos] = useState<Pos>();

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

      const resGame = await apiClient.game.$get();

      if (resGame === null) return;

      const newBoard = minesweeperUtils.makeBoard(resGame.bombMap, resGame.userInputs, board);
      setBoard(newBoard);
    }, [openCells, player, board]);

    // 初回レンダリング時のみ;
    const fetchBombMap = async () => {
      const resGame = await apiClient.game.$get();
      const resPlayer = await apiClient.player.config.$post({ body: { playerId: playerIdStr } });
      if (resGame !== null && resPlayer !== null) {
        setBombMap(resGame.bombMap);
        setPlayer(resPlayer);
        setDisplayPos({ x: resPlayer.x, y: resPlayer.y });
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

    if (
      player === undefined ||
      displayPos === undefined ||
      board === undefined ||
      bombMap === undefined
    ) {
      return <Loading visible />;
    }

    const dig = async () => {
      const [x, y] = [player.x, player.y];
      if (bombMap[y][x] === 1) {
        await apiClient.player.bomb.post({ body: player });
        logoutWithLocalStorage();
        alert('you are dead');
        setTimeout(() => router.push('/controller'), 5000);
      }
      if (!TYPE_IS('block', board[y][x])) return;

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
      setDisplayPos({ x: player.x, y: player.y });
    };

    const flag = () => {
      const [x, y] = [player.x, player.y];

      if (!TYPE_IS('block', board[y][x])) return;

      const newBoard = deepCopy<BoardModel>(board);
      newBoard[y][x] = CHANGE_FLAG(newBoard[y][x], 'flag');
      setBoard(newBoard);
    };

    const clickButton = async (action: ActionModel) => {
      const res = await handleMove(action, board, player, displayPos);
      setPlayer(res.player);
      setDisplayPos(res.displayPos);
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
        <GameDisplay player={player} board={board} display={displayPos} />
        <button className={`${styles.button} ${styles.flagButton}`} onClick={flag}>
          🚩
        </button>
        <button className={`${styles.button} ${styles.openButton}`} onClick={dig}>
          ⛏️
        </button>
      </div>
    );
  };
  return <GameController />;
};

export default Controller;
