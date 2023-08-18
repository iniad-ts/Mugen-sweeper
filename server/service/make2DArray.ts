export const make2DArray = (width: number, height: number):0[][] =>
  [...Array(height)].map(() => [...Array(width)].map(() => 0));
