import type { DefineMethods } from 'aspida';
import type { UserId } from '../../../commonTypesWithClient/branded';
import type { PlayerModel } from './../../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  post: {
    reqBody: {
      name: string;
      userId: UserId;
    };
    resBody: PlayerModel | null;
  };
}>;
