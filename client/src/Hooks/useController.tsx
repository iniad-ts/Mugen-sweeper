import type { Maybe, UserId } from 'commonTypesWithClient/branded';
import type { PlayerModel, Pos } from 'commonTypesWithClient/models';
import { useCallback, useEffect, useState } from 'react';
import type { ActionModel, BoardModel } from 'src/types/types';
import { apiClient } from 'src/utils/apiClient';
import { deepCopy } from 'src/utils/deepCopy';
import { CELL_FLAGS, CHANGE_FLAG, IS_BLANK_CELL, TYPE_IS } from 'src/utils/flag';
import { formatOpenCells } from 'src/utils/formatOpenCells';
import { handleMove } from 'src/utils/handleMove';
import { handleTransform } from 'src/utils/handleTransform';
import { logoutWithLocalStorage } from 'src/utils/loginWithLocalStorage';
import { minesweeperUtils } from 'src/utils/minesweeperUtils';

const directions = ['ul', 'left', 'dl', 'down', 'right', 'dr', 'up', 'ur', 'middle'];

export const useController = (playerIdStr: string | null) => {
  const [bombMap, setBombMap] = useState<BoardModel>();
  const [board, setBoard] = useState<BoardModel>();
  const [openCells, setOpenCells] = useState<Set<string>>(new Set());
  const [player, setPlayer] = useState<PlayerModel>();
  const [displayPos, setDisplayPos] = useState<Pos>();
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [dir, setDir] = useState(0);

  useEffect(() => {
    if ([transform.x, transform.y].some(Boolean)) {
      setTimeout(() => {
        setTransform({ x: 0, y: 0 });
      }, 0);
    }
  }, [transform.x, transform.y]);

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

  const fetchBombMap = useCallback(async () => {
    if (playerIdStr === null) return;
    const resGame = await apiClient.game.$get();
    const resPlayer = await apiClient.player.config.$post({
      body: { playerId: playerIdStr as Maybe<UserId> },
    });

    if (resGame !== null) {
      setBombMap(resGame.bombMap);
    }
    if (resPlayer !== null) {
      setPlayer(resPlayer);
      setDisplayPos({ x: resPlayer.x, y: resPlayer.y });
    }
  }, [playerIdStr]);

  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchGame();
    }, 2000);
    return () => clearInterval(cancelId);
  }, [fetchGame]);

  useEffect(() => {
    fetchBombMap();
  }, [fetchBombMap]);

  if (player === undefined || displayPos === undefined || board === undefined) {
    return null;
  }
  const dig = async () => {
    const [x, y] = [player.x, player.y];

    const newBoard = deepCopy<BoardModel>(board);

    if (bombMap?.[y][x] === 1) {
      newBoard[y][x] |= CELL_FLAGS['bomb'];
      await apiClient.player.bomb.post({ body: player });
      setBoard(newBoard);
      logoutWithLocalStorage();
      return;
    }
    if (!TYPE_IS('block', board[y][x])) return;

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
    setDir(Math.floor(directions.findIndex((a) => a === action) / 2) % 4);
    setTransform(handleTransform(action, res.displayPos, displayPos));
  };
  return { board, player, clickButton, transform, dir, displayPos, flag, dig };
};
