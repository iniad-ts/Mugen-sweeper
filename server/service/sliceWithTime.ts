import type { CellModel } from '$/commonTypesWithClient/models';

export const sliceWithTime = (time: number, cells: (CellModel | null)[]) => {
  const lengthDivide = (cellArray: (CellModel | null)[], divideNum: number) =>
    Math.floor(cellArray.length / divideNum);
  const findWithTimeRecursion = (reCells: (CellModel | null)[]): CellModel | null => {
    const compareCells = reCells[lengthDivide(reCells, 2)];
    if (reCells.length !== 1) {
      if (compareCells === null) return null;
      if (compareCells.whenOpened < time) {
        const nextCells = reCells.slice(0, lengthDivide(reCells, 2) + 1);
        findWithTimeRecursion(nextCells);
      } else {
        const nextCells = reCells.slice(lengthDivide(reCells, 2), reCells.length);
        findWithTimeRecursion(nextCells);
      }
    }
    return reCells[0];
  };
  const basisCell = findWithTimeRecursion(cells);
  const sliceIndex = cells.map((v) => JSON.stringify(v)).indexOf(JSON.stringify(basisCell));
  return cells.slice(0, sliceIndex + 1);
};
