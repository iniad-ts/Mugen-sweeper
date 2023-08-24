import type { DefineMethods } from 'aspida';
import type { PlayerModel } from '../../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  post: {
    reqBody: PlayerModel;
  };
}>;
