import { init } from '$/service/app';
import { PORT } from '$/service/envValues';
import { prismaClient } from '$/service/prismaClient';
import { cellUseCase } from '$/useCase/cellUseCase';
import { exec } from 'child_process';
import type { FastifyInstance } from 'fastify';
import util from 'util';
import { afterEach, beforeEach } from 'vitest';
let server: FastifyInstance;

const unneededServer = (file: { filepath?: string } | undefined) =>
  !/\/tests\/api\/.+\.test\.ts$/.test(file?.filepath ?? '');

beforeEach(async (info) => {
  if (unneededServer(info.meta.file)) return;

  await util.promisify(exec)('npx prisma migrate reset --force');
  await util.promisify(exec)('npx prisma db seed');

  server = init();

  await server.listen({ port: PORT, host: '0.0.0.0' });
});

afterEach(async (info) => {
  if (unneededServer(info.meta.file)) return;

  await prismaClient.$disconnect();

  cellUseCase.stop();

  await server.close();
});
