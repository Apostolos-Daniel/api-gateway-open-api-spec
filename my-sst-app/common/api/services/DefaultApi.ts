/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { getCustomerResponse } from '../models/getCustomerResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultApi {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GET /{appId}/customers
   * Get a single customer given an app id and phone number
   * @param appId
   * @param phoneNumber
   * @returns getCustomerResponse Get a single customer
   * @throws ApiError
   */
  public getCustomers(
    appId: string,
    phoneNumber: string,
  ): CancelablePromise<getCustomerResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/{appId}/customers',
      path: {
        'appId': appId,
      },
      query: {
        'phoneNumber': phoneNumber,
      },
      errors: {
        400: `Validation errors`,
      },
    });
  }

  /**
   * GET /openapi.yaml
   * OpenAPI specification in YAML format
   * @returns string OpenAPI specification
   * @throws ApiError
   */
  public getOpenapiYaml(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/openapi.yaml',
    });
  }

  /**
   * GET /openapi.json
   * OpenAPI specification in JSON format
   * @returns string OpenAPI specification
   * @throws ApiError
   */
  public getOpenapiJson(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/openapi.json',
    });
  }

  /**
   * GET /docs
   * UI for OpenAPI schema
   * @returns string UI for OpenAPI schema
   * @throws ApiError
   */
  public getDocs(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/docs',
    });
  }

}
