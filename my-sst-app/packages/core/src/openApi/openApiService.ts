export * as OpenApiService from "./openApiService";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { ValidationErrorsHttp } from "./validationErrorsHttp";
import { GetCustomer } from "./getCustomer";
import { GetCustomerQueryParams } from "./getCustomerQueryParams";
import { GetCustomerParams } from "./getCustomerParams";
import { Customer } from "../types/customer";

export function createOpenApiRegistry() {
  const registry = new OpenAPIRegistry();
  //const getCustomerRequestSchema = registry.register("GetCustomerRequest", GetCustomer);
  const getCustomerParamsSchema = registry.register(
    "GetCustomerParams",
    GetCustomerParams
  );
  const getCustomerQueryParamesSchema = registry.register(
    "GetCustomerQueryParams",
    GetCustomerQueryParams
  );
  const getCustomerResponseSchema = registry.register(
    "getCustomerResponse",
    Customer
  );

  let ValidationErrorsSchema: z.ZodType;

  ValidationErrorsSchema = registry.register(
    "ValidationErrors",
    ValidationErrorsHttp
  );

  registry.registerPath({
    method: "get",
    path: "/{appId}/customers",
    summary: "GET /{appId}/customers",
    description: "Get a single customer given an app id and phone number",
    request: {
      params: getCustomerParamsSchema,
      query: getCustomerQueryParamesSchema,
    //   body: {
    //     content: {
    //       "application/json": {
    //         schema: getCustomerRequestSchema,
    //       },
    //     },
    //   },
    },
    responses: {
      200: {
        description: "Get a single customer",
        content: {
          "application/json": {
            schema: getCustomerResponseSchema,
          },
        },
      },
      400: {
        description: "Validation errors",
        content: {
          "application/json": {
            schema: ValidationErrorsSchema,
          },
        },
      },
      500: {
        description: "Server errors",
        content: {
          "text/plain": {
            schema: z.string(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/openapi.yaml",
    summary: "GET /openapi.yaml",
    description: "OpenAPI specification in YAML format",
    responses: {
      200: {
        description: "OpenAPI specification",
        content: {
          "text/yaml": {
            schema: z.string(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/openapi.json",
    summary: "GET /openapi.json",
    description: "OpenAPI specification in JSON format",
    responses: {
      200: {
        description: "OpenAPI specification",
        content: {
          "application/json": {
            schema: z.string(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/docs",
    summary: "GET /docs",
    description: "UI for OpenAPI schema",
    responses: {
      200: {
        description: "UI for OpenAPI schema",
        content: {
          "application/json": {
            schema: z.string(),
          },
        },
      },
    },
  });

  return registry;
}

export function createOpenApiSchema(
  servers: { url: string; description: string }[]
) {
  const openApiRegistry = createOpenApiRegistry();
  const generator = new OpenApiGeneratorV31(openApiRegistry.definitions);

  const openApiDocs = generator.generateDocument({
    openapi: "3.0.3",
    info: {
      version: "1.0.0",
      title: "Customer API",
    },
    servers: servers,
  });
  return openApiDocs;
}
