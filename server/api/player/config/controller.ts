import { playerUseCase } from '$/useCase/playerUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({ status: 200, body: await playerUseCase.getStatus(query.playerId) }),
  post: async ({ body }) => ({
    status: 201,
    body: await playerUseCase.create(body.name),
  }),
}));
