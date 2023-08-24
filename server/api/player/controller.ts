import { playerUseCase } from '$/useCase/playerUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await playerUseCase.get() }),
  post: async ({ body }) => ({ status: 201, body: await playerUseCase.move(body) }),
  delete: async ({ body }) => ({ status: 204, body: await playerUseCase.delete(body.id) }),
}));
