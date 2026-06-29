import path from 'node:path';
import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';
import { youtubeRoutes } from './modules/youtube/routes';

dotenv.config();

export const app = fastify({
  logger: true,
});

const frontendDistPath = path.resolve(__dirname, '../../dist');

app.register(cors, {
  origin: '*', // TODO: restrict in production
});

app.register(swagger, {
  swagger: {
    info: {
      title: 'InglesAsFácil API',
      description: 'API para a plataforma de aprendizado de inglês',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  }
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
});

app.register(fastifyStatic, {
  root: frontendDistPath,
  prefix: '/',
  wildcard: false,
  index: false,
  list: false,
});

app.register(youtubeRoutes, { prefix: '/api/youtube' });

// Basic health check route
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

app.setNotFoundHandler(async (request, reply) => {
  if (request.method === 'HEAD') {
    return reply.code(404).send();
  }

  if (request.method !== 'GET') {
    return reply.code(404).send({ error: 'Not Found' });
  }

  const pathname = request.raw.url?.split('?')[0] ?? '/';
  const isApiRoute = pathname.startsWith('/api') || pathname.startsWith('/docs') || pathname.startsWith('/health');
  const hasExtension = path.extname(pathname) !== '';

  if (isApiRoute || hasExtension) {
    return reply.code(404).send({ error: 'Not Found' });
  }

  return reply.sendFile('index.html', frontendDistPath);
});
