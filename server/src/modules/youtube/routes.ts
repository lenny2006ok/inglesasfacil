import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { searchYoutubeVideos } from './search';

interface SearchQuery {
  q?: string;
  maxResults?: string;
}

export async function youtubeRoutes(app: FastifyInstance) {
  app.get('/search', async (request: FastifyRequest<{ Querystring: SearchQuery }>, reply: FastifyReply) => {
    const query = request.query.q?.trim() ?? '';

    if (!query) {
      return reply.code(400).send({ error: 'Please provide a search query.' });
    }

    try {
      const maxResults = Number(request.query.maxResults ?? 6);
      const results = await searchYoutubeVideos(query, Number.isFinite(maxResults) && maxResults > 0 ? maxResults : 6);

      return {
        query,
        results,
      };
    } catch (error) {
      app.log.error(error);
      return reply.code(502).send({
        error: 'Unable to search YouTube right now.',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
