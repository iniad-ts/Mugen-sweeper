import { CORS_ORIGIN } from '$/service/envValues';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: CORS_ORIGIN }),
}));
