import { z } from 'zod';
import type { GameId, TaskId, UserId } from '../commonTypesWithClient/branded';

export const userIdParser: z.ZodType<UserId> = z.string().brand<'UserId'>();

export const taskIdParser: z.ZodType<TaskId> = z.string().brand<'TaskId'>();

export const gameIdParser: z.ZodType<GameId> = z.string().brand<'GameId'>();
