import { playerActionUseCase } from '$/useCase/playerActionUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body }) => ({ status: 201, body: await playerActionUseCase.explosion(body) }),
}));
