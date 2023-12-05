import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Customer } from "../types/customer";

extendZodWithOpenApi(z);

export const GetCustomerParams = Customer.pick({ appId: true });

export type GetCustomerParams = z.infer<
  typeof GetCustomerParams
>;
