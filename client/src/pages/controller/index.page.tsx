import type { Maybe, UserId } from 'commonTypesWithClient/branded';
import type { PlayerModel } from 'commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import GameDisplay from 'src/components/GameDisplay/GameDisplay';
import { Loading } from 'src/components/Loading/Loading';
import LoginModal from 'src/components/LoginModal/LoginModal';
import type { ActionModel, BoardModel } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { deepCopy } from 'src/utils/deepCopy';
import { formatOpenCells } from 'src/utils/formatOpenCells';
import { handleMove } from 'src/utils/handleMove';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';
import { ArrowButton } from './Button/index.page';
import styles from './index.module.css';

const arrowTexts = ['▲', '▼', '◀', '▶'];

const actions: ActionModel[] = ['up', 'down', 'left', 'right', 'ur', 'ul', 'dr', 'dl'];

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
        return (
          <div className={styles.container}>
            <div>you dead</div>
          </div>
        );
      }
      if (board[y][x] !== -1) return;
      const newBoard = deepCopy<BoardModel>(board);
      const newOpenCells = new Set(openCells);
      const openSurroundingCells = (x: number, y: number, isUserInput: boolean) => {
        newBoard[y][x] = minesweeperUtils.countAroundBombsNum(bombMap, x, y);
        newOpenCells.add(JSON.stringify([x, y, isUserInput, newBoard[y][x]]));
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

    const flag = () => {
      const [x, y] = [player.x, player.y];
      const newBoard = deepCopy<BoardModel>(board);
      newBoard[y][x] = newBoard[y][x] === -1 ? 10 : -1;
      setBoard(newBoard);
    };

    const clickButton = async (action: ActionModel) => {
      const res = await handleMove(action, board, player);
      setPlayer(res);
    };

    return (
      <div className={styles.container}>
        <div className={styles.controller}>
          <div className={styles['buttonContainer']} style={{ gridArea: 'cross' }}>
            {actions.map((action, i) => (
              <ArrowButton
                text={arrowTexts[i]}
                key={i}
                action={action}
                onClick={() => clickButton(action)}
              />
            ))}
          </div>
          <div className={styles.display}>
            <GameDisplay player={player} board={board} />
          </div>
          <div
            className={styles['buttonContainer']}
            style={{ gridArea: 'button', margin: '0 0 0 auto' }}
          >
            <button className={`${styles.button} ${styles['flagButton']}`} onClick={flag}>
              🚩
            </button>
            <button className={`${styles.button} ${styles['openButton']}`} onClick={dig}>
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
