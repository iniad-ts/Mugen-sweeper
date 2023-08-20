import { playerUseCase } from '$/useCase/playerUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body }) => ({
    status: 200,
    body: await playerUseCase.create(body.name, body.userId),
  }),
}));
