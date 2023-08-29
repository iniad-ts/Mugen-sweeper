import type { UserId } from '$/commonTypesWithClient/branded';
import type { CellModel, PlayerModel, Pos } from '$/commonTypesWithClient/models';
import { cellsRepository } from '$/repository/cellsRepository';
import { playersRepository } from '$/repository/playersRepository';
import { cellUseCase } from './cellUseCase';
import { gameUseCase } from './gameUseCase';
import { playerUseCase } from './playerUseCase';

export const playerActionUseCase = {
  dig: async (cells: CellModel[]) => {
    cells.forEach((cell) => cellsRepository.create({ ...cell }));
    const playerId = cells[0].whoOpened;
    const player = await playersRepository.find(playerId);
    if (player === null) return null;
    const newPlayer = { ...player, score: player.score + cells.length };
    return await playersRepository.save(newPlayer);
  },

  explosion: async (player: PlayerModel) => {
    const res = await cellsRepository.findWithPlayer(player.id);
    if (res === null) return null;
    res.forEach((cell) => cellsRepository.delete(cell.x, cell.y, cell.whoOpened));
    const newPlayer = { ...player, isAlive: false };
    return await playersRepository.save(newPlayer);
  },

  putFlag: async (userId: UserId, focusPos: Pos) => {
    const newCell: CellModel = {
      x: focusPos.x,
      y: focusPos.y,
      cellValue: 9,
      whoOpened: userId,
      whenOpened: new Date().getTime(),
      isUserInput: true,
    };
    return await cellsRepository.create(newCell);
  },

  digBombCell: async (player: PlayerModel) => {
    await cellUseCase.delete(player.id);
    const res = await gameUseCase.getRanking();
    const isInRanking = res.find((ranker) => ranker.id === player.id) !== undefined;
    if (isInRanking) return;
    await playerUseCase.delete(player.id);
  },
};
