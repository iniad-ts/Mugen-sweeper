import { gameUseCase } from '$/useCase/gameUseCase';
import { playerActionUseCase } from '$/useCase/playerActionUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await gameUseCase.getBoard() }),
  post: async ({ body }) => ({
    status: 201,
    body: await playerActionUseCase.dig(body),
  }),
}));
