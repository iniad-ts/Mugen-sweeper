import type { DefineMethods } from 'aspida';
import type { UserId } from '../../../commonTypesWithClient/branded';
import type { PlayerModel } from '../../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: { query: { playerId: string }; resBody: PlayerModel | null };
  post: {
    reqBody: { userId: UserId; name: string };
    resBody: PlayerModel | null;
  };
}>;
