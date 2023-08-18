import type { GameId, TaskId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type TaskModel = {
  id: TaskId;
  label: string;
  done: boolean;
  created: number;
};

export type GameModel = {
  id: GameId;
  bombMap: (0 | 1)[][];
  userInputs: (0 | 1 | 2)[][];
};

export type Cell = {
  where: { x: number; y: number };
  whoOpened: UserId | null;
  whenOpened: number | null;
};
