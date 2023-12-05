
import { GetCustomer } from '@my-sst-app/core/openApi/getCustomer';
import { GetCustomerParams } from '@my-sst-app/core/openApi/getCustomerParams';
import { GetCustomerQueryParams } from '@my-sst-app/core/openApi/getCustomerQueryParams';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from "crypto";
import { openApiLambdaHttpHandler } from './utils/openApiLambdaHttpHandler';

export const getCustomerImpl = openApiLambdaHttpHandler<
GetCustomer,
GetCustomerParams,
GetCustomerQueryParams
>(async (request) => {
const customer = {
    appId: request.pathParameters.appId, // pathParameters is type of GetCustomerParams
    phoneNumber: request.queryParameters.phoneNumber, // queryParameters is type of GetCustomerQueryParams
    loyaltyCardId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    customerId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
};
  try {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: customer
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "text/plain" },
      body: e.toString()
    }
  }
});

export const getCustomer = getCustomerImpl;