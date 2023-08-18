import { gameUseCase } from '$/useCase/gameUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 201, body: await gameUseCase.getBoard() }),
  post: async ({ body }) => ({
    status: 200,
    body: await gameUseCase.create(body.width, body.height, body.bombRatioPercent),
  }),
}));
