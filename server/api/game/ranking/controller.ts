import { gameUseCase } from '$/useCase/gameUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await gameUseCase.getRanking() }),
}));
