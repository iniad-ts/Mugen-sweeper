import { gameUseCase } from '$/useCase/gameUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  delete: async () => ({ status: 200, body: await gameUseCase.deleteAll() }),
}));
