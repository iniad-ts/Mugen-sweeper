import { z } from 'zod';
import type { GameId, TaskId, UserId } from '../commonTypesWithClient/branded';

const createIdParser = <T extends string>() => z.string() as unknown as z.ZodType<T>;

export const taskIdParser: z.ZodType<TaskId> = z.string().brand<'TaskId'>();

export const gameIdParser: z.ZodType<GameId> = z.string().brand<'GameId'>();
export const userIdParser = createIdParser<UserId>();
