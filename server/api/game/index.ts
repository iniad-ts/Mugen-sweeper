import type { CellModel, GameModel, PlayerModel } from '../../commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: GameModel | null;
  };
  post: {
    reqBody: CellModel[];

    resBody: PlayerModel | null;
  };
};
