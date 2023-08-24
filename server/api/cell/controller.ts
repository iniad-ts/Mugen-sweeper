import { cellsRepository } from '$/repository/cellsRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await cellsRepository.findAll() }),
}));
