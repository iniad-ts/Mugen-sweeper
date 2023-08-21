export type ActionModel = 'left' | 'right' | 'up' | 'down';



export type OpenCellModel = { x: number; y: number; isUserInput: boolean; value: number };

export type Pos = {
  x: number;
  y: number;
};
export type BoardModel = number[][];
