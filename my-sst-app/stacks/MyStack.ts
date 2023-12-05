import { StackContext, Api, EventBus, Config, Function } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const openApiFunction = new Function(stack, "open-api", {
    handler: "packages/functions/src/openApi.handler",
  });

  const openApiDocsFunction = new Function(stack, "open-api-docs", {
    handler: "packages/functions/src/openApiDocs.handler",
    copyFiles: [
      {
        from: "packages/functions/src/openApi.html",
        to: "packages/functions/src/openApi.html",
      },
    ],
  });

  const api = new Api(stack, "api", {
    routes: {
      "GET /openapi.json": openApiFunction,
      "GET /openapi.yaml": openApiFunction,
      "GET /docs": openApiDocsFunction,
      "GET /{appId}/customers": "packages/functions/src/customer.getCustomer", 
    },
  });

  const httpApiUrlConfig = new Config.Parameter(stack, "HTTP_API", {
    value: api.url,
  });

  openApiFunction.bind([httpApiUrlConfig]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
