import { OpenApiService } from "../../core/src/openApi/openApiService";
import * as yaml from "yaml";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Config } from "sst/node/config";

export const handler = async (
  _evt: APIGatewayProxyEventV2
) => {
  let path: string;
  let servers: { url: string; description: string }[];

    // Http API Gateway
    path = _evt.rawPath;
    servers = [{ url: Config.HTTP_API, description: "HTTP API Gateway" }];
 

  const openApiDocs = OpenApiService.createOpenApiSchema(
    servers,
  );

  if (path.includes("/openapi.json")) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(openApiDocs),
    };
  } else if (path.includes("/openapi.yaml")) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/yaml",
        "Cache-Control": "no-store",
      },
      body: yaml.stringify(openApiDocs),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
      },
      body: "Not Found",
    };
  }
};