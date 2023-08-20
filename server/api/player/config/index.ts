import type { UserId } from '../../../commonTypesWithClient/branded';
import type { DefineMethods } from 'aspida';
import type { PlayerModel } from '../../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  post: {
    reqBody: { userId: UserId; name: string };
    resBody: PlayerModel | null;
  };
}>;
