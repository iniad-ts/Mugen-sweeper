import type { DefineMethods } from 'aspida';
import type { CellModel } from '../../commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    resBody: CellModel[];
  };
}>;
