import type { GameModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: GameModel | null;
  };
  post: {
    reqBody: { width: number; height: number; bombRatioPercent: number };
    resBody: GameModel;
  };
}>;
