import type { Maybe, UserId } from '$/commonTypesWithClient/branded';
import type { DefineMethods } from 'aspida';
import type { PlayerModel } from '../../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  post: {
    reqBody: { playerId: Maybe<UserId> };
    resBody: PlayerModel | null;
  };
}>;
