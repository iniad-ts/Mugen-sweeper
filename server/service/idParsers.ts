import { z } from 'zod';
import type { GameId, TaskId, UserId } from '../commonTypesWithClient/branded';

const createIdParser = <T extends string>() => z.string() as unknown as z.ZodType<T>;

export const taskIdParser = createIdParser<TaskId>();

export const gameIdParser = createIdParser<GameId>();
export const userIdParser = createIdParser<UserId>();
