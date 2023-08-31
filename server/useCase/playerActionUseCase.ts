import type { CellModel, PlayerModel } from '$/commonTypesWithClient/models';
import { cellsRepository } from '$/repository/cellsRepository';
import { playersRepository } from '$/repository/playersRepository';
import { cellUseCase } from './cellUseCase';
import { gameUseCase } from './gameUseCase';
import { playerUseCase } from './playerUseCase';

export const playerActionUseCase = {
  dig: async (cells: CellModel[]) => {
    const resLength = await Promise.all(cells.map((cell) => cellsRepository.create({ ...cell }))).then(
      (results) => results.filter((result) => result !== null).length
    );
    const playerId = cells[0].whoOpened;
    const player = await playersRepository.find(playerId);
    if (player === null) return null;
    const newPlayer = { ...player, score: player.score + resLength };
    return await playersRepository.save(newPlayer);
  },

  explosion: async (player: PlayerModel) => {
    await cellUseCase.delete(player.id);
    const res = await gameUseCase.getRanking();
    const isInRanking = res.find((ranker) => ranker.id === player.id) !== undefined;
    if (isInRanking) {
      const newPLayer: PlayerModel = { ...player, isAlive: false };
      await playersRepository.save(newPLayer);
      return;
    }
    await playerUseCase.delete(player.id);
  },
};
