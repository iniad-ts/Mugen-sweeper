import type { DefineMethods } from 'aspida';
import type { GameModel } from './../../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    resBody: GameModel | null;
  };
  post: {
    reqBody: { width: number; height: number; bombRatioPercent: number };
    resBody: GameModel;
  };
}>;
