import type { PlayerModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: {
      name: string;
    };
    resBody: PlayerModel | null;
  };
}>;
