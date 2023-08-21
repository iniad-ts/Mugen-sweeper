import type { DefineMethods } from 'aspida';
import type { PlayerModel } from './../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    resBody: PlayerModel[];
  };
  post: {
    reqBody: PlayerModel;
    resBody: PlayerModel | null;
  };
}>;
