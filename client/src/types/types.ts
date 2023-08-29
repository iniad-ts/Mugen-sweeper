export type ActionModel = 'left' | 'right' | 'up' | 'down' | 'ur' | 'ul' | 'dr' | 'dl' | 'middle';

export type OpenCellModel = [number, number, boolean, number];

export type Pos = {
  x: number;
  y: number;
};
export type BoardModel = number[][];
