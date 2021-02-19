import { schema } from '@kbn/config-schema';
import { IRouter } from '../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/instant_on_integrations/pipeline',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const resp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'ingest.getPipeline'
        );
        return response.ok({
          body: {
            pipelines: resp,
          },
        });
      } catch (error) {
        if (error.statusCode === 404)
          return response.ok({
            body: {
              pipelines: [],
            },
          });
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );

  router.delete(
    {
      path: '/api/instant_on_integrations/pipeline/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      const { id } = request.params;
      try {
        const resp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'ingest.deletePipeline',
          { id }
        );
        return response.ok({
          body: resp,
        });
      } catch (error) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );

  router.put(
    {
      path: '/api/instant_on_integrations/pipeline/{id}',
      validate: {
        body: schema.object({
          description: schema.maybe(schema.string()),
          processors: schema.arrayOf(schema.recordOf(schema.string(), schema.any())),
          version: schema.maybe(schema.number()),
          on_failure: schema.maybe(schema.arrayOf(schema.recordOf(schema.string(), schema.any()))),
        }),
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      const { id } = request.params;
      try {
        const resp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'ingest.putPipeline',
          {
            id,
            body: request.body,
          }
        );
        return response.ok({
          body: resp,
        });
      } catch (error) {
        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );
}
